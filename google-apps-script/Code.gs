/**
 * Ontographica website forms → Google Sheets.
 *
 * Paste this into Extensions > Apps Script of the Google Sheet that should hold the responses,
 * then deploy it as a web app (see README, "Form responses"). Each form writes to its own tab;
 * the tab and its header row are created on the first submission.
 */

// Set to "" to stop the email sent for each new response.
const NOTIFY_EMAIL = "founder@ontographica.com";

// Columns per form. `key` is the field the website sends; `submittedAt` is filled in here.
const FORMS = {
  enquiry: {
    sheet: "Enquiries",
    columns: [
      ["Submitted at", "submittedAt"],
      ["Enquiry type", "type"],
      ["Name", "name"],
      ["Email", "email"],
      ["Organisation", "organisation"],
      ["Role", "role"],
      ["Message", "message"],
      ["Page", "page"],
    ],
  },
  network: {
    sheet: "Network",
    columns: [
      ["Submitted at", "submittedAt"],
      ["Taking part as", "contribution"],
      ["Name", "name"],
      ["Email", "email"],
      ["Role", "role"],
      ["Organisation", "company"],
      ["Field", "field"],
      ["Experience", "experience"],
      ["LinkedIn", "linkedin"],
      ["What they'd bring", "message"],
      ["Page", "page"],
    ],
  },
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Spam trap: real visitors never fill this hidden field. Pretend success, store nothing.
    if (data.website) return reply({ ok: true });

    const form = FORMS[data.form];
    if (!form) return reply({ ok: false, error: "Unknown form" });
    if (!data.name || !data.email) return reply({ ok: false, error: "Missing required fields" });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = sheetFor(form);
      const row = form.columns.map(([, key]) => (key === "submittedAt" ? new Date() : clean(data[key])));
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    if (NOTIFY_EMAIL) notify(form, data);
    return reply({ ok: true });
  } catch (error) {
    return reply({ ok: false, error: String(error) });
  }
}

function sheetFor(form) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(form.sheet);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(form.sheet);
    sheet.appendRow(form.columns.map(([header]) => header));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, form.columns.length).setFontWeight("bold");
  }
  return sheet;
}

// Trims overly long input and stops text starting with = + - @ being run as a spreadsheet formula.
function clean(value) {
  const text = value == null ? "" : String(value).slice(0, 5000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function notify(form, data) {
  const lines = form.columns
    .filter(([, key]) => key !== "submittedAt")
    .map(([header, key]) => header + ": " + (data[key] || ""));
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: data.email,
    subject: "New " + form.sheet.toLowerCase() + " response: " + data.name,
    body: lines.join("\n"),
  });
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

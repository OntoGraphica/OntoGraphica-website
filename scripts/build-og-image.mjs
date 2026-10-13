// Renders public/og-image.png (1200×630) for social sharing previews.
// Usage: node scripts/build-og-image.mjs ["<path to Ontographica Media folder>"]

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mediaDir = path.resolve(process.argv[2] ?? path.join(root, "..", "Ontographica Media"));

const bg = "#05070B";
const fg = "#EEF1F6";
const muted = "#7B8494";
const brand = "#F5253B";
const campus = "#4A7BF7";
const candidate = "#F2B630";
const sans = "Segoe UI, Helvetica, Arial, sans-serif";
const mono = "Consolas, Menlo, monospace";

// The spiral, mirrored and traced from its centre outwards, ending at its top point.
function spiral(cx, cy, r) {
  const s = r / 1000;
  const y = (v) => (cy + v * s).toFixed(2);
  const a = (v) => (v * s).toFixed(2);
  return [
    `M ${cx} ${y(-143)}`,
    `A ${a(357)} ${a(357)} 0 0 1 ${cx} ${y(571)}`,
    `A ${a(571)} ${a(571)} 0 0 1 ${cx} ${y(-572)}`,
    `A ${a(786)} ${a(786)} 0 0 1 ${cx} ${y(1000)}`,
    `A ${a(1000)} ${a(1000)} 0 0 1 ${cx} ${y(-1000)}`,
  ].join(" ");
}

const r = 225;
const cx = 925;
const cy = 268;
const railY = 540;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="0.75" cy="0.45" r="0.55">
      <stop offset="0" stop-color="${brand}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${brand}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${bg}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <path d="${spiral(cx, cy, r)}" fill="none" stroke="${brand}" stroke-width="26" stroke-opacity="0.92"/>
  <text x="72" y="270" font-family="${sans}" font-size="96" font-weight="600" letter-spacing="-4" fill="${fg}">Knowledge,</text>
  <text x="72" y="370" font-family="${sans}" font-size="96" font-weight="600" letter-spacing="-4" fill="${brand}">Engineered.</text>
  <path d="M 72 ${railY} L 430 ${railY}" stroke="${muted}" stroke-opacity="0.5" stroke-width="2"/>
  <path d="M 430 ${railY} L 780 ${railY}" stroke="${campus}" stroke-width="3"/>
  <path d="M 780 ${railY} L 1128 ${railY}" stroke="${candidate}" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>
  <circle cx="430" cy="${railY}" r="6" fill="${campus}"/>
  <circle cx="780" cy="${railY}" r="6" fill="${bg}" stroke="${candidate}" stroke-width="2.5"/>
  <text x="72" y="${railY + 40}" font-family="${mono}" font-size="17" letter-spacing="2" fill="${muted}">LEARNING</text>
  <text x="430" y="${railY + 40}" font-family="${mono}" font-size="17" letter-spacing="2" fill="#8FB3FF">PRACTICE · ONTOCAMPUS</text>
  <text x="780" y="${railY + 40}" font-family="${mono}" font-size="17" letter-spacing="2" fill="#F2CD78">OPPORTUNITY · ONTOCANDIDATE</text>
</svg>`;

// The official on-black lockup, with its text matched to the site's foreground.
const lockupSvg = await readFile(path.join(mediaDir, "logos", "lockup-on-black.svg"), "utf8");
const lockup = await sharp(Buffer.from(lockupSvg.replaceAll("#F2F0EC", fg)))
  .resize({ width: 300 })
  .png()
  .toBuffer();

await sharp(Buffer.from(svg))
  .composite([{ input: lockup, left: 72, top: 64 }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, "public", "og-image.png"));

console.log("Wrote public/og-image.png");

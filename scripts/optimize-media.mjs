// Converts the source OntoCampus screenshots into web-optimised WebP files.
//
// Usage: npm run media -- "<path to Ontographica Media folder>"
// Default source: ../Ontographica Media (sibling of this project folder).
// Output: public/media/<light|dark>/<name>-<width>.webp

import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.resolve(process.argv[2] ?? path.join(root, "..", "Ontographica Media"));
const screenshotDir = path.join(sourceDir, "OntoCampus inapp Screenshots");
const outDir = path.join(root, "public", "media");

// Only screens that are safe and useful to publish. Deliberately excluded:
// - facilitator-cohort: exposes a local URL and the AI model provider.
// - student-code: shows a facilitator-only reference solution.
const screens = [
  // The site runs on a dark canvas, so it uses the dark-mode captures throughout.
  { mode: "dark", name: "student-guide" },
  { mode: "dark", name: "student-workspace" },
  { mode: "dark", name: "student-chat" },
  { mode: "dark", name: "student-plan" },
  { mode: "dark", name: "student-product" },
  { mode: "dark", name: "facilitator-pathway" },
  { mode: "dark", name: "facilitator-events" },
  { mode: "dark", name: "analysis-overview", crop: { left: 0, top: 0, width: 3200, height: 2000 } },
  { mode: "dark", name: "facilitator-audit" },
  // Just the competency radar, without the student list beside it.
  { mode: "dark", name: "candidate-profile", crop: { left: 1166, top: 90, width: 2034, height: 1890 } },
];

const widths = [960, 1600];

await rm(outDir, { recursive: true, force: true });

for (const { mode, name, crop } of screens) {
  const input = path.join(screenshotDir, mode, `${name}.png`);
  await mkdir(path.join(outDir, mode), { recursive: true });
  for (const width of widths) {
    const output = path.join(outDir, mode, `${name}-${width}.webp`);
    let pipeline = sharp(input);
    if (crop) pipeline = pipeline.extract(crop);
    const info = await pipeline.resize({ width }).webp({ quality: 80, effort: 6 }).toFile(output);
    console.log(`${mode}/${path.basename(output)}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  }
}

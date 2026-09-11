import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), ".tmp-verify");
mkdirSync(dir, { recursive: true });

async function makePdf(name, title) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([400, 300]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  page.drawText(title, { x: 40, y: 160, size: 24, font, color: rgb(0.1, 0.1, 0.1) });
  const bytes = await doc.save();
  writeFileSync(join(dir, name), bytes);
  return bytes;
}

const a = await makePdf("a.pdf", "Alpha");
const b = await makePdf("b.pdf", "Bravo");

const merged = await PDFDocument.create();
for (const bytes of [a, b]) {
  const src = await PDFDocument.load(bytes);
  const pages = await merged.copyPages(src, src.getPageIndices());
  pages.forEach((p) => merged.addPage(p));
}
const mergedBytes = await merged.save();
writeFileSync(join(dir, "merged.pdf"), mergedBytes);
const check = await PDFDocument.load(mergedBytes);
if (check.getPageCount() !== 2) {
  throw new Error(`expected 2 pages, got ${check.getPageCount()}`);
}

const imgDoc = await PDFDocument.create();
// 1x1 red jpeg header is painful; embed a pdf-lib page instead as sanity
const jpgPage = imgDoc.addPage([200, 200]);
jpgPage.drawRectangle({ x: 20, y: 20, width: 160, height: 160, color: rgb(0.8, 0.1, 0.1) });
writeFileSync(join(dir, "box.pdf"), await imgDoc.save());

const roundtrip = await PDFDocument.load(readFileSync(join(dir, "merged.pdf")));
console.log("OK merge pages:", roundtrip.getPageCount());
console.log("OK files written to", dir);

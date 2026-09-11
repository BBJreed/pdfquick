import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun } from "docx";
import type { ToolId } from "./config";
import { zipStore } from "./zip";

export type CompressLevel = "low" | "medium" | "high";

export type RedactOptions = {
  ssn: boolean;
  email: boolean;
  phone: boolean;
  custom: string;
};

export type ProcessOptions = {
  level?: CompressLevel;
  redact?: RedactOptions;
};

export type ProcessResult = {
  bytes: Uint8Array;
  filename: string;
  mime: string;
  note?: string;
};

function stem(name: string) {
  return name.replace(/\.[^.]+$/, "") || "file";
}

async function loadPdf(file: File) {
  const data = await file.arrayBuffer();
  try {
    return await PDFDocument.load(data);
  } catch {
    throw new Error(
      `"${file.name}" is password-protected or not a readable PDF.`,
    );
  }
}

export async function mergePdfs(files: File[]): Promise<ProcessResult> {
  if (files.length < 2) throw new Error("Drop at least two PDFs to merge.");
  const out = await PDFDocument.create();
  for (const file of files) {
    const doc = await loadPdf(file);
    const pages = await out.copyPages(doc, doc.getPageIndices());
    for (const page of pages) out.addPage(page);
  }
  const bytes = await out.save({ useObjectStreams: true });
  return {
    bytes,
    filename: `${stem(files[0].name)}-merged.pdf`,
    mime: "application/pdf",
    note: `${files.length} files, ${out.getPageCount()} pages`,
  };
}

async function ensurePdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjs;
}

async function rasterizePdf(
  data: ArrayBuffer,
  scale: number,
  quality: number,
): Promise<Uint8Array> {
  const pdfjs = await ensurePdfjs();
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
  const out = await PDFDocument.create();

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not create a canvas to compress this PDF.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({
      canvasContext: ctx,
      viewport,
      canvas,
    }).promise;
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("JPEG encode failed."))),
        "image/jpeg",
        quality,
      );
    });
    const jpg = new Uint8Array(await blob.arrayBuffer());
    const image = await out.embedJpg(jpg);
    const p = out.addPage([image.width, image.height]);
    p.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  return out.save({ useObjectStreams: true });
}

export async function compressPdf(
  file: File,
  level: CompressLevel = "medium",
): Promise<ProcessResult> {
  const original = file.size;
  const data = await file.arrayBuffer();
  let bytes: Uint8Array;

  if (level === "low") {
    const doc = await PDFDocument.load(data);
    bytes = await doc.save({ useObjectStreams: true });
  } else {
    const scale = level === "medium" ? 1.35 : 0.95;
    const quality = level === "medium" ? 0.72 : 0.52;
    bytes = await rasterizePdf(data, scale, quality);
  }

  const saved = original - bytes.byteLength;
  const pct = original === 0 ? 0 : Math.round((saved / original) * 100);
  const note =
    saved > 0
      ? `${pct}% smaller (${formatMb(original)} → ${formatMb(bytes.byteLength)})`
      : `Rewritten (${formatMb(bytes.byteLength)}). Original was already small.`;

  return {
    bytes,
    filename: `${stem(file.name)}-compressed.pdf`,
    mime: "application/pdf",
    note,
  };
}

function formatMb(n: number) {
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

type TextItem = { str: string; x: number; y: number };

function groupLines(items: TextItem[]) {
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);
  const lines: { y: number; parts: TextItem[] }[] = [];
  const tol = 4.5;
  for (const item of sorted) {
    const line = lines.find((l) => Math.abs(l.y - item.y) < tol);
    if (line) line.parts.push(item);
    else lines.push({ y: item.y, parts: [item] });
  }
  return lines
    .map((l) =>
      l.parts
        .sort((a, b) => a.x - b.x)
        .map((p) => p.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
}

export async function pdfToWord(file: File): Promise<ProcessResult> {
  const pdfjs = await ensurePdfjs();
  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
  const children: Paragraph[] = [];
  let extracted = 0;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const items: TextItem[] = [];
    for (const raw of content.items) {
      if (!("str" in raw) || !raw.str) continue;
      const t = raw.transform;
      items.push({ str: raw.str, x: t[4], y: t[5] });
    }
    const lines = groupLines(items);
    extracted += lines.join("").length;
    if (i > 1) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: "", break: 1 })],
          pageBreakBefore: true,
        }),
      );
    }
    if (lines.length === 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `[No text on page ${i}. This page may be a scan.]`,
              italics: true,
              color: "666666",
            }),
          ],
        }),
      );
    } else {
      for (const line of lines) {
        children.push(new Paragraph({ children: [new TextRun(line)] }));
      }
    }
  }

  if (extracted < 8) {
    throw new Error(
      "This PDF has almost no text layer. It is probably a scan — try Compress or Merge instead.",
    );
  }

  const doc = new Document({
    sections: [{ children }],
  });
  const blob = await Packer.toBlob(doc);
  const bytes = new Uint8Array(await blob.arrayBuffer());
  return {
    bytes,
    filename: `${stem(file.name)}.docx`,
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    note: `${pdf.numPages} pages converted`,
  };
}

const WINANSI: Record<string, string> = {
  "\u2018": "'",
  "\u2019": "'",
  "\u201C": '"',
  "\u201D": '"',
  "\u2013": "-",
  "\u2014": "-",
  "\u2026": "...",
  "\u00A0": " ",
  "\u2022": "-",
  "\u00B7": "-",
  "\u2212": "-",
};

function toWinAnsi(input: string) {
  let out = "";
  for (const ch of input) {
    if (WINANSI[ch]) {
      out += WINANSI[ch];
      continue;
    }
    const code = ch.codePointAt(0) ?? 0;
    if (ch === "\n" || ch === "\t") {
      out += ch;
    } else if (code < 32) {
      out += " ";
    } else if (code > 255) {
      out += "?";
    } else {
      out += ch;
    }
  }
  return out;
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = toWinAnsi(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  const pushChunks = (word: string) => {
    let chunk = "";
    for (const ch of word) {
      const next = chunk + ch;
      if (font.widthOfTextAtSize(next, size) <= maxWidth) chunk = next;
      else {
        if (chunk) lines.push(chunk);
        chunk = ch;
      }
    }
    current = chunk;
  };

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      if (font.widthOfTextAtSize(word, size) <= maxWidth) current = word;
      else pushChunks(word);
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function wordToPdf(file: File): Promise<ProcessResult> {
  const mammothMod = (await import("mammoth")) as unknown as {
    convertToHtml?: (input: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
    default?: {
      convertToHtml: (input: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
    };
  };
  const convertToHtml = mammothMod.convertToHtml ?? mammothMod.default?.convertToHtml;
  if (!convertToHtml) throw new Error("Word converter failed to load.");
  const arrayBuffer = await file.arrayBuffer();
  let html = "";
  try {
    html = (await convertToHtml({ arrayBuffer })).value;
  } catch {
    const Buf = (globalThis as { Buffer?: { from: (data: ArrayBuffer) => Uint8Array } }).Buffer;
    if (!Buf) throw new Error("Could not read that Word file.");
    html = (
      await (convertToHtml as (input: unknown) => Promise<{ value: string }>)({
        buffer: Buf.from(arrayBuffer),
      })
    ).value;
  }
  const text =
    typeof DOMParser === "undefined"
      ? html.replace(/<[^>]+>/g, " ")
      : new DOMParser().parseFromString(html, "text/html").body.innerText || "";
  const cleaned = text.replace(/\r/g, "").trim();
  if (!cleaned) throw new Error("That Word file looks empty.");

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 11;
  const lineHeight = 15;
  const margin = 54;
  const pageWidth = 612;
  const pageHeight = 792;
  const maxWidth = pageWidth - margin * 2;

  let page = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  page.drawText(toWinAnsi(stem(file.name)), {
    x: margin,
    y,
    size: 16,
    font: bold,
    color: rgb(0.09, 0.08, 0.11),
  });
  y -= 28;

  for (const para of cleaned.split(/\n+/)) {
    const lines = wrapText(para, font, fontSize, maxWidth);
    for (const line of lines) {
      if (y < margin + 20) {
        page = doc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0.12, 0.11, 0.14),
      });
      y -= lineHeight;
    }
    y -= 8;
  }

  const bytes = await doc.save({ useObjectStreams: true });
  return {
    bytes,
    filename: `${stem(file.name)}.pdf`,
    mime: "application/pdf",
    note: `${doc.getPageCount()} page PDF`,
  };
}

async function embedImage(doc: PDFDocument, file: File) {
  const raw = new Uint8Array(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  const type = file.type;

  if (type === "image/png" || name.endsWith(".png")) {
    return doc.embedPng(raw);
  }
  if (
    type === "image/jpeg" ||
    type === "image/jpg" ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg")
  ) {
    return doc.embedJpg(raw);
  }

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not read that image.");
  ctx.drawImage(bitmap, 0, 0);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Could not convert image."))),
      "image/jpeg",
      0.92,
    );
  });
  return doc.embedJpg(new Uint8Array(await blob.arrayBuffer()));
}

export async function imagesToPdf(files: File[]): Promise<ProcessResult> {
  if (files.length < 1) throw new Error("Drop at least one image.");
  const doc = await PDFDocument.create();
  for (const file of files) {
    const image = await embedImage(doc, file);
    const maxW = 612;
    const maxH = 792;
    let w = image.width;
    let h = image.height;
    const scale = Math.min(maxW / w, maxH / h, 1);
    w *= scale;
    h *= scale;
    const page = doc.addPage([maxW, maxH]);
    page.drawImage(image, {
      x: (maxW - w) / 2,
      y: (maxH - h) / 2,
      width: w,
      height: h,
    });
  }
  const bytes = await doc.save({ useObjectStreams: true });
  const name =
    files.length === 1 ? `${stem(files[0].name)}.pdf` : "images.pdf";
  return {
    bytes,
    filename: name,
    mime: "application/pdf",
    note: `${files.length} image${files.length === 1 ? "" : "s"}`,
  };
}

export async function splitPdf(file: File): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  const count = doc.getPageCount();
  if (count < 2) throw new Error("That PDF is already a single page.");
  const parts: { name: string; data: Uint8Array }[] = [];
  const base = stem(file.name);
  for (let i = 0; i < count; i++) {
    const part = await PDFDocument.create();
    const [page] = await part.copyPages(doc, [i]);
    part.addPage(page);
    parts.push({
      name: `${base}-page-${i + 1}.pdf`,
      data: await part.save({ useObjectStreams: true }),
    });
  }
  return {
    bytes: zipStore(parts),
    filename: `${base}-split.zip`,
    mime: "application/zip",
    note: `${count} pages`,
  };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function redactMatchers(opts: RedactOptions) {
  const matchers: RegExp[] = [];
  if (opts.ssn) {
    matchers.push(/\b\d{3}[-.\s]\d{2}[-.\s]\d{4}\b/g);
  }
  if (opts.email) {
    matchers.push(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi);
  }
  if (opts.phone) {
    matchers.push(
      /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g,
    );
  }
  for (const raw of opts.custom.split(/[,;\n]+/)) {
    const term = raw.trim();
    if (term.length >= 2) {
      matchers.push(new RegExp(escapeRegExp(term), "gi"));
    }
  }
  return matchers;
}

function itemHits(text: string, matchers: RegExp[]) {
  if (!text.trim()) return false;
  return matchers.some((re) => {
    re.lastIndex = 0;
    return re.test(text);
  });
}

export async function redactPdf(
  file: File,
  opts: RedactOptions,
): Promise<ProcessResult> {
  const matchers = redactMatchers(opts);
  if (!matchers.length) {
    throw new Error("Turn on SSN, email, phone, or add a custom word to black out.");
  }

  const pdfjs = await ensurePdfjs();
  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
  const out = await PDFDocument.create();
  let hits = 0;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.45 });
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not render this page for redaction.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    const content = await page.getTextContent();
    ctx.fillStyle = "#111111";
    for (const raw of content.items) {
      if (!("str" in raw) || !raw.str) continue;
      if (!itemHits(raw.str, matchers)) continue;
      hits += 1;
      const t = raw.transform;
      const [x, y] = viewport.convertToViewportPoint(t[4], t[5]);
      const width = (raw.width || 0) * viewport.scale;
      const height = Math.abs(t[3] || 10) * viewport.scale;
      const padX = Math.max(2, width * 0.06);
      const padY = Math.max(2, height * 0.25);
      ctx.fillRect(x - padX, y - height - padY, width + padX * 2, height + padY * 2);
    }

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Could not save a redacted page."))),
        "image/jpeg",
        0.84,
      );
    });
    const image = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
    const p = out.addPage([image.width, image.height]);
    p.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }

  if (hits === 0) {
    throw new Error(
      "No matching text on this PDF. It may be a scan, or nothing looks like an SSN, email, or phone. Add a custom word.",
    );
  }

  const bytes = await out.save({ useObjectStreams: true });
  return {
    bytes,
    filename: `${stem(file.name)}-redacted.pdf`,
    mime: "application/pdf",
    note: `${hits} redaction${hits === 1 ? "" : "s"} · ${pdf.numPages} flattened pages`,
  };
}

export async function runTool(
  id: ToolId,
  files: File[],
  options: ProcessOptions = {},
): Promise<ProcessResult> {
  switch (id) {
    case "merge":
      return mergePdfs(files);
    case "compress":
      return compressPdf(files[0], options.level ?? "medium");
    case "pdf-to-word":
      return pdfToWord(files[0]);
    case "word-to-pdf":
      return wordToPdf(files[0]);
    case "jpg-to-pdf":
      return imagesToPdf(files);
    case "split":
      return splitPdf(files[0]);
    case "redact":
      return redactPdf(files[0], options.redact ?? { ssn: true, email: true, phone: true, custom: "" });
    default:
      throw new Error("Unknown tool");
  }
}

export function downloadResult(result: ProcessResult) {
  const blob = new Blob([result.bytes as BlobPart], { type: result.mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = result.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

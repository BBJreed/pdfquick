export const SITE = {
  name: "PDFQuick",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  tagline: "Fix PDFs without uploading. Redact. No watermark.",
  description:
    "Merge, compress, split, redact, and convert PDFs in your browser. Files never leave your device. Two free tasks a day.",
};

export const PRICING = {
  freePerDay: 2,
  monthlyUsd: 9,
  lifetimeUsd: 49,
} as const;

export const TOOLS = [
  {
    id: "merge",
    slug: "merge-pdf",
    href: "/merge-pdf",
    name: "Merge PDF",
    verb: "Merge",
    headline: "Merge PDF files online",
    searchTerm: "merge pdf",
    blurb: "Combine two or more PDFs into one file. Drag to reorder. No watermark.",
    seoDescription:
      "Merge PDF files online for free. Combine multiple PDFs into one document in your browser. No upload, no watermark, no signup.",
    accept: "application/pdf,.pdf",
    multiple: true,
    minFiles: 2,
    outputExt: "pdf",
    outputMime: "application/pdf",
    accent: "#d32616",
    faqs: [
      {
        q: "How do I merge PDF files for free?",
        a: "Drop two or more PDFs into PDFQuick, reorder them, and click Merge. The first two tasks each day are free.",
      },
      {
        q: "Do my files get uploaded?",
        a: "No. Merge runs entirely in your browser. The files never leave your device.",
      },
      {
        q: "Is there a watermark?",
        a: "Never. Free and paid downloads are clean.",
      },
    ],
  },
  {
    id: "compress",
    slug: "compress-pdf",
    href: "/compress-pdf",
    name: "Compress PDF",
    verb: "Compress",
    headline: "Compress a PDF file",
    searchTerm: "compress pdf",
    blurb: "Shrink a large PDF so it actually emails. Pick how hard to squeeze.",
    seoDescription:
      "Compress PDF files online for free. Reduce PDF size in your browser without uploading. No watermark.",
    accept: "application/pdf,.pdf",
    multiple: false,
    minFiles: 1,
    outputExt: "pdf",
    outputMime: "application/pdf",
    accent: "#c45a12",
    faqs: [
      {
        q: "Will compress PDF reduce quality?",
        a: "Low keeps the original vectors and just rewrites the file. Medium and High rasterize pages as JPEG so the file gets much smaller.",
      },
      {
        q: "What is the max file size?",
        a: "Free tasks cap each file at 25 MB. Unlimited unlocks 100 MB per file, still processed on your device.",
      },
    ],
  },
  {
    id: "pdf-to-word",
    slug: "pdf-to-word",
    href: "/pdf-to-word",
    name: "PDF to Word",
    verb: "Convert",
    headline: "Convert PDF to Word",
    searchTerm: "pdf to word",
    blurb: "Turn a PDF into an editable .docx. Best on text-based PDFs.",
    seoDescription:
      "Convert PDF to Word online for free. Download a .docx in your browser. No upload, no watermark.",
    accept: "application/pdf,.pdf",
    multiple: false,
    minFiles: 1,
    outputExt: "docx",
    outputMime:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    accent: "#2b5bd7",
    faqs: [
      {
        q: "Does PDF to Word keep the layout?",
        a: "It extracts text in reading order into a Word document. Scanned PDFs with no text layer will come out empty or sparse.",
      },
      {
        q: "Is this the same as Adobe Acrobat?",
        a: "No. Acrobat reconstructs layout. PDFQuick is the fast, private option when you need the words in a .docx right now.",
      },
    ],
  },
  {
    id: "word-to-pdf",
    slug: "word-to-pdf",
    href: "/word-to-pdf",
    name: "Word to PDF",
    verb: "Convert",
    headline: "Convert Word to PDF",
    searchTerm: "word to pdf",
    blurb: "Drop a .docx and download a PDF. Runs locally in the browser.",
    seoDescription:
      "Convert Word to PDF online for free. Turn a .docx into a PDF in your browser. No upload, no watermark.",
    accept:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx",
    multiple: false,
    minFiles: 1,
    outputExt: "pdf",
    outputMime: "application/pdf",
    accent: "#1b7a45",
    faqs: [
      {
        q: "Which Word files work?",
        a: ".docx files from Word, Google Docs, and Pages. Old .doc files are not supported.",
      },
      {
        q: "Are images included?",
        a: "Text, headings, and lists convert. Complex layout and some images may simplify.",
      },
    ],
  },
  {
    id: "jpg-to-pdf",
    slug: "jpg-to-pdf",
    href: "/jpg-to-pdf",
    name: "JPG to PDF",
    verb: "Convert",
    headline: "Convert JPG to PDF",
    searchTerm: "jpg to pdf",
    blurb: "Turn photos and scans into a single PDF. PNG and WebP work too.",
    seoDescription:
      "Convert JPG to PDF online for free. Combine images into a PDF in your browser. No upload, no watermark.",
    accept: "image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp",
    multiple: true,
    minFiles: 1,
    outputExt: "pdf",
    outputMime: "application/pdf",
    accent: "#7a3ad4",
    faqs: [
      {
        q: "Can I combine multiple images into one PDF?",
        a: "Yes. Each image becomes a page. Reorder them before converting.",
      },
      {
        q: "What image types are supported?",
        a: "JPG, JPEG, PNG, and WebP.",
      },
    ],
  },
  {
    id: "split",
    slug: "split-pdf",
    href: "/split-pdf",
    name: "Split PDF",
    verb: "Split",
    headline: "Split a PDF into pages",
    searchTerm: "split pdf",
    blurb: "Turn one PDF into a zip of single-page files. Runs on your device.",
    seoDescription:
      "Split PDF online for free. Download each page as its own PDF. No upload, no watermark.",
    accept: "application/pdf,.pdf",
    multiple: false,
    minFiles: 1,
    outputExt: "zip",
    outputMime: "application/zip",
    accent: "#0f766e",
    faqs: [
      {
        q: "How does split PDF work?",
        a: "Each page becomes its own PDF, packed into a zip you download. Nothing is uploaded.",
      },
      {
        q: "Can I pick a page range?",
        a: "This version splits every page. Merge the pages you want to keep afterward.",
      },
    ],
  },
  {
    id: "redact",
    slug: "redact-pdf",
    href: "/redact-pdf",
    name: "Redact PDF",
    verb: "Redact",
    headline: "Redact a PDF without uploading",
    searchTerm: "redact pdf",
    blurb:
      "Permanently black out SSNs, emails, and phones. Pages are flattened so the text cannot be copied from under the box.",
    seoDescription:
      "Redact PDF online without uploading. Permanently remove SSNs, emails, and phone numbers in your browser. No Adobe.",
    accept: "application/pdf,.pdf",
    multiple: false,
    minFiles: 1,
    outputExt: "pdf",
    outputMime: "application/pdf",
    accent: "#111827",
    faqs: [
      {
        q: "Is the text really gone?",
        a: "Yes. Matching text is painted out, then the page is saved as an image. You cannot select the old words underneath.",
      },
      {
        q: "Does this work on scans?",
        a: "Only if the PDF has a text layer. A pure photo of a page has nothing to match. Use custom words only when the text is selectable.",
      },
      {
        q: "Do you see the document?",
        a: "No. Redaction runs in this browser tab.",
      },
    ],
  },
] as const;

export type Tool = (typeof TOOLS)[number];
export type ToolId = Tool["id"];

export function getTool(id: ToolId): Tool {
  const tool = TOOLS.find((t) => t.id === id);
  if (!tool) throw new Error(`Unknown tool ${id}`);
  return tool;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export const FREE_FILE_BYTES = 25 * 1024 * 1024;
export const PRO_FILE_BYTES = 100 * 1024 * 1024;

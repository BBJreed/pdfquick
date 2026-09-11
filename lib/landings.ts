import type { ToolId } from "./config";

export const LANDINGS = [
  {
    slug: "merge-pdf-without-watermark",
    toolId: "merge" as ToolId,
    title: "Merge PDF without watermark",
    headline: "Merge PDF files without a watermark",
    description:
      "Combine PDFs in your browser. No watermark, no upload, no Adobe. Two free merges a day.",
    keywords: ["merge pdf without watermark", "combine pdf no watermark"],
    intro:
      "Adobe and a lot of free sites stamp a logo on the download. PDFQuick does not. Drop two files, merge, download the original pages.",
  },
  {
    slug: "merge-pdf-no-upload",
    toolId: "merge" as ToolId,
    title: "Merge PDF without uploading",
    headline: "Merge PDFs without uploading them",
    description:
      "Merge PDF files on your device. The files never leave this browser tab. No account required.",
    keywords: ["merge pdf no upload", "merge pdf locally", "private pdf merger"],
    intro:
      "Smallpdf and iLovePDF send your file to a server. PDFQuick runs the merge in this tab. Use it for contracts, IDs, and anything you would not email to a stranger.",
  },
  {
    slug: "combine-pdf",
    toolId: "merge" as ToolId,
    title: "Combine PDF files",
    headline: "Combine PDF files into one",
    description:
      "Combine multiple PDFs into a single file in your browser. No upload. No watermark.",
    keywords: ["combine pdf", "join pdf", "put pdfs together"],
    intro:
      "Combine is the same job as merge. Drop the files in order, hit Combine, download one PDF.",
  },
  {
    slug: "compress-pdf-for-email",
    toolId: "compress" as ToolId,
    title: "Compress PDF for email",
    headline: "Compress a PDF so it actually emails",
    description:
      "Shrink a PDF under typical email limits without uploading. Medium compression is the default for Gmail-sized files.",
    keywords: ["compress pdf for email", "reduce pdf size 10mb", "shrink pdf for gmail"],
    intro:
      "Gmail and Outlook still choke on 20–25 MB attachments. Drop the file, pick Medium or High, download a smaller PDF. The work stays on your computer.",
  },
  {
    slug: "pdf-to-word-free",
    toolId: "pdf-to-word" as ToolId,
    title: "PDF to Word free, no Adobe",
    headline: "Convert PDF to Word without Adobe",
    description:
      "Turn a PDF into a .docx in your browser. Free for two tasks a day. No Adobe subscription.",
    keywords: ["pdf to word free", "pdf to word no adobe", "pdf to docx online"],
    intro:
      "This extracts the text layer into Word. It is the fast path when you need the words, not a pixel-perfect clone of a brochure.",
  },
  {
    slug: "image-to-pdf",
    toolId: "jpg-to-pdf" as ToolId,
    title: "Image to PDF",
    headline: "Convert images to PDF",
    description:
      "Turn JPG, PNG, or WebP photos into a PDF in your browser. No upload.",
    keywords: ["image to pdf", "png to pdf", "photos to pdf"],
    intro:
      "Each image becomes a page. Reorder them, convert, download. Nothing is sent to a server.",
  },
] as const;

export type Landing = (typeof LANDINGS)[number];

export function getLanding(slug: string): Landing | undefined {
  return LANDINGS.find((page) => page.slug === slug);
}

export const POSTS = [
  {
    slug: "why-online-pdf-tools-upload-your-files",
    title: "Why most online PDF tools upload your files",
    description:
      "Smallpdf and iLovePDF send the document to a server. Here is why, and what a browser-native tool does instead.",
    date: "2026-09-11",
  },
  {
    slug: "merge-pdf-on-iphone-without-an-app",
    title: "Merge a PDF on iPhone without installing an app",
    description:
      "Safari can run PDFQuick. No App Store. Files stay on the phone.",
    date: "2026-09-11",
  },
  {
    slug: "compress-pdf-under-10mb",
    title: "How to compress a PDF under 10 MB for email",
    description:
      "A practical path when Gmail rejects the attachment. No upload.",
    date: "2026-09-11",
  },
] as const;

export function getPost(slug: string) {
  return POSTS.find((post) => post.slug === slug);
}

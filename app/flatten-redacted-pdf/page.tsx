import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const metadata: Metadata = {
  title: "Flatten a redacted PDF",
  description:
    "Permanently flatten redacted PDF pages in the browser so text cannot be copied from under the black box. No upload.",
  keywords: ["flatten pdf after redacting text", "permanent pdf redaction flatten"],
};

const faqs = [
  {
    q: "Why flatten after drawing boxes?",
    a: "A rectangle sitting on top of text is still text. Anyone can select it. Flattening saves the page as an image.",
  },
  {
    q: "Is print-to-PDF the same?",
    a: "Not always. Some print drivers keep a text layer. This tool rasterizes the page in the tab.",
  },
  {
    q: "Can OCR recover the old numbers?",
    a: "The matched glyphs are painted over before the JPEG is written. There is no leftover selectable string. A scan of a photo could still be guessed by a human; this is not magic.",
  },
] as const;

export default function FlattenPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-10">
        <p className="text-sm leading-7 text-muted">
          If you already blacked out a PDF in Preview or Word, the words may still
          be in the file. Run it here with the same strings as custom words. We
          paint them and flatten.
        </p>
      </div>
      <ToolWorkspace
        toolId="redact"
        headline="Flatten redacted PDFs so the text is actually gone"
      />
      <Faq items={faqs} />
    </>
  );
}

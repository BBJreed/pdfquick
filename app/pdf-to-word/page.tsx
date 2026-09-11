import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { FaqJsonLd } from "@/components/JsonLd";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import { getTool } from "@/lib/config";

const tool = getTool("pdf-to-word");

export const metadata: Metadata = {
  title: "PDF to Word online",
  description: tool.seoDescription,
  keywords: ["pdf to word", "pdf to docx", "convert pdf to word"],
};

export default function PdfToWordPage() {
  return (
    <>
      <FaqJsonLd tool={tool} />
      <ToolWorkspace toolId="pdf-to-word" />
      <Faq items={tool.faqs} />
    </>
  );
}

import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { FaqJsonLd } from "@/components/JsonLd";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import { getTool } from "@/lib/config";

const tool = getTool("word-to-pdf");

export const metadata: Metadata = {
  title: "Word to PDF online",
  description: tool.seoDescription,
  keywords: ["word to pdf", "docx to pdf", "convert word to pdf"],
};

export default function WordToPdfPage() {
  return (
    <>
      <FaqJsonLd tool={tool} />
      <ToolWorkspace toolId="word-to-pdf" />
      <Faq items={tool.faqs} />
    </>
  );
}

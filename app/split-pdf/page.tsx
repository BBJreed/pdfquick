import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { FaqJsonLd } from "@/components/JsonLd";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import { getTool } from "@/lib/config";

const tool = getTool("split");

export const metadata: Metadata = {
  title: "Split PDF online",
  description: tool.seoDescription,
  keywords: ["split pdf", "extract pdf pages", "separate pdf pages"],
};

export default function SplitPdfPage() {
  return (
    <>
      <FaqJsonLd tool={tool} />
      <ToolWorkspace toolId="split" />
      <Faq items={tool.faqs} />
    </>
  );
}

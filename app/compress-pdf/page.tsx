import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { FaqJsonLd } from "@/components/JsonLd";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import { getTool } from "@/lib/config";

const tool = getTool("compress");

export const metadata: Metadata = {
  title: "Compress PDF online",
  description: tool.seoDescription,
  keywords: ["compress pdf", "reduce pdf size", "shrink pdf"],
};

export default function CompressPdfPage() {
  return (
    <>
      <FaqJsonLd tool={tool} />
      <ToolWorkspace toolId="compress" />
      <Faq items={tool.faqs} />
    </>
  );
}

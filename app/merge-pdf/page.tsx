import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { FaqJsonLd } from "@/components/JsonLd";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import { getTool } from "@/lib/config";

const tool = getTool("merge");

export const metadata: Metadata = {
  title: "Merge PDF online",
  description: tool.seoDescription,
  keywords: ["merge pdf", "combine pdf", "join pdf files"],
};

export default function MergePdfPage() {
  return (
    <>
      <FaqJsonLd tool={tool} />
      <ToolWorkspace toolId="merge" />
      <Faq items={tool.faqs} />
    </>
  );
}

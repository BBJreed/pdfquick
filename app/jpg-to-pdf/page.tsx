import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { FaqJsonLd } from "@/components/JsonLd";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import { getTool } from "@/lib/config";

const tool = getTool("jpg-to-pdf");

export const metadata: Metadata = {
  title: "JPG to PDF online",
  description: tool.seoDescription,
  keywords: ["jpg to pdf", "image to pdf", "png to pdf", "convert jpg to pdf"],
};

export default function JpgToPdfPage() {
  return (
    <>
      <FaqJsonLd tool={tool} />
      <ToolWorkspace toolId="jpg-to-pdf" />
      <Faq items={tool.faqs} />
    </>
  );
}

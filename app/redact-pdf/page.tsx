import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { FaqJsonLd } from "@/components/JsonLd";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import { getTool } from "@/lib/config";

const tool = getTool("redact");

export const metadata: Metadata = {
  title: "Redact PDF without uploading",
  description: tool.seoDescription,
  keywords: [
    "redact pdf",
    "redact ssn from pdf",
    "black out text in pdf permanently",
    "pdf redaction no upload",
  ],
};

export default function RedactPdfPage() {
  return (
    <>
      <FaqJsonLd tool={tool} />
      <ToolWorkspace toolId="redact" />
      <Faq items={tool.faqs} />
    </>
  );
}

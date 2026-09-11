import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/Faq";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import { getTool } from "@/lib/config";

const TOPICS = {
  "ssn-from-pdf": {
    title: "Redact SSN from a PDF",
    headline: "Black out Social Security numbers in a PDF",
    description:
      "Permanently redact SSNs from a PDF in your browser. The file is never uploaded. Text under the box cannot be copied.",
    intro:
      "Loan packets and HR files should not go to a random PDF site. Drop the document here. We match ###-##-#### patterns, paint them out, and flatten the page so the numbers are gone.",
    keywords: ["redact ssn from pdf", "black out social security number pdf"],
  },
  "bank-statements-for-mortgage": {
    title: "Redact a bank statement for a mortgage",
    headline: "Redact bank statements without uploading",
    description:
      "Black out account numbers and emails on a bank statement PDF before you send it to a lender. Runs on your device.",
    intro:
      "Mortgage packets ask for statements and then bounce around email. Redact account-looking numbers and emails here first. Add the last four of the account as a custom word if the layout is odd.",
    keywords: ["redact bank statement pdf", "black out account number pdf mortgage"],
  },
  "tax-returns": {
    title: "Redact a tax return PDF",
    headline: "Redact tax returns in the browser",
    description:
      "Remove SSNs, emails, and phones from a tax PDF without uploading it. Pages are flattened so the old text cannot be copied.",
    intro:
      "Tax preparers and small businesses share returns with bookkeepers and lenders. Run redaction locally, then send the flattened file.",
    keywords: ["redact tax return pdf", "black out ssn on 1040 pdf"],
  },
} as const;

type Topic = keyof typeof TOPICS;

export function generateStaticParams() {
  return Object.keys(TOPICS).map((topic) => ({ topic }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const page = TOPICS[topic as Topic];
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    keywords: [...page.keywords],
  };
}

export default async function RedactTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const page = TOPICS[topic as Topic];
  if (!page) notFound();
  const tool = getTool("redact");

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-10">
        <p className="text-sm leading-7 text-muted">{page.intro}</p>
      </div>
      <ToolWorkspace toolId="redact" headline={page.headline} />
      <Faq items={tool.faqs} />
    </>
  );
}

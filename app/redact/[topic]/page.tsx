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
    faqs: [
      {
        q: "Can someone copy the SSN from under the black box?",
        a: "Not after PDFQuick. Matching text is painted out and the page is saved as an image, so Ctrl+F and copy-paste cannot recover it.",
      },
      {
        q: "Do you upload the PDF?",
        a: "No. Redaction runs in this browser tab.",
      },
    ],
  },
  "bank-statements-for-mortgage": {
    title: "Redact a bank statement for a mortgage",
    headline: "Redact bank statements without uploading",
    description:
      "Black out account numbers and emails on a bank statement PDF before you send it to a lender. Runs on your device.",
    intro:
      "Mortgage packets ask for statements and then bounce around email. Redact emails and phones here first. Add the account number as a custom word if the layout is odd.",
    keywords: ["redact bank statement pdf", "black out account number pdf mortgage"],
    faqs: [
      {
        q: "Will a lender accept a flattened PDF?",
        a: "Usually yes. It is still a normal PDF. Required income figures stay visible; only matched PII is destroyed.",
      },
      {
        q: "What if my account number is not detected?",
        a: "Paste it in the custom words field. We black out that exact string, then flatten.",
      },
    ],
  },
  "tax-returns": {
    title: "Redact a tax return PDF",
    headline: "Redact tax returns in the browser",
    description:
      "Remove SSNs, emails, and phones from a tax PDF without uploading it. Pages are flattened so the old text cannot be copied.",
    intro:
      "Tax preparers and small businesses share returns with bookkeepers and lenders. Run redaction locally, then send the flattened file.",
    keywords: ["redact tax return pdf", "black out ssn on 1040 pdf"],
    faqs: [
      {
        q: "How do I confirm the SSN is gone?",
        a: "Open the download, press Ctrl+F, search the number. A real redaction returns zero hits.",
      },
    ],
  },
  "court-documents-filing": {
    title: "Redact court documents without uploading",
    headline: "Redact court PDFs locally, then flatten",
    description:
      "Black out SSNs and other identifiers in a filing PDF in your browser. Pages are flattened so the old text cannot be copied. Not legal advice.",
    intro:
      "Many e-filing rules want identifiers gone from the file, not just covered with a shape. PDFQuick paints matches and saves the page as an image. We are not a law firm and do not certify a court will accept every file.",
    keywords: ["redact pdf for court filing online", "redact court documents pdf no upload"],
    faqs: [
      {
        q: "Is a black box in Word or Preview enough?",
        a: "Often no. The words can still be selected or found with search. Flattening is the point of this page.",
      },
      {
        q: "Do you store client files?",
        a: "No. The PDF never leaves this tab.",
      },
      {
        q: "Does this replace counsel?",
        a: "No. Check your court's redaction list. This tool only destroys matched text in the file you download.",
      },
    ],
  },
  "medical-records-hipaa": {
    title: "Redact medical records without uploading",
    headline: "Redact medical PDFs on this device",
    description:
      "Redact names, emails, phones, and SSNs from a medical PDF in the browser. PHI is not uploaded. Not a HIPAA certification.",
    intro:
      "Cloud PDF sites take a copy of the chart. This tab does not. We do not sign BAAs and we do not claim to be a HIPAA covered entity. If your policy forbids any web tool, use a desktop app on an offline machine instead.",
    keywords: ["redact medical records pdf without uploading", "phi pdf redaction browser"],
    faqs: [
      {
        q: "Is this HIPAA certified?",
        a: "No. Processing stays in your browser so we never host PHI. That is an architecture choice, not a certification.",
      },
      {
        q: "Are scans supported?",
        a: "Only if the PDF has a text layer. A photo of a chart needs custom words or a different workflow.",
      },
    ],
  },
  "w2-tax-form": {
    title: "Redact a W-2 PDF without uploading",
    headline: "Redact W-2 and tax PII in the browser",
    description:
      "Black out SSNs, emails, and phones on a W-2 or tax PDF locally. No server upload.",
    intro:
      "Cloud editors take a copy of compensation and SSNs. Drop the W-2 here, keep SSN matching on, add the employee name as a custom word if you need it gone too.",
    keywords: ["redact w2 form online free safe", "redact ssn on w2 pdf"],
    faqs: [
      {
        q: "Why not Smallpdf for a W-2?",
        a: "They ingest the file. This page does not.",
      },
      {
        q: "How do I verify?",
        a: "Search the download for the SSN. It should not appear.",
      },
    ],
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
  const faqs = "faqs" in page ? page.faqs : tool.faqs;

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-10">
        <p className="text-sm leading-7 text-muted">{page.intro}</p>
      </div>
      <ToolWorkspace toolId="redact" headline={page.headline} />
      <Faq items={faqs} />
    </>
  );
}

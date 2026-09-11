import type { Metadata } from "next";
import Link from "next/link";
import { PRICING, SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "PDFQuick vs Smallpdf, iLovePDF, and Adobe",
  description:
    "A private alternative to Smallpdf and iLovePDF. Merge and compress PDFs in your browser. Files never leave your device.",
  keywords: [
    "smallpdf alternative",
    "ilovepdf alternative",
    "adobe acrobat alternative free",
    "pdf tool no upload",
  ],
};

const rows = [
  ["Where the file goes", "Your browser", "Their servers", "Their servers", "Adobe cloud / app"],
  ["Watermark on free download", "Never", "Often yes", "Limits, then paywall", "N/A"],
  ["Account to try", "No", "Usually", "Usually", "Yes"],
  ["Price after free uses", `$${PRICING.monthlyUsd}/mo or $${PRICING.lifetimeUsd} once`, "Subscription", "Subscription", "$15/mo"],
];

export default function AlternativesPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Alternatives
      </p>
      <h1 className="mt-3 font-serif text-5xl text-ink">
        A Smallpdf / iLovePDF alternative that does not take the file
      </h1>
      <p className="mt-4 max-w-2xl text-muted leading-7">
        Those sites work. They also upload the PDF. {SITE.name} runs merge, compress,
        split, and convert in this tab. That is the whole product.
      </p>

      <div className="mt-10 overflow-x-auto rounded-3xl ring-1 ring-line">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-card">
            <tr>
              {["", SITE.name, "Smallpdf", "iLovePDF", "Adobe"].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold text-ink">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-t border-line">
                {row.map((cell) => (
                  <td key={cell} className="px-4 py-3 text-muted">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-sm leading-7 text-muted">
        If you need OCR on a scan, form filling, or legal-grade conversion, Adobe still
        wins. If you need to merge two contracts without sending them to Spain or
        Switzerland, use {SITE.name}.
      </p>
      <Link
        href="/merge-pdf-no-upload"
        className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white"
      >
        Merge without uploading
      </Link>
    </article>
  );
}

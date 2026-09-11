import Link from "next/link";
import { Faq } from "@/components/Faq";
import { HeroDrop, ToolGrid } from "@/components/ToolGrid";
import { PRICING, SITE } from "@/lib/config";

const faqs = [
  {
    q: "Do you upload my files?",
    a: "No. Every tool runs in your browser. We never see the PDF.",
  },
  {
    q: "Is there a watermark?",
    a: "No. Free and paid downloads are clean.",
  },
  {
    q: "How does the free plan work?",
    a: `You get ${PRICING.freePerDay} tasks per day. The next one opens Stripe Checkout for $${PRICING.monthlyUsd}/mo or $${PRICING.lifetimeUsd} lifetime.`,
  },
  {
    q: "Why not Smallpdf or iLovePDF?",
    a: "Those sites upload your document to a server. PDFQuick does the work on your machine, then gets out of the way.",
  },
] as const;

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Browser-native PDF tools
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.05] text-ink sm:text-7xl">
          {SITE.tagline}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
          Merge, compress, convert. Two free tasks a day, then ${PRICING.monthlyUsd}/mo
          or ${PRICING.lifetimeUsd} once. No Adobe. No watermark.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/merge-pdf"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark"
          >
            Merge a PDF
          </Link>
          <Link
            href="/pricing"
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-card hover:bg-ink/90"
          >
            See pricing
          </Link>
        </div>
        <div className="mt-10">
          <HeroDrop />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <ToolGrid />
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-8 sm:grid-cols-3">
        {[
          { t: "No upload", d: "pdf-lib and pdf.js run in the tab. Your contract never hits our disk." },
          { t: "No watermark", d: "The download is the file. We do not stamp a brand on your work." },
          { t: "Stripe autopilot", d: "Two free tasks, then Checkout. No support queue. Retry if a merge fails." },
        ].map((item) => (
          <div key={item.t} className="rounded-3xl bg-card p-6 ring-1 ring-line">
            <h2 className="text-lg font-semibold text-ink">{item.t}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{item.d}</p>
          </div>
        ))}
      </section>

      <Faq items={faqs} />
    </>
  );
}

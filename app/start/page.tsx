import type { Metadata } from "next";
import Link from "next/link";
import { PRICING, SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "I made a PDF merger that never uploads your file",
  description:
    "Merge, compress, and convert PDFs in the browser. No watermark. Two free tasks a day.",
};

export default function StartPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        From the video
      </p>
      <h1 className="mt-4 font-serif text-5xl leading-tight text-ink">
        Merge PDFs without uploading them. No watermark.
      </h1>
      <p className="mt-4 text-muted leading-7">
        {SITE.name} runs in this browser tab. Two free tasks today, then $
        {PRICING.lifetimeUsd} once if you want unlimited. Adobe is not involved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/merge-pdf"
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white"
        >
          Merge a PDF
        </Link>
        <Link
          href="/compress-pdf"
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-card"
        >
          Compress a PDF
        </Link>
      </div>
    </div>
  );
}

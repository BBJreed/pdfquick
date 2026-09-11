import type { Metadata } from "next";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy",
  description: `${SITE.name} processes files in your browser. We do not upload or store your PDFs.`,
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-serif text-5xl text-ink">Privacy</h1>
      <div className="mt-8 space-y-4 text-sm leading-7 text-muted">
        <p>
          {SITE.name} runs merge, compress, convert, and image-to-PDF in your
          browser. Files are not uploaded to our servers.
        </p>
        <p>
          We store a signed cookie after Stripe Checkout so this browser knows
          you paid. Stripe processes the card. We do not see full card numbers.
        </p>
        <p>
          Free-tier usage is counted in localStorage on your device. Clearing
          site data resets the counter; paid access lives in the cookie.
        </p>
        <p>
          If you email us, we keep that email long enough to reply. No file
          contents are attached because we never received them.
        </p>
      </div>
    </article>
  );
}

# PDFQuick

A Stripe-autopilot PDF suite: merge, compress, PDF ↔ Word, JPG to PDF.

Files are processed in the browser with `pdf-lib` and `pdf.js`. Nothing is uploaded. The paywall is two free tasks per day, then Stripe Checkout at **$9/month** or **$49 lifetime**.

## Run locally

```bash
cd pdfquick
cp .env.example .env.local
npm install
npm run copy-worker
npm run dev
```

Open http://localhost:3000

Without Stripe keys, checkout in development unlocks via `/api/claim?demo=lifetime`.

## Go live (Vercel + Stripe)

1. Create a Stripe account and put `STRIPE_SECRET_KEY` + `SESSION_SECRET` in Vercel env.
2. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
3. First paid checkout creates Stripe products with lookup keys `pdfquick_monthly` and `pdfquick_lifetime`. Or paste Price IDs into `STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_LIFETIME`.
4. Optional webhook: `https://YOUR_DOMAIN/api/webhook` → `STRIPE_WEBHOOK_SECRET`.
5. Point the domain at Vercel. Cost is ~$0–20/mo until traffic is real. No R2, no LibreOffice, no Clerk required.

Clerk is optional later. Stripe Checkout already collects email.

## Pages

| URL | Search term |
|---|---|
| `/merge-pdf` | merge pdf / combine pdf |
| `/compress-pdf` | compress pdf |
| `/pdf-to-word` | pdf to word |
| `/word-to-pdf` | word to pdf |
| `/jpg-to-pdf` | jpg to pdf / image to pdf |

## Paywall

`if free_uses > 2 today -> Stripe Checkout`

Usage is stored in `localStorage`. Paid access is a signed httpOnly cookie from `/api/claim`.

## TikTok script

> I got tired of Adobe asking me to subscribe just to merge two PDFs. So I made a site that does it in the browser. No watermark. Files never leave your phone.

## Why this architecture

LibreOffice does not run on Vercel. Uploading files to R2 creates a support and privacy problem. Client-side tools are the actual set-and-forget version: if a merge fails, the user retries. You never see the file.

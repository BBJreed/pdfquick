"use client";

import { useState } from "react";
import { PRICING, SITE } from "@/lib/config";
import { useUsage } from "@/components/UsageProvider";

export default function PricingPage() {
  const { plan } = useUsage();
  const [busy, setBusy] = useState<"monthly" | "lifetime" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkout(next: "monthly" | "lifetime") {
    setBusy(next);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: next }),
      });
      const data = (await res.json()) as {
        url?: string;
        demoUrl?: string;
        error?: string;
      };
      if (data.url || data.demoUrl) {
        window.location.href = (data.url || data.demoUrl)!;
        return;
      }
      setError(data.error || "Checkout is not ready yet.");
    } catch {
      setError("Could not start checkout.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Pricing
      </p>
      <h1 className="mt-3 font-serif text-5xl text-ink">Simple on purpose.</h1>
      <p className="mt-3 max-w-xl text-muted">
        Two free tasks every day. Unlock unlimited when you hit the third. No
        watermark either way.
      </p>
      {plan !== "free" ? (
        <p className="mt-4 text-sm font-medium text-good">
          You already have {plan} access on this browser.
        </p>
      ) : null}

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-card p-6 ring-1 ring-line">
          <h2 className="text-lg font-semibold">Free</h2>
          <p className="mt-2 font-serif text-4xl">$0</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>{PRICING.freePerDay} tasks per day</li>
            <li>All 5 tools</li>
            <li>25 MB per file</li>
            <li>No watermark</li>
          </ul>
        </div>
        <div className="rounded-3xl bg-card p-6 ring-1 ring-line">
          <h2 className="text-lg font-semibold">Monthly</h2>
          <p className="mt-2 font-serif text-4xl">
            ${PRICING.monthlyUsd}
            <span className="text-lg text-muted">/mo</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>Unlimited tasks</li>
            <li>100 MB per file</li>
            <li>Cancel anytime</li>
          </ul>
          <button
            type="button"
            onClick={() => checkout("monthly")}
            disabled={busy !== null || plan === "monthly" || plan === "lifetime"}
            className="mt-6 w-full rounded-full bg-ink py-3 text-sm font-semibold text-card disabled:opacity-50"
          >
            {busy === "monthly" ? "Redirecting…" : "Unlock monthly"}
          </button>
        </div>
        <div className="rounded-3xl bg-ink p-6 text-card">
          <h2 className="text-lg font-semibold">Lifetime</h2>
          <p className="mt-2 font-serif text-4xl">${PRICING.lifetimeUsd}</p>
          <ul className="mt-4 space-y-2 text-sm text-card/70">
            <li>Pay once</li>
            <li>Unlimited forever</li>
            <li>Best for people who hate subscriptions</li>
          </ul>
          <button
            type="button"
            onClick={() => checkout("lifetime")}
            disabled={busy !== null || plan === "lifetime"}
            className="mt-6 w-full rounded-full bg-accent py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy === "lifetime" ? "Redirecting…" : "Get lifetime"}
          </button>
        </div>
      </div>
      {error ? <p className="mt-6 text-sm text-accent">{error}</p> : null}
      <p className="mt-8 text-sm text-muted">
        Checkout is Stripe. {SITE.name} never stores card numbers.
      </p>
    </div>
  );
}

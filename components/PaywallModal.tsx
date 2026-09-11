"use client";

import { useState } from "react";
import { PRICING, SITE } from "@/lib/config";

export function PaywallModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState<"monthly" | "lifetime" | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function checkout(plan: "monthly" | "lifetime") {
    setBusy(plan);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
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
      setError("Could not reach Stripe. Try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close paywall"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-3xl bg-card p-6 shadow-2xl ring-1 ring-line sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Unlock {SITE.name}
        </p>
        <h2 className="mt-2 font-serif text-3xl text-ink">
          You used your {PRICING.freePerDay} free tasks today.
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Unlimited tools. No watermark. Files still never leave this browser.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => checkout("monthly")}
            disabled={busy !== null}
            className="rounded-2xl border border-line bg-paper px-4 py-5 text-left transition hover:border-ink/30 disabled:opacity-60"
          >
            <p className="text-sm text-muted">Monthly</p>
            <p className="mt-1 text-2xl font-semibold text-ink">
              ${PRICING.monthlyUsd}
              <span className="text-sm font-normal text-muted">/mo</span>
            </p>
            <p className="mt-2 text-xs text-muted">
              {busy === "monthly" ? "Redirecting…" : "Cancel anytime"}
            </p>
          </button>
          <button
            type="button"
            onClick={() => checkout("lifetime")}
            disabled={busy !== null}
            className="rounded-2xl bg-ink px-4 py-5 text-left text-card transition hover:bg-ink/90 disabled:opacity-60"
          >
            <p className="text-sm text-card/70">Lifetime · best value</p>
            <p className="mt-1 text-2xl font-semibold">
              ${PRICING.lifetimeUsd}
              <span className="text-sm font-normal text-card/70"> once</span>
            </p>
            <p className="mt-2 text-xs text-card/70">
              {busy === "lifetime" ? "Redirecting…" : "Pay once, keep it forever"}
            </p>
          </button>
        </div>

        {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}

        <button
          type="button"
          onClick={onClose}
          className="mt-5 text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

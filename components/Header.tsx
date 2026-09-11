"use client";

import Link from "next/link";
import { useState } from "react";
import { PRICING, SITE, TOOLS } from "@/lib/config";
import { useUsage } from "./UsageProvider";

export function Header() {
  const { plan, remaining, ready } = useUsage();
  const [open, setOpen] = useState(false);
  const unlimited = plan !== "free";

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm text-white">
            Q
          </span>
          {SITE.name}
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-ink/80 md:flex">
          <div className="group relative">
            <button type="button" className="hover:text-ink">
              Tools
            </button>
            <div className="invisible absolute left-0 top-full z-20 mt-3 w-56 rounded-2xl bg-card p-2 opacity-0 shadow-xl ring-1 ring-line transition group-hover:visible group-hover:opacity-100">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="block rounded-xl px-3 py-2 hover:bg-paper"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/pricing" className="hover:text-ink">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {ready ? (
            <span className="hidden text-xs text-muted sm:inline">
              {unlimited
                ? "Unlimited"
                : remaining === Infinity
                  ? "Unlimited"
                  : `${remaining} free left today`}
            </span>
          ) : null}
          {!unlimited ? (
            <Link
              href="/pricing"
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-card hover:bg-ink/90"
            >
              Unlock ${PRICING.lifetimeUsd}
            </Link>
          ) : null}
          <button
            type="button"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            Menu
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-line bg-card px-4 py-3 md:hidden">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="block py-2 text-sm"
              onClick={() => setOpen(false)}
            >
              {tool.name}
            </Link>
          ))}
          <Link href="/pricing" className="block py-2 text-sm" onClick={() => setOpen(false)}>
            Pricing
          </Link>
        </div>
      ) : null}
    </header>
  );
}

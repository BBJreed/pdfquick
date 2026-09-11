import type { Metadata } from "next";
import { PRICING } from "@/lib/config";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Two free PDF tasks a day. Unlimited for $${PRICING.monthlyUsd}/mo or $${PRICING.lifetimeUsd} lifetime. No watermark.`,
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

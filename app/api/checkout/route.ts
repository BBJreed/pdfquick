import { NextRequest, NextResponse } from "next/server";
import { ensurePrices, getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { plan?: string };
  const plan = body.plan === "lifetime" ? "lifetime" : "monthly";
  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const stripe = getStripe();

  if (!stripe) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({
        demoUrl: `${origin}/api/claim?demo=${plan}`,
      });
    }
    return NextResponse.json(
      { error: "Add STRIPE_SECRET_KEY to enable checkout." },
      { status: 501 },
    );
  }

  const prices = await ensurePrices(stripe);
  const suffix = Math.random().toString(36).slice(2, 10);
  const session = await stripe.checkout.sessions.create({
    mode: plan === "lifetime" ? "payment" : "subscription",
    line_items: [{ price: plan === "lifetime" ? prices.lifetime : prices.monthly, quantity: 1 }],
    success_url: `${origin}/api/claim?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing`,
    allow_promotion_codes: true,
    metadata: { plan },
    integration_identifier: `pdfquick_${plan}_${suffix}`,
  });

  return NextResponse.json({ url: session.url });
}

import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  cookieOptions,
  encodeSession,
  lifetimeExp,
  monthlyExp,
  type SessionPayload,
} from "@/lib/session";
import { getStripe } from "@/lib/stripe";

function redirectWithSession(req: NextRequest, session: SessionPayload) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const res = NextResponse.redirect(new URL("/success", origin));
  res.cookies.set(SESSION_COOKIE, encodeSession(session), cookieOptions(session.exp));
  return res;
}

export async function GET(req: NextRequest) {
  const demo = req.nextUrl.searchParams.get("demo");
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (demo && process.env.NODE_ENV !== "production") {
    const plan = demo === "monthly" ? "monthly" : "lifetime";
    return redirectWithSession(req, {
      plan,
      exp: plan === "lifetime" ? lifetimeExp() : monthlyExp(),
    });
  }

  if (!sessionId) {
    return NextResponse.redirect(new URL("/pricing", req.nextUrl.origin));
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.redirect(new URL("/pricing", req.nextUrl.origin));
  }

  const checkout = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  const paid =
    checkout.payment_status === "paid" || checkout.status === "complete";
  if (!paid) {
    return NextResponse.redirect(new URL("/pricing", req.nextUrl.origin));
  }

  if (checkout.mode === "subscription") {
    const sub = checkout.subscription;
    const periodEnd =
      sub && typeof sub !== "string"
        ? (sub as { current_period_end?: number }).current_period_end
        : undefined;
    return redirectWithSession(req, {
      plan: "monthly",
      exp: monthlyExp(periodEnd),
    });
  }

  return redirectWithSession(req, {
    plan: "lifetime",
    exp: lifetimeExp(),
  });
}

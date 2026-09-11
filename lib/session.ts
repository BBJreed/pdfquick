import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "pdfquick_session";

export type Plan = "free" | "monthly" | "lifetime";

export type SessionPayload = {
  plan: Exclude<Plan, "free">;
  exp: number;
};

function secret() {
  return (
    process.env.SESSION_SECRET ||
    process.env.STRIPE_SECRET_KEY ||
    "pdfquick-dev-secret-change-me"
  );
}

export function encodeSession(session: SessionPayload): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function decodeSession(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (!session.plan || !session.exp) return null;
    if (session.exp * 1000 < Date.now()) return null;
    if (session.plan !== "monthly" && session.plan !== "lifetime") return null;
    return session;
  } catch {
    return null;
  }
}

export async function readPlan(): Promise<Plan> {
  const store = await cookies();
  const session = decodeSession(store.get(SESSION_COOKIE)?.value);
  return session?.plan ?? "free";
}

export function cookieOptions(exp: number) {
  const maxAge = Math.max(0, exp - Math.floor(Date.now() / 1000));
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function lifetimeExp() {
  return Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 10;
}

export function monthlyExp(periodEnd?: number) {
  if (periodEnd && periodEnd > Date.now() / 1000) return Math.floor(periodEnd);
  return Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 32;
}

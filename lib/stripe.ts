import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripe) stripe = new Stripe(key);
  return stripe;
}

export async function ensurePrices(client: Stripe) {
  const fromEnvMonthly = process.env.STRIPE_PRICE_MONTHLY;
  const fromEnvLifetime = process.env.STRIPE_PRICE_LIFETIME;
  if (fromEnvMonthly && fromEnvLifetime) {
    return { monthly: fromEnvMonthly, lifetime: fromEnvLifetime };
  }

  const listed = await client.prices.list({
    lookup_keys: ["pdfquick_monthly", "pdfquick_lifetime"],
    active: true,
  });
  const monthlyExisting = listed.data.find((p) => p.lookup_key === "pdfquick_monthly");
  const lifetimeExisting = listed.data.find((p) => p.lookup_key === "pdfquick_lifetime");
  if (monthlyExisting && lifetimeExisting) {
    return { monthly: monthlyExisting.id, lifetime: lifetimeExisting.id };
  }

  const product =
    (
      await client.products.list({
        limit: 20,
      })
    ).data.find((p) => p.metadata?.pdfquick === "monthly") ??
    (await client.products.create({
      name: "PDFQuick Monthly",
      description: "Unlimited PDF tools. No watermark. Files stay on your device.",
      metadata: { pdfquick: "monthly" },
    }));

  const monthly =
    monthlyExisting ??
    (await client.prices.create({
      product: product.id,
      currency: "usd",
      unit_amount: 900,
      recurring: { interval: "month" },
      lookup_key: "pdfquick_monthly",
      nickname: "PDFQuick Monthly",
    }));

  const lifetime =
    lifetimeExisting ??
    (await client.prices.create({
      product: product.id,
      currency: "usd",
      unit_amount: 4900,
      lookup_key: "pdfquick_lifetime",
      nickname: "PDFQuick Lifetime",
    }));

  return {
    monthly: monthly.id,
    lifetime: lifetime.id,
  };
}

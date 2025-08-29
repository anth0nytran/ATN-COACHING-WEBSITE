import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "node:crypto";
import { readSession } from "@/lib/session";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string | undefined;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string | undefined;
const priceMapJson = process.env.STRIPE_PRICE_MAP as string | undefined;
function getCalendlyUrlFor(serviceId: string): string | undefined {
  const key = `NEXT_PUBLIC_CALENDLY_URL_${serviceId.replace(/[^a-z0-9]+/gi, "_").toUpperCase()}`;
  return process.env[key];
}
const checkoutBypass = (process.env.CHECKOUT_BYPASS || "").toLowerCase() === "1" || (process.env.CHECKOUT_BYPASS || "").toLowerCase() === "true";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { serviceId, email, name, bypass, utm } = body as { serviceId?: string; email?: string; name?: string; bypass?: boolean | string | number; utm?: Record<string, string | undefined> };
    if (!serviceId) return NextResponse.json({ error: "Missing serviceId" }, { status: 400 });

    const bypassParam = req.nextUrl.searchParams.get("bypass");
    const shouldBypass = checkoutBypass || Boolean(bypass) || (bypassParam === "1" || (bypassParam || "").toLowerCase() === "true");
    if (shouldBypass) {
      const origin = baseUrl || req.nextUrl.origin;
      const success = `${origin}/success?session_id=bypass${serviceId ? `&serviceId=${encodeURIComponent(serviceId)}` : ""}`;
      return NextResponse.json({ url: success });
    }

    if (!stripeSecretKey) return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 400 });
    if (!baseUrl) return NextResponse.json({ error: "Missing NEXT_PUBLIC_BASE_URL" }, { status: 400 });
    if (!priceMapJson) return NextResponse.json({ error: "Missing STRIPE_PRICE_MAP" }, { status: 400 });
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });

    let priceMap: Record<string, string>;
    try {
      priceMap = JSON.parse(priceMapJson) as Record<string, string>;
    } catch {
      return NextResponse.json({ error: "Invalid STRIPE_PRICE_MAP JSON" }, { status: 400 });
    }
    const priceId = priceMap[serviceId];
    if (!priceId) return NextResponse.json({ error: "Unknown serviceId" }, { status: 400 });

    const sess = await readSession();

    // Detect if the selected Stripe Price is recurring (subscription) or one-time
    const stripePrice = await stripe.prices.retrieve(priceId);
    const isRecurring = Boolean(stripePrice.recurring);

    // Build an idempotency key that includes all variable parameters to ensure uniqueness
    // This prevents conflicts when the same user tries to checkout with different details
    const idempotencyData = [
      serviceId,
      isRecurring ? "sub" : "pay",
      sess?.discordId || "anon",
      email || "no-email",
      name || "no-name",
      utm?.utm_source || "no-source",
      utm?.utm_medium || "no-medium",
      utm?.utm_campaign || "no-campaign",
      utm?.utm_term || "no-term",
      utm?.utm_content || "no-content"
    ].join(":");
    
    const idKey = crypto
      .createHash("sha256")
      .update(idempotencyData)
      .digest("hex");

    const session = await stripe.checkout.sessions.create({
      mode: isRecurring ? "subscription" : "payment",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        serviceId,
        name: name || "",
        discordId: sess?.discordId || "",
        username: sess?.username || "",
        calendlyUrl: getCalendlyUrlFor(serviceId) || "",
        utm_source: (utm?.utm_source as string) || "",
        utm_medium: (utm?.utm_medium as string) || "",
        utm_campaign: (utm?.utm_campaign as string) || "",
        utm_term: (utm?.utm_term as string) || "",
        utm_content: (utm?.utm_content as string) || "",
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?canceled=1#services`,
    }, { idempotencyKey: idKey });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = (err as { message?: string })?.message || "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}



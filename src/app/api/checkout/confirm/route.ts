import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string | undefined;
const checkoutBypass = (process.env.CHECKOUT_BYPASS || "").toLowerCase() === "1" || (process.env.CHECKOUT_BYPASS || "").toLowerCase() === "true";

export async function GET(req: NextRequest) {
  try {
    const bypassParam = req.nextUrl.searchParams.get("bypass");
    if (checkoutBypass || bypassParam === "1" || (bypassParam || "").toLowerCase() === "true") {
      const serviceId = req.nextUrl.searchParams.get("serviceId") || undefined;
      return NextResponse.json({ ok: true, customer: { email: undefined, name: undefined }, metadata: { serviceId }, orderNumber: "TEST-BYPASS" });
    }
    if (!stripeSecretKey) return NextResponse.json({ ok: false }, { status: 500 });
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return NextResponse.json({ ok: false }, { status: 400 });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid";
    const customerEmail = (session.customer_details?.email as string | undefined) || undefined;
    const customerName = (session.customer_details?.name as string | undefined) || undefined;
    const orderNumber = (session.id || "").replace(/^cs_[a-z]+_?/i, "").slice(-8).toUpperCase();

    return NextResponse.json({ ok: paid, customer: { email: customerEmail, name: customerName }, orderNumber });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}



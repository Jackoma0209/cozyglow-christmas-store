import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  CurrencyCode,
  STRIPE_STORE_TAG,
  getOrderReferenceFromSessionId,
} from "@/config/product";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id")?.trim();
    const upsellSessionId = req.nextUrl.searchParams
      .get("upsell_session_id")
      ?.trim();

    if (!sessionId || !sessionId.startsWith("cs_")) {
      return NextResponse.json(
        { error: "Missing or invalid session_id." },
        { status: 400 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Stripe is not configured on the server." },
        { status: 503 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (session.metadata?.store !== STRIPE_STORE_TAG) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    let upsellVerified = false;
    let upsellAmountTotal = 0;

    if (upsellSessionId && upsellSessionId.startsWith("cs_")) {
      try {
        const upsellSession = await stripe.checkout.sessions.retrieve(
          upsellSessionId
        );
        const isPaidUpsell =
          upsellSession.payment_status === "paid" ||
          upsellSession.payment_status === "no_payment_required";
        if (
          upsellSession.metadata?.store === STRIPE_STORE_TAG &&
          upsellSession.metadata?.type === "post_purchase_upsell" &&
          (!upsellSession.metadata?.parentSessionId ||
            upsellSession.metadata.parentSessionId === session.id) &&
          isPaidUpsell
        ) {
          upsellVerified = true;
          upsellAmountTotal = (upsellSession.amount_total ?? 0) / 100;
        }
      } catch {
        // Ignore invalid upsell session check; parent order remains valid
      }
    }

    const shippingDetails =
      session.shipping_details ??
      session.collected_information?.shipping_details ??
      null;

    const firstName =
      (session.customer_details?.name || "").trim().split(/\s+/)[0] || null;

    return NextResponse.json({
      verified: true,
      orderReference: getOrderReferenceFromSessionId(session.id),
      sessionId: session.id,
      paymentStatus: session.payment_status,
      currency: (session.currency === "usd" ? "usd" : "gbp") as CurrencyCode,
      bundleId: session.metadata?.bundleId || "double",
      includeOrderBump: session.metadata?.includeOrderBump === "true",
      amountSubtotal: (session.amount_subtotal ?? 0) / 100,
      amountShipping: (session.shipping_cost?.amount_total ?? 0) / 100,
      amountTotal: (session.amount_total ?? 0) / 100,
      customerFirstName: firstName,
      shippingCity: shippingDetails?.address?.city ?? null,
      shippingCountry: shippingDetails?.address?.country ?? null,
      lineItems: (session.line_items?.data ?? []).map((li) => ({
        description: li.description || "CozyGlow™ Item",
        quantity: li.quantity ?? 1,
        amountTotal: (li.amount_total ?? 0) / 100,
      })),
      upsellVerified,
      upsellAmountTotal,
    });
  } catch (error) {
    console.error("Stripe session lookup error:", error);
    return NextResponse.json(
      { error: "Unable to verify checkout session." },
      { status: 500 }
    );
  }
}

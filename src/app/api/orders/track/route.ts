import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  CURRENCIES,
  CurrencyCode,
  STRIPE_STORE_TAG,
  getOrderReferenceFromSessionId,
} from "@/config/product";

interface TrackPayload {
  orderRef?: string;
  email?: string;
}

type FulfillmentStatus = "processing" | "packed" | "dispatched" | "delivered";

function normalizeOrderRef(raw: string): string {
  const cleaned = raw.trim().toUpperCase().replace(/^#/, "");
  if (cleaned.startsWith("CG-")) {
    return `#${cleaned}`;
  }
  return `#CG-${cleaned}`;
}

function normalizeFulfillmentStatus(raw?: string): FulfillmentStatus {
  const value = (raw || "").trim().toLowerCase();
  if (value === "packed") return "packed";
  if (value === "dispatched" || value === "shipped") return "dispatched";
  if (value === "delivered") return "delivered";
  return "processing";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TrackPayload;
    const rawRef = body.orderRef?.trim() || "";
    const email = body.email?.trim().toLowerCase() || "";

    if (!rawRef) {
      return NextResponse.json(
        { error: "Please enter your #CG order reference." },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Please enter the email address used at checkout." },
        { status: 400 }
      );
    }

    const normalizedRef = normalizeOrderRef(rawRef);
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

    if (!stripeSecretKey) {
      if (normalizedRef === "#CG-84920") {
        return NextResponse.json({
          demoMode: true,
          orderReference: "#CG-84920",
          createdAt: new Date().toISOString(),
          currency: "gbp",
          amountTotal: 64.95,
          fulfillmentStatus: "dispatched" as FulfillmentStatus,
          shippingCity: "Manchester",
          shippingCountry: "GB",
          courierLabel: CURRENCIES.gbp.courierLabel,
          trackingNumber: null,
          trackingUrl: null,
          items: [
            {
              description: 'CozyGlow™ — "Gift One, Keep One" 2x Cottage Bundle',
              quantity: 1,
            },
          ],
        });
      }

      return NextResponse.json(
        { error: "No order found matching that reference and email." },
        { status: 404 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const sessions = await stripe.checkout.sessions.list({
      customer_details: { email },
      status: "complete",
      limit: 25,
      expand: ["data.line_items", "data.payment_intent"],
    });

    const matchedSession = sessions.data.find((s) => {
      if (s.metadata?.store !== STRIPE_STORE_TAG) return false;
      const isPaid =
        s.payment_status === "paid" ||
        s.payment_status === "no_payment_required";
      if (!isPaid) return false;

      const derivedRef = getOrderReferenceFromSessionId(s.id);
      const pi =
        s.payment_intent && typeof s.payment_intent !== "string"
          ? s.payment_intent
          : null;
      const piRef = pi?.metadata?.order_ref?.trim().toUpperCase();

      return derivedRef === normalizedRef || piRef === normalizedRef;
    });

    if (!matchedSession) {
      return NextResponse.json(
        {
          error:
            "We couldn't find a CozyGlow™ order matching that reference and email address. Please check your confirmation email or contact support.",
        },
        { status: 404 }
      );
    }

    const paymentIntent =
      matchedSession.payment_intent &&
      typeof matchedSession.payment_intent !== "string"
        ? matchedSession.payment_intent
        : null;

    const piMeta = paymentIntent?.metadata ?? {};
    const fulfillmentStatus = normalizeFulfillmentStatus(
      piMeta.fulfillment_status || matchedSession.metadata?.fulfillment_status
    );
    const currency: CurrencyCode =
      matchedSession.currency === "usd" ? "usd" : "gbp";

    const shippingDetails =
      matchedSession.shipping_details ??
      matchedSession.collected_information?.shipping_details ??
      null;

    return NextResponse.json({
      demoMode: false,
      orderReference: getOrderReferenceFromSessionId(matchedSession.id),
      createdAt: new Date(matchedSession.created * 1000).toISOString(),
      currency,
      amountTotal: (matchedSession.amount_total ?? 0) / 100,
      fulfillmentStatus,
      shippingCity: shippingDetails?.address?.city ?? null,
      shippingCountry: shippingDetails?.address?.country ?? null,
      courierLabel:
        piMeta.tracking_carrier || CURRENCIES[currency].courierLabel,
      trackingNumber: piMeta.tracking_number || null,
      trackingUrl: piMeta.tracking_url || null,
      items: (matchedSession.line_items?.data ?? []).map((li) => ({
        description: li.description || "CozyGlow™ Item",
        quantity: li.quantity ?? 1,
      })),
    });
  } catch (error) {
    console.error("Order tracking lookup error:", error);
    return NextResponse.json(
      { error: "Unable to look up order right now. Please try again." },
      { status: 500 }
    );
  }
}

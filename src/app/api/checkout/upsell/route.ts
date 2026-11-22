import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  CurrencyCode,
  POST_PURCHASE_UPSELL,
  STRIPE_SEASON_TAG,
  STRIPE_STORE_TAG,
  getOrderReferenceFromSessionId,
} from "@/config/product";
import {
  STRIPE_CHECKOUT_API_VERSION,
  STRIPE_STATEMENT_DESCRIPTOR_SUFFIX,
  buildCheckoutBrandingSettings,
} from "@/lib/stripe-branding";

interface UpsellPayload {
  parentSessionId?: string;
  currency?: CurrencyCode;
  demoMode?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as UpsellPayload;
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

    if (!stripeSecretKey || body.demoMode) {
      return NextResponse.json({
        demoMode: true,
        checkoutUrl: "/success?demo=true&upsell=1",
      });
    }

    const parentSessionId = body.parentSessionId?.trim();
    if (!parentSessionId || !parentSessionId.startsWith("cs_")) {
      return NextResponse.json(
        { error: "Valid parent order session is required." },
        { status: 400 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: STRIPE_CHECKOUT_API_VERSION,
    });
    const parent = await stripe.checkout.sessions.retrieve(parentSessionId);

    if (parent.metadata?.store !== STRIPE_STORE_TAG) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const isPaid =
      parent.payment_status === "paid" ||
      parent.payment_status === "no_payment_required";
    if (!isPaid) {
      return NextResponse.json(
        { error: "Parent order payment has not completed yet." },
        { status: 400 }
      );
    }

    const currency: CurrencyCode =
      parent.currency === "usd" || body.currency === "usd" ? "usd" : "gbp";
    const unitAmount = Math.round(
      (currency === "gbp"
        ? POST_PURCHASE_UPSELL.priceGbp
        : POST_PURCHASE_UPSELL.priceUsd) * 100
    );

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";
    const cleanOrigin = origin.replace(/\/+$/, "");
    const isPublicHttps = cleanOrigin.startsWith("https://");

    const envPriceId =
      currency === "gbp"
        ? process.env.STRIPE_PRICE_UPSELL_GBP
        : process.env.STRIPE_PRICE_UPSELL_USD;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = envPriceId
      ? [{ price: envPriceId, quantity: 1 }]
      : [
          {
            price_data: {
              currency,
              product_data: {
                name: POST_PURCHASE_UPSELL.title,
                description: POST_PURCHASE_UPSELL.bullets.join(" • "),
                ...(isPublicHttps
                  ? {
                      images: [
                        `${cleanOrigin}/images/products/04-mantel-village-setup.jpg`,
                      ],
                    }
                  : {}),
              },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
        ];

    const parentOrderRef = getOrderReferenceFromSessionId(parent.id);
    const bundleId = parent.metadata?.bundleId || "double";
    const bumpFlag = parent.metadata?.includeOrderBump === "true" ? "1" : "0";

    const upsellMetadata: Record<string, string> = {
      store: STRIPE_STORE_TAG,
      season: STRIPE_SEASON_TAG,
      type: "post_purchase_upsell",
      parentSessionId: parent.id,
      parentOrderRef,
      currency,
    };

    const upsellSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: parent.customer_details?.email ?? undefined,
      line_items: lineItems,
      metadata: upsellMetadata,
      payment_intent_data: {
        metadata: upsellMetadata,
        statement_descriptor_suffix: STRIPE_STATEMENT_DESCRIPTOR_SUFFIX,
      },
      branding_settings: buildCheckoutBrandingSettings(origin),
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency,
            },
            display_name: "Merged Into Your Existing Priority Parcel — FREE",
          },
        },
      ],
      success_url: `${origin}/success?bundle=${bundleId}&currency=${currency}&bump=${bumpFlag}&session_id=${encodeURIComponent(
        parent.id
      )}&upsell_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/success?bundle=${bundleId}&currency=${currency}&bump=${bumpFlag}&session_id=${encodeURIComponent(
        parent.id
      )}&upsell_canceled=true`,
    } as Stripe.Checkout.SessionCreateParams);

    return NextResponse.json({
      demoMode: false,
      checkoutUrl: upsellSession.url,
    });
  } catch (error) {
    console.error("Stripe upsell checkout error:", error);
    return NextResponse.json(
      { error: "Unable to start VIP add-on checkout. Please try again." },
      { status: 500 }
    );
  }
}

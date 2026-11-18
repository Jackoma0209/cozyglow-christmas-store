import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  BUNDLE_TIERS,
  BundleTier,
  CurrencyCode,
  ORDER_BUMP,
  PRODUCT_CONFIG,
} from "@/config/product";

interface CheckoutPayload {
  bundleId?: BundleTier["id"];
  currency?: CurrencyCode;
  includeOrderBump?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutPayload;
    const bundleId: BundleTier["id"] =
      body.bundleId === "single" ||
      body.bundleId === "double" ||
      body.bundleId === "triple"
        ? body.bundleId
        : "double";
    const currency: CurrencyCode = body.currency === "usd" ? "usd" : "gbp";
    const includeOrderBump = Boolean(body.includeOrderBump);

    const bundle =
      BUNDLE_TIERS.find((item) => item.id === bundleId) ?? BUNDLE_TIERS[1];

    const bundleUnitAmount = Math.round(
      (currency === "gbp" ? bundle.priceGbp : bundle.priceUsd) * 100
    );
    const bumpUnitAmount = Math.round(
      (currency === "gbp" ? ORDER_BUMP.priceGbp : ORDER_BUMP.priceUsd) * 100
    );

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency,
          product_data: {
            name: `${PRODUCT_CONFIG.shortProductName} — ${bundle.name}`,
            description: bundle.includes.join(" • "),
          },
          unit_amount: bundleUnitAmount,
        },
        quantity: 1,
      },
    ];

    if (includeOrderBump) {
      lineItems.push({
        price_data: {
          currency,
          product_data: {
            name: ORDER_BUMP.title,
            description: ORDER_BUMP.subtitle,
          },
          unit_amount: bumpUnitAmount,
        },
        quantity: 1,
      });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey || stripeSecretKey.trim() === "") {
      return NextResponse.json(
        {
          demoMode: true,
          checkoutUrl: `/success?demo=true&bundle=${bundle.id}&currency=${currency}&bump=${
            includeOrderBump ? "1" : "0"
          }`,
        },
        { status: 200 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";

    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["GB", "US", "CA", "AU", "IE"],
      },
      phone_number_collection: {
        enabled: true,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency,
            },
            display_name:
              "Free Tracked Express Holiday Delivery (4–7 Business Days)",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 4 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 495,
              currency,
            },
            display_name:
              "Priority Insured Pre-Christmas Dispatch (2–4 Business Days)",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 4 },
            },
          },
        },
      ],
      success_url: `${origin}/success?bundle=${bundle.id}&currency=${currency}&bump=${
        includeOrderBump ? "1" : "0"
      }&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
    });

    return NextResponse.json(
      {
        demoMode: false,
        checkoutUrl: session.url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      {
        error: "Unable to create checkout session. Please try again.",
      },
      { status: 500 }
    );
  }
}

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
    const shippingAmount = bundle.freeShipping
      ? 0
      : currency === "gbp"
      ? 495
      : 695;

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

    if (shippingAmount > 0) {
      lineItems.push({
        price_data: {
          currency,
          product_data: {
            name: "Tracked Holiday Express Shipping",
            description:
              currency === "gbp"
                ? "Royal Mail Tracked 48® / DPD Express (5–7 business days)"
                : "USPS Priority / FedEx Tracked (5–7 business days)",
          },
          unit_amount: shippingAmount,
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
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&bundle=${bundle.id}&currency=${currency}&bump=${
        includeOrderBump ? "1" : "0"
      }`,
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

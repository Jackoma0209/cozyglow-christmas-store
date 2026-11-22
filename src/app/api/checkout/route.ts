import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  BUNDLE_TIERS,
  BundleTier,
  CurrencyCode,
  ORDER_BUMP,
  PRODUCT_CONFIG,
  SHIPPING_CONFIG,
  STRIPE_PRICE_IDS,
  STRIPE_SEASON_TAG,
  STRIPE_STORE_TAG,
} from "@/config/product";
import {
  STRIPE_CHECKOUT_API_VERSION,
  STRIPE_STATEMENT_DESCRIPTOR_SUFFIX,
  buildCheckoutBrandingSettings,
} from "@/lib/stripe-branding";

interface CheckoutPayload {
  bundleId?: BundleTier["id"];
  currency?: CurrencyCode;
  includeOrderBump?: boolean;
}

function isMissingStripePriceError(error: unknown): boolean {
  if (!(error instanceof Stripe.errors.StripeInvalidRequestError)) {
    return false;
  }
  const message = error.message.toLowerCase();
  return (
    error.code === "resource_missing" ||
    message.includes("no such price") ||
    message.includes("similar object exists in live mode") ||
    message.includes("similar object exists in test mode")
  );
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

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";
    const cleanOrigin = origin.replace(/\/+$/, "");
    const isPublicHttps = cleanOrigin.startsWith("https://");

    const bundleImagePath =
      bundle.id === "single"
        ? "/images/products/01-chimney-mist-hero.jpg"
        : bundle.id === "double"
        ? "/images/products/02-warm-window-glow.jpg"
        : "/images/products/04-mantel-village-setup.jpg";

    const priceDataLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency,
          product_data: {
            name: `${PRODUCT_CONFIG.shortProductName} — ${bundle.name}`,
            description: bundle.includes.join(" • "),
            ...(isPublicHttps ? { images: [`${cleanOrigin}${bundleImagePath}`] } : {}),
          },
          unit_amount: bundleUnitAmount,
        },
        quantity: 1,
      },
    ];

    if (includeOrderBump) {
      priceDataLineItems.push({
        price_data: {
          currency,
          product_data: {
            name: ORDER_BUMP.title,
            description: ORDER_BUMP.subtitle,
            ...(isPublicHttps
              ? {
                  images: [
                    `${cleanOrigin}/images/products/05-gift-box-unboxing.jpg`,
                  ],
                }
              : {}),
          },
          unit_amount: bumpUnitAmount,
        },
        quantity: 1,
      });
    }

    const bundlePriceId = STRIPE_PRICE_IDS[bundle.id][currency];
    const bumpPriceId = STRIPE_PRICE_IDS.orderBump[currency];

    const priceIdLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price: bundlePriceId,
        quantity: 1,
      },
    ];

    if (includeOrderBump && bumpPriceId) {
      priceIdLineItems.push({
        price: bumpPriceId,
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

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: STRIPE_CHECKOUT_API_VERSION,
    });

    const checkoutMetadata: Record<string, string> = {
      store: STRIPE_STORE_TAG,
      season: STRIPE_SEASON_TAG,
      bundleId: bundle.id,
      cottageQty: String(bundle.quantity),
      includeOrderBump: String(includeOrderBump),
      currency,
    };

    const standardShippingAmount = bundle.freeShipping
      ? 0
      : Math.round(
          (currency === "gbp"
            ? SHIPPING_CONFIG.standardGbp
            : SHIPPING_CONFIG.standardUsd) * 100
        );

    const priorityShippingAmount = bundle.freeShipping
      ? Math.round(
          (currency === "gbp"
            ? SHIPPING_CONFIG.priorityUpgradeGbp
            : SHIPPING_CONFIG.priorityUpgradeUsd) * 100
        )
      : Math.round(
          (currency === "gbp"
            ? SHIPPING_CONFIG.singlePriorityGbp
            : SHIPPING_CONFIG.singlePriorityUsd) * 100
        );

    const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] =
      [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: standardShippingAmount,
              currency,
            },
            display_name: bundle.freeShipping
              ? "Free Tracked Pre-Christmas Delivery (8–12 Business Days)"
              : "Tracked Pre-Christmas Delivery (8–12 Business Days)",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 8 },
              maximum: { unit: "business_day", value: 12 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: priorityShippingAmount,
              currency,
            },
            display_name:
              "Priority Insured Holiday Dispatch (6–10 Business Days)",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 6 },
              maximum: { unit: "business_day", value: 10 },
            },
          },
        },
      ];

    const createSession = (
      lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]
    ) =>
      stripe.checkout.sessions.create({
        mode: "payment",
        allow_promotion_codes: true,
        line_items: lineItems,
        metadata: checkoutMetadata,
        payment_intent_data: {
          metadata: checkoutMetadata,
          statement_descriptor_suffix: STRIPE_STATEMENT_DESCRIPTOR_SUFFIX,
        },
        branding_settings: buildCheckoutBrandingSettings(origin),
        shipping_address_collection: {
          allowed_countries: ["GB", "US", "CA", "AU", "IE"],
        },
        phone_number_collection: {
          enabled: true,
        },
        shipping_options: shippingOptions,
        success_url: `${origin}/success?bundle=${bundle.id}&currency=${currency}&bump=${
          includeOrderBump ? "1" : "0"
        }&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/?canceled=true`,
      } as Stripe.Checkout.SessionCreateParams);

    const hasExplicitPriceEnvOverride = Boolean(
      process.env.STRIPE_PRICE_SINGLE_GBP ||
        process.env.STRIPE_PRICE_SINGLE_USD ||
        process.env.STRIPE_PRICE_DOUBLE_GBP ||
        process.env.STRIPE_PRICE_DOUBLE_USD ||
        process.env.STRIPE_PRICE_TRIPLE_GBP ||
        process.env.STRIPE_PRICE_TRIPLE_USD ||
        process.env.STRIPE_PRICE_BUMP_GBP ||
        process.env.STRIPE_PRICE_BUMP_USD
    );

    const preferCatalogPrices =
      Boolean(bundlePriceId) &&
      (!stripeSecretKey.startsWith("sk_test_") || hasExplicitPriceEnvOverride);

    let session: Stripe.Checkout.Session;
    if (preferCatalogPrices) {
      try {
        session = await createSession(priceIdLineItems);
      } catch (priceError) {
        if (!isMissingStripePriceError(priceError)) {
          throw priceError;
        }
        session = await createSession(priceDataLineItems);
      }
    } else {
      session = await createSession(priceDataLineItems);
    }

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

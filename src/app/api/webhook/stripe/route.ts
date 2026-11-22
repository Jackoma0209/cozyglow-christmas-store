import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  CurrencyCode,
  STRIPE_STORE_TAG,
  getOrderReferenceFromSessionId,
} from "@/config/product";
import {
  OrderEmailData,
  forwardToFulfillmentWebhook,
  sendOrderEmails,
} from "@/lib/email";
import { submitOrderToCJDropshipping } from "@/lib/cjdropshipping";

function formatShippingAddress(
  shippingDetails: Stripe.Checkout.Session.ShippingDetails | null | undefined,
  fallbackName?: string | null
): string[] {
  if (!shippingDetails?.address) return [];
  const addr = shippingDetails.address;
  const lines: string[] = [];
  const recipient = shippingDetails.name || fallbackName;
  if (recipient) lines.push(recipient);
  if (addr.line1) lines.push(addr.line1);
  if (addr.line2) lines.push(addr.line2);
  const cityStatePostal = [addr.city, addr.state, addr.postal_code]
    .filter(Boolean)
    .join(", ");
  if (cityStatePostal) lines.push(cityStatePostal);
  if (addr.country) lines.push(addr.country);
  return lines;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

    let event: Stripe.Event;

    if (!webhookSecret) {
      if (process.env.NODE_ENV === "production") {
        console.error(
          "STRIPE_WEBHOOK_SECRET is missing in production; rejecting webhook."
        );
        return NextResponse.json(
          { error: "Webhook signing secret is not configured." },
          { status: 500 }
        );
      }
      event = JSON.parse(rawBody) as Stripe.Event;
    } else {
      const signature = req.headers.get("stripe-signature");
      if (!signature) {
        return NextResponse.json(
          { error: "Missing stripe-signature header." },
          { status: 400 }
        );
      }

      const stripe = new Stripe(
        stripeSecretKey || "sk_webhook_signature_verifier"
      );

      try {
        event = stripe.webhooks.constructEvent(
          rawBody,
          signature,
          webhookSecret
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Invalid webhook signature.";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    }

    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true, ignored: true });
    }

    const eventSession = event.data.object as Stripe.Checkout.Session;

    if (eventSession.metadata?.store !== STRIPE_STORE_TAG) {
      return NextResponse.json({ received: true, ignored: true });
    }

    const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

    let session: Stripe.Checkout.Session = eventSession;
    if (stripe) {
      try {
        session = await stripe.checkout.sessions.retrieve(eventSession.id, {
          expand: [
            "line_items",
            "payment_intent",
            "shipping_cost.shipping_rate",
          ],
        });
      } catch (retrieveErr) {
        console.warn(
          "Could not expand Checkout Session inside webhook; falling back to event payload:",
          retrieveErr
        );
      }
    }

    const orderRef = getOrderReferenceFromSessionId(session.id);

    const paymentIntentObj =
      session.payment_intent && typeof session.payment_intent !== "string"
        ? session.payment_intent
        : null;
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : paymentIntentObj?.id ?? null;

    if (paymentIntentObj?.metadata?.fulfillment_processed === "true") {
      return NextResponse.json({
        received: true,
        duplicate: true,
        store: STRIPE_STORE_TAG,
        orderRef,
        sessionId: session.id,
      });
    }

    const shippingDetails =
      session.shipping_details ??
      session.collected_information?.shipping_details ??
      null;

    const shippingRate =
      session.shipping_cost?.shipping_rate &&
      typeof session.shipping_cost.shipping_rate !== "string"
        ? session.shipping_cost.shipping_rate
        : null;

    const currency: CurrencyCode =
      session.currency === "usd" ? "usd" : "gbp";

    const lineItems = (session.line_items?.data ?? []).map((li) => ({
      description: li.description || "CozyGlow™ Item",
      quantity: li.quantity ?? 1,
      amountTotal: (li.amount_total ?? 0) / 100,
    }));

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://cozyglow-christmas-store.vercel.app";

    const orderData: OrderEmailData = {
      orderRef,
      sessionId: session.id,
      paymentIntentId,
      isUpsell: session.metadata?.type === "post_purchase_upsell",
      parentOrderRef: session.metadata?.parentOrderRef ?? null,
      bundleId: session.metadata?.bundleId ?? null,
      cottageQty: session.metadata?.cottageQty
        ? Number(session.metadata.cottageQty)
        : null,
      includeOrderBump: session.metadata?.includeOrderBump === "true",
      customerName:
        shippingDetails?.name || session.customer_details?.name || "Customer",
      customerEmail: session.customer_details?.email ?? null,
      customerPhone: session.customer_details?.phone ?? null,
      shippingAddressLines: formatShippingAddress(
        shippingDetails,
        session.customer_details?.name
      ),
      shippingCountry: shippingDetails?.address?.country ?? null,
      lineItems,
      currency,
      amountSubtotal: (session.amount_subtotal ?? 0) / 100,
      amountShipping: (session.shipping_cost?.amount_total ?? 0) / 100,
      amountTotal: (session.amount_total ?? 0) / 100,
      shippingMethodLabel: shippingRate?.display_name ?? null,
      siteUrl,
    };

    const [emailResult, forwardResult, cjResult] = await Promise.allSettled([
      sendOrderEmails(orderData),
      forwardToFulfillmentWebhook(orderData),
      submitOrderToCJDropshipping({
        orderRef,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        address: {
          line1: shippingDetails?.address?.line1,
          line2: shippingDetails?.address?.line2,
          city: shippingDetails?.address?.city,
          state: shippingDetails?.address?.state,
          postalCode: shippingDetails?.address?.postal_code,
          country: shippingDetails?.address?.country,
        },
        cottageQty: orderData.cottageQty,
        includeOrderBump: orderData.includeOrderBump,
        bundleId: orderData.bundleId,
        isUpsell: orderData.isUpsell,
        siteUrl,
      }),
    ]);

    const cjOrderId =
      cjResult.status === "fulfilled" ? cjResult.value.cjOrderId : undefined;

    if (stripe && paymentIntentId) {
      try {
        await stripe.paymentIntents.update(paymentIntentId, {
          metadata: {
            ...(paymentIntentObj?.metadata ?? {}),
            order_ref: orderRef,
            fulfillment_processed: "true",
            fulfillment_status: "processing",
            ...(cjOrderId ? { cj_order_id: cjOrderId } : {}),
          },
        });
      } catch (updateErr) {
        console.error(
          "Failed to stamp fulfillment metadata on PaymentIntent:",
          updateErr
        );
      }
    }

    return NextResponse.json({
      received: true,
      ignored: false,
      store: STRIPE_STORE_TAG,
      orderRef,
      sessionId: session.id,
      metadata: session.metadata,
      notifications: {
        email:
          emailResult.status === "fulfilled"
            ? emailResult.value
            : { error: "email_failed" },
        webhookForward:
          forwardResult.status === "fulfilled"
            ? forwardResult.value
            : { forwarded: false },
        cjDropshipping:
          cjResult.status === "fulfilled"
            ? cjResult.value
            : { submitted: false, error: "cj_failed" },
      },
    });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 400 }
    );
  }
}

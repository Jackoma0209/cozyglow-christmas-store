import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { STRIPE_STORE_TAG } from "@/config/product";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    if (webhookSecret && webhookSecret.trim() !== "") {
      const signature = req.headers.get("stripe-signature");
      if (!signature) {
        return NextResponse.json(
          { error: "Missing stripe-signature header." },
          { status: 400 }
        );
      }

      const stripe = new Stripe(
        process.env.STRIPE_SECRET_KEY || "sk_webhook_signature_verifier"
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
    } else {
      event = JSON.parse(rawBody) as Stripe.Event;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.metadata?.store !== STRIPE_STORE_TAG) {
        return NextResponse.json({ received: true, ignored: true });
      }

      return NextResponse.json({
        received: true,
        ignored: false,
        store: STRIPE_STORE_TAG,
        sessionId: session.id,
        metadata: session.metadata,
      });
    }

    return NextResponse.json({ received: true, ignored: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 400 }
    );
  }
}

"use client";

import { CurrencyCode } from "@/config/product";
import { readCookieConsent } from "@/lib/consent";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (event: string, payload?: Record<string, unknown>) => void;
      page?: () => void;
    };
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackAddToCart(params: {
  value: number;
  currency: CurrencyCode;
  bundleId: string;
  itemCount: number;
}): void {
  if (typeof window === "undefined" || readCookieConsent() !== "accepted") {
    return;
  }
  const isoCurrency = params.currency.toUpperCase();

  try {
    window.fbq?.("track", "AddToCart", {
      value: params.value,
      currency: isoCurrency,
      content_ids: [params.bundleId],
      content_type: "product",
      num_items: params.itemCount,
    });
  } catch {
    // ignore pixel errors
  }

  try {
    window.ttq?.track("AddToCart", {
      value: params.value,
      currency: isoCurrency,
      content_id: params.bundleId,
      content_type: "product",
      quantity: params.itemCount,
    });
  } catch {
    // ignore pixel errors
  }

  try {
    window.gtag?.("event", "add_to_cart", {
      currency: isoCurrency,
      value: params.value,
      items: [{ item_id: params.bundleId, quantity: params.itemCount }],
    });
  } catch {
    // ignore pixel errors
  }
}

export function trackInitiateCheckout(params: {
  value: number;
  currency: CurrencyCode;
  bundleId: string;
  itemCount: number;
}): void {
  if (typeof window === "undefined" || readCookieConsent() !== "accepted") {
    return;
  }
  const isoCurrency = params.currency.toUpperCase();

  try {
    window.fbq?.("track", "InitiateCheckout", {
      value: params.value,
      currency: isoCurrency,
      content_ids: [params.bundleId],
      content_type: "product",
      num_items: params.itemCount,
    });
  } catch {
    // ignore pixel errors
  }

  try {
    window.ttq?.track("InitiateCheckout", {
      value: params.value,
      currency: isoCurrency,
      content_id: params.bundleId,
      content_type: "product",
      quantity: params.itemCount,
    });
  } catch {
    // ignore pixel errors
  }

  try {
    window.gtag?.("event", "begin_checkout", {
      currency: isoCurrency,
      value: params.value,
      items: [{ item_id: params.bundleId, quantity: params.itemCount }],
    });
  } catch {
    // ignore pixel errors
  }
}

export function trackPurchase(params: {
  orderId: string;
  value: number;
  currency: CurrencyCode;
  bundleId: string;
}): void {
  if (typeof window === "undefined" || readCookieConsent() !== "accepted") {
    return;
  }
  const dedupeKey = `cg_purchase_tracked_${params.orderId}`;

  try {
    if (window.sessionStorage.getItem(dedupeKey) === "1") {
      return;
    }
    window.sessionStorage.setItem(dedupeKey, "1");
  } catch {
    // proceed even if sessionStorage is unavailable
  }

  const isoCurrency = params.currency.toUpperCase();

  try {
    window.fbq?.("track", "Purchase", {
      value: params.value,
      currency: isoCurrency,
      content_ids: [params.bundleId],
      content_type: "product",
      order_id: params.orderId,
    });
  } catch {
    // ignore pixel errors
  }

  try {
    window.ttq?.track("CompletePayment", {
      value: params.value,
      currency: isoCurrency,
      content_id: params.bundleId,
      content_type: "product",
    });
  } catch {
    // ignore pixel errors
  }

  try {
    window.gtag?.("event", "purchase", {
      transaction_id: params.orderId,
      currency: isoCurrency,
      value: params.value,
      items: [{ item_id: params.bundleId, quantity: 1 }],
    });
  } catch {
    // ignore pixel errors
  }
}

export function trackLead(params: { source: string }): void {
  if (typeof window === "undefined" || readCookieConsent() !== "accepted") {
    return;
  }

  try {
    window.fbq?.("track", "Lead", {
      content_name: "newsletter_signup",
      lead_event_source: params.source,
    });
  } catch {
    // ignore pixel errors
  }

  try {
    window.ttq?.track("SubmitForm", {
      content_name: "newsletter_signup",
      description: params.source,
    });
  } catch {
    // ignore pixel errors
  }

  try {
    window.gtag?.("event", "generate_lead", {
      event_category: "newsletter",
      event_label: params.source,
    });
  } catch {
    // ignore pixel errors
  }
}

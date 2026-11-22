/* eslint-disable @next/next/no-img-element */
"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Gift,
  Loader2,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import {
  BUNDLE_TIERS,
  CURRENCIES,
  CurrencyCode,
  ORDER_BUMP,
  POST_PURCHASE_UPSELL,
  formatMoney,
  getBundlePricing,
  getOrderBumpPrice,
  getOrderReferenceFromSessionId,
  getStandardShippingFee,
} from "@/config/product";
import { CottageVisual } from "@/components/CottageVisual";
import { trackPurchase } from "@/lib/analytics";

interface VerifiedLineItem {
  description: string;
  quantity: number;
  amountTotal: number;
}

interface VerifiedSessionData {
  verified: boolean;
  orderReference: string;
  sessionId: string;
  paymentStatus: string;
  currency: CurrencyCode;
  bundleId: string;
  includeOrderBump: boolean;
  amountSubtotal: number;
  amountShipping: number;
  amountTotal: number;
  customerFirstName: string | null;
  shippingCity: string | null;
  shippingCountry: string | null;
  lineItems: VerifiedLineItem[];
  upsellVerified: boolean;
  upsellAmountTotal: number;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const [demoUpsellClaimed, setDemoUpsellClaimed] = useState(false);
  const [upsellLoading, setUpsellLoading] = useState(false);
  const [upsellError, setUpsellError] = useState<string | null>(null);
  const [upsellThumbLoaded, setUpsellThumbLoaded] = useState(false);
  const [upsellThumbFailed, setUpsellThumbFailed] = useState(false);

  const isDemo = searchParams.get("demo") === "true";
  const bundleParam = searchParams.get("bundle");
  const currencyParam = searchParams.get("currency");
  const bumpParam = searchParams.get("bump") === "1";
  const sessionId = searchParams.get("session_id")?.trim() || null;
  const upsellSessionId = searchParams.get("upsell_session_id")?.trim() || null;
  const upsellCanceled = searchParams.get("upsell_canceled") === "true";

  const [verifying, setVerifying] = useState(Boolean(sessionId && !isDemo));
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifiedOrder, setVerifiedOrder] =
    useState<VerifiedSessionData | null>(null);

  useEffect(() => {
    if (!sessionId || isDemo) {
      setVerifying(false);
      return;
    }

    let cancelled = false;
    setVerifying(true);
    setVerifyError(null);

    const query = new URLSearchParams({ session_id: sessionId });
    if (upsellSessionId) {
      query.set("upsell_session_id", upsellSessionId);
    }

    fetch(`/api/checkout/session?${query.toString()}`)
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(
            payload.error || "Could not verify Stripe order session."
          );
        }
        return payload as VerifiedSessionData;
      })
      .then((data) => {
        if (cancelled) return;
        setVerifiedOrder(data);
        setVerifying(false);

        const isPaid =
          data.paymentStatus === "paid" ||
          data.paymentStatus === "no_payment_required";
        if (isPaid) {
          trackPurchase({
            orderId: data.orderReference,
            value: data.amountTotal,
            currency: data.currency,
            bundleId: data.bundleId,
          });
        }
        if (data.upsellVerified && upsellSessionId) {
          trackPurchase({
            orderId: getOrderReferenceFromSessionId(upsellSessionId),
            value: data.upsellAmountTotal,
            currency: data.currency,
            bundleId: POST_PURCHASE_UPSELL.id,
          });
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setVerifyError(
          err instanceof Error
            ? err.message
            : "Unable to verify live order details."
        );
        setVerifying(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId, upsellSessionId, isDemo]);

  const currency: CurrencyCode =
    verifiedOrder?.currency ?? (currencyParam === "usd" ? "usd" : "gbp");

  const resolvedBundleId = verifiedOrder?.bundleId ?? bundleParam;
  const bundle =
    BUNDLE_TIERS.find((b) => b.id === resolvedBundleId) ?? BUNDLE_TIERS[1];

  const bundlePricing = getBundlePricing(bundle, currency);
  const bumpPricing = getOrderBumpPrice(currency);
  const shippingFee = verifiedOrder
    ? verifiedOrder.amountShipping
    : getStandardShippingFee(bundle, currency);

  const upsellPrice =
    currency === "gbp"
      ? POST_PURCHASE_UPSELL.priceGbp
      : POST_PURCHASE_UPSELL.priceUsd;
  const upsellCompareAt =
    currency === "gbp"
      ? POST_PURCHASE_UPSELL.compareAtGbp
      : POST_PURCHASE_UPSELL.compareAtUsd;

  const orderReference = useMemo(() => {
    if (verifiedOrder?.orderReference) {
      return verifiedOrder.orderReference;
    }
    return getOrderReferenceFromSessionId(sessionId);
  }, [verifiedOrder, sessionId]);

  const upsellClaimed =
    Boolean(verifiedOrder?.upsellVerified) || demoUpsellClaimed;

  const totalPaid = verifiedOrder
    ? verifiedOrder.amountTotal +
      (verifiedOrder.upsellVerified ? verifiedOrder.upsellAmountTotal : 0)
    : bundlePricing.price +
      (bumpParam ? bumpPricing.price : 0) +
      shippingFee +
      (demoUpsellClaimed ? upsellPrice : 0);

  const currencyMeta = CURRENCIES[currency];

  const handleClaimUpsell = async () => {
    setUpsellLoading(true);
    setUpsellError(null);
    try {
      const response = await fetch("/api/checkout/upsell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentSessionId: sessionId,
          currency,
          demoMode: isDemo || !sessionId,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.checkoutUrl) {
        throw new Error(
          data.error || "Unable to start VIP add-on checkout right now."
        );
      }

      if (data.demoMode) {
        setDemoUpsellClaimed(true);
        setUpsellLoading(false);
      } else {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setUpsellError(
        err instanceof Error
          ? err.message
          : "Could not start VIP add-on checkout."
      );
      setUpsellLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 text-pine-950 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-pine-800 hover:text-crimson-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to CozyGlow™ Storefront
        </Link>

        {/* Confirmation Header Card */}
        <div className="rounded-3xl bg-white border border-pine-900/15 p-6 sm:p-8 shadow-card-soft space-y-6">
          {verifying && (
            <div className="rounded-2xl bg-cream-100 border border-pine-900/10 p-4 flex items-center gap-3 text-sm font-semibold text-pine-800">
              <Loader2 className="w-4 h-4 animate-spin text-crimson-700 shrink-0" />
              <span>Verifying your Stripe payment confirmation...</span>
            </div>
          )}

          {verifyError && (
            <div className="rounded-2xl bg-amber-50 border border-amber-300 p-4 flex items-start gap-2.5 text-xs sm:text-sm text-amber-900">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
              <span>
                {verifyError} Showing estimated receipt details for reference{" "}
                <strong className="font-mono">{orderReference}</strong>.
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                    {verifiedOrder?.paymentStatus === "unpaid"
                      ? "Payment Processing"
                      : "Order Confirmed"}
                  </span>
                  {isDemo && (
                    <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                      Interactive Demo Mode
                    </span>
                  )}
                  {verifiedOrder && (
                    <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      Stripe Verified
                    </span>
                  )}
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-pine-950 mt-1">
                  {verifiedOrder?.customerFirstName
                    ? `Thank You, ${verifiedOrder.customerFirstName}! Your CozyGlow™ Is Queued`
                    : "Thank You! Your CozyGlow™ Is Queued for Dispatch"}
                </h1>
                <p className="text-sm text-pine-700 mt-1">
                  Order Reference:{" "}
                  <span className="font-mono font-bold text-pine-950">
                    {orderReference}
                  </span>{" "}
                  • Ships from {currencyMeta.warehouseLabel}
                  {verifiedOrder?.shippingCity
                    ? ` → ${verifiedOrder.shippingCity}${
                        verifiedOrder.shippingCountry
                          ? `, ${verifiedOrder.shippingCountry}`
                          : ""
                      }`
                    : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Dispatch Status Strip */}
          <div className="rounded-2xl bg-cream-100 border border-pine-900/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-crimson-700 shrink-0" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold text-pine-950">
                  Estimated Arrival: {currencyMeta.deliveryEta}
                </p>
                <p className="text-pine-700">
                  Courier: {currencyMeta.courierLabel}
                </p>
              </div>
            </div>
            <Link
              href={`/track?order=${encodeURIComponent(orderReference)}`}
              className="inline-flex items-center justify-center rounded-xl bg-pine-900 hover:bg-pine-800 text-cream-50 text-xs font-bold px-4 py-2.5 transition-colors"
            >
              <PackageCheck className="w-4 h-4 mr-1.5 text-amberGlow-300" />
              Track Live Parcel Status
            </Link>
          </div>

          {/* Itemized Receipt */}
          <div className="space-y-3 border-t border-pine-900/10 pt-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-pine-700">
              Order Summary
            </h2>

            {verifiedOrder && verifiedOrder.lineItems.length > 0 ? (
              verifiedOrder.lineItems.map((item, idx) => (
                <div
                  key={`${item.description}-${idx}`}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-bold text-pine-950">
                      {item.description}
                    </p>
                    <p className="text-xs text-pine-700">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-pine-950">
                    {formatMoney(item.amountTotal, currency)}
                  </span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-bold text-pine-950">{bundle.name}</p>
                    <p className="text-xs text-pine-700">
                      {bundle.quantity}x CozyGlow™ Cottage Diffuser + Braided
                      USB-C Cable
                    </p>
                  </div>
                  <span className="font-bold text-pine-950">
                    {formatMoney(bundlePricing.price, currency)}
                  </span>
                </div>

                {bumpParam && (
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-bold text-pine-950">
                        Festive Essential Oil Trio + Gift Box Wrapping
                      </p>
                      <p className="text-xs text-pine-700">
                        Pine Forest, Cinnamon Hearth &amp; Winter Berry
                      </p>
                    </div>
                    <span className="font-bold text-pine-950">
                      {formatMoney(bumpPricing.price, currency)}
                    </span>
                  </div>
                )}
              </>
            )}

            {upsellClaimed && (
              <div className="flex items-center justify-between text-sm bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <div>
                  <p className="font-bold text-emerald-900">
                    VIP Add-On Confirmed: 1x Extra Cottage + 6-Oil Scent Vault
                  </p>
                  <p className="text-xs text-emerald-800">
                    Merged into your priority box with zero extra shipping
                  </p>
                </div>
                <span className="font-bold text-emerald-900">
                  {formatMoney(
                    verifiedOrder?.upsellVerified
                      ? verifiedOrder.upsellAmountTotal
                      : upsellPrice,
                    currency
                  )}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-pine-800">
              <span>Tracked Holiday Delivery</span>
              <span className="font-semibold text-emerald-700">
                {shippingFee === 0
                  ? "FREE"
                  : formatMoney(shippingFee, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between text-lg font-extrabold text-pine-950 pt-3 border-t border-pine-900/10">
              <span>Total Confirmed</span>
              <span>{formatMoney(totalPaid, currency)}</span>
            </div>
          </div>
        </div>

        {/* Post-Purchase VIP Upsell Offer */}
        <div className="rounded-3xl bg-gradient-to-br from-pine-900 via-pine-950 to-[#0B1914] text-cream-50 border-2 border-amberGlow-400/60 p-6 sm:p-8 shadow-warm-glow">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="relative md:col-span-4 aspect-square rounded-2xl overflow-hidden border border-white/15 bg-pine-950">
              <CottageVisual scene="mantel" mistActive glowActive />
              {!upsellThumbFailed && (
                <img
                  ref={(el) => {
                    if (!el || !el.complete) return;
                    if (el.naturalWidth === 0 && !upsellThumbFailed) {
                      setUpsellThumbFailed(true);
                    } else if (el.naturalWidth > 0 && !upsellThumbLoaded) {
                      setUpsellThumbLoaded(true);
                    }
                  }}
                  src="/images/products/04-mantel-village-setup.jpg"
                  alt="CozyGlow™ Mantel Village Add-On"
                  onLoad={() => setUpsellThumbLoaded(true)}
                  onError={() => setUpsellThumbFailed(true)}
                  className={`absolute inset-0 z-10 w-full h-full object-cover transition-opacity duration-300 ${
                    upsellThumbLoaded
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                />
              )}
            </div>

            <div className="md:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson-700 text-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider">
                <Gift className="w-3.5 h-3.5 text-amberGlow-300" />
                {POST_PURCHASE_UPSELL.discountBadge}
              </span>

              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
                {POST_PURCHASE_UPSELL.title}
              </h2>
              <p className="text-xs sm:text-sm text-cream-200/85 leading-relaxed">
                {POST_PURCHASE_UPSELL.subtitle}
              </p>

              <ul className="space-y-1.5 text-xs text-cream-100">
                {POST_PURCHASE_UPSELL.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amberGlow-300 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {upsellCanceled && !upsellClaimed && (
                <p className="text-xs text-amberGlow-300">
                  No problem — your main order {orderReference} is still locked
                  in. You can still claim this VIP add-on below before dispatch.
                </p>
              )}

              {upsellError && (
                <div className="rounded-xl bg-red-950/60 border border-red-400/40 px-3 py-2 text-xs text-red-200">
                  {upsellError}
                </div>
              )}

              {upsellClaimed ? (
                <div className="rounded-2xl bg-emerald-500/20 border border-emerald-400/50 p-4 flex items-center gap-3 text-emerald-200 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>
                    VIP Add-On Confirmed! Included inside shipment{" "}
                    {orderReference}.
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={upsellLoading}
                  onClick={handleClaimUpsell}
                  className="w-full rounded-2xl bg-amberGlow-400 hover:bg-amberGlow-300 disabled:opacity-70 text-pine-950 font-extrabold py-4 px-5 text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {upsellLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Opening Express VIP Checkout...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        Add to My Priority Box —{" "}
                        {formatMoney(upsellPrice, currency)}
                      </span>
                      <span className="text-xs line-through opacity-70">
                        {formatMoney(upsellCompareAt, currency)}
                      </span>
                    </>
                  )}
                </button>
              )}

              <p className="text-[11px] text-cream-200/70 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Covered by your existing 30-Day Money-Back Guarantee •{" "}
                {ORDER_BUMP.badge}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6">
          <div className="rounded-2xl bg-white border border-pine-900/15 px-6 py-4 text-sm font-semibold text-pine-900 shadow-sm">
            Loading your CozyGlow™ order confirmation...
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

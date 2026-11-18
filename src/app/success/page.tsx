"use client";

import React, { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Gift,
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
} from "@/config/product";
import { CottageVisual } from "@/components/CottageVisual";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [upsellClaimed, setUpsellClaimed] = useState(false);

  const isDemo = searchParams.get("demo") === "true";
  const bundleParam = searchParams.get("bundle");
  const currencyParam = searchParams.get("currency");
  const bumpParam = searchParams.get("bump") === "1";

  const currency: CurrencyCode = currencyParam === "usd" ? "usd" : "gbp";
  const bundle =
    BUNDLE_TIERS.find((b) => b.id === bundleParam) ?? BUNDLE_TIERS[1];
  const bundlePricing = getBundlePricing(bundle, currency);
  const bumpPricing = getOrderBumpPrice(currency);
  const shippingFee = bundle.freeShipping
    ? 0
    : currency === "gbp"
    ? 4.95
    : 6.95;

  const upsellPrice =
    currency === "gbp"
      ? POST_PURCHASE_UPSELL.priceGbp
      : POST_PURCHASE_UPSELL.priceUsd;
  const upsellCompareAt =
    currency === "gbp"
      ? POST_PURCHASE_UPSELL.compareAtGbp
      : POST_PURCHASE_UPSELL.compareAtUsd;

  const orderReference = useMemo(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId && sessionId.length > 6) {
      return `#CG-${sessionId.slice(-5).toUpperCase()}`;
    }
    return "#CG-84920";
  }, [searchParams]);

  const totalPaid =
    bundlePricing.price +
    (bumpParam ? bumpPricing.price : 0) +
    shippingFee +
    (upsellClaimed ? upsellPrice : 0);

  const currencyMeta = CURRENCIES[currency];

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
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                    Order Confirmed
                  </span>
                  {isDemo && (
                    <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                      Interactive Demo Mode
                    </span>
                  )}
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-pine-950 mt-1">
                  Thank You! Your CozyGlow™ Is Queued for Dispatch
                </h1>
                <p className="text-sm text-pine-700 mt-1">
                  Order Reference:{" "}
                  <span className="font-mono font-bold text-pine-950">
                    {orderReference}
                  </span>{" "}
                  • Ships from {currencyMeta.warehouseLabel}
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

            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="font-bold text-pine-950">{bundle.name}</p>
                <p className="text-xs text-pine-700">
                  {bundle.quantity}x CozyGlow™ Cottage Diffuser + Braided USB-C Cable
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

            {upsellClaimed && (
              <div className="flex items-center justify-between text-sm bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <div>
                  <p className="font-bold text-emerald-900">
                    VIP Add-On Added: 1x Extra Cottage + 6-Oil Scent Vault
                  </p>
                  <p className="text-xs text-emerald-800">
                    Merged into your priority box with zero extra shipping
                  </p>
                </div>
                <span className="font-bold text-emerald-900">
                  {formatMoney(upsellPrice, currency)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-pine-800">
              <span>Tracked Holiday Delivery</span>
              <span className="font-semibold text-emerald-700">
                {shippingFee === 0 ? "FREE" : formatMoney(shippingFee, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between text-lg font-extrabold text-pine-950 pt-3 border-t border-pine-900/10">
              <span>Total Confirmed</span>
              <span>{formatMoney(totalPaid, currency)}</span>
            </div>
          </div>
        </div>

        {/* Post-Purchase 1-Click VIP Upsell Offer */}
        <div className="rounded-3xl bg-gradient-to-br from-pine-900 via-pine-950 to-[#0B1914] text-cream-50 border-2 border-amberGlow-400/60 p-6 sm:p-8 shadow-warm-glow">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 aspect-square rounded-2xl overflow-hidden border border-white/15">
              <CottageVisual scene="mantel" mistActive glowActive />
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

              {upsellClaimed ? (
                <div className="rounded-2xl bg-emerald-500/20 border border-emerald-400/50 p-4 flex items-center gap-3 text-emerald-200 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>
                    1-Click VIP Add-On Confirmed! Included inside shipment {orderReference}.
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setUpsellClaimed(true)}
                  className="w-full rounded-2xl bg-amberGlow-400 hover:bg-amberGlow-300 text-pine-950 font-extrabold py-4 px-5 text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>
                    1-Click Add to My Box — {formatMoney(upsellPrice, currency)}
                  </span>
                  <span className="text-xs line-through opacity-70">
                    {formatMoney(upsellCompareAt, currency)}
                  </span>
                </button>
              )}

              <p className="text-[11px] text-cream-200/70 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Covered by your existing 30-Day Money-Back Guarantee • {ORDER_BUMP.badge}
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

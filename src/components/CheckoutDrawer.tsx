"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Gift,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import {
  BUNDLE_TIERS,
  BundleTier,
  CURRENCIES,
  CurrencyCode,
  ORDER_BUMP,
  formatMoney,
  getBundlePricing,
  getOrderBumpPrice,
} from "@/config/product";
import { CottageVisual } from "./CottageVisual";
import { cn } from "@/lib/utils";

interface CheckoutDrawerProps {
  open: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  selectedBundleId: BundleTier["id"];
  onSelectBundle: (id: BundleTier["id"]) => void;
  includeOrderBump: boolean;
  onToggleOrderBump: (next: boolean) => void;
}

export function CheckoutDrawer({
  open,
  onClose,
  currency,
  onCurrencyChange,
  selectedBundleId,
  onSelectBundle,
  includeOrderBump,
  onToggleOrderBump,
}: CheckoutDrawerProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!open) return null;

  const activeBundle =
    BUNDLE_TIERS.find((b) => b.id === selectedBundleId) ?? BUNDLE_TIERS[1];
  const bundlePricing = getBundlePricing(activeBundle, currency);
  const bumpPricing = getOrderBumpPrice(currency);
  const currencyMeta = CURRENCIES[currency];

  const shippingFee = activeBundle.freeShipping ? 0 : currency === "gbp" ? 4.95 : 6.95;
  const subtotal =
    bundlePricing.price + (includeOrderBump ? bumpPricing.price : 0);
  const total = subtotal + shippingFee;
  const totalSaved =
    bundlePricing.compareAt -
    bundlePricing.price +
    (includeOrderBump ? bumpPricing.compareAt - bumpPricing.price : 0);

  const handleCheckout = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundleId: selectedBundleId,
          currency,
          includeOrderBump,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Unable to initiate checkout session.");
      }

      if (data.demoMode) {
        onClose();
        router.push(data.checkoutUrl);
      } else {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Checkout failed. Please try again."
      );
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="CozyGlow Checkout Bag"
    >
      <div className="w-full max-w-md bg-cream-50 h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Drawer Header */}
        <div className="p-5 bg-pine-950 text-cream-50 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amberGlow-300" />
            <div>
              <h2 className="font-serif text-lg font-bold leading-none">
                Your Holiday Express Bag
              </h2>
              <p className="text-[11px] text-amberGlow-300 mt-1 font-medium">
                Dispatches within 24h • {currencyMeta.warehouseLabel}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout drawer"
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Express Shipping Progress Bar */}
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              {activeBundle.freeShipping ? (
                <span>
                  Unlocked! FREE Tracked Express Holiday Shipping Included
                </span>
              ) : (
                <span>
                  Upgrade to 2x or 3x Bundle to unlock FREE Tracked Express Shipping
                </span>
              )}
            </div>
            <div className="w-full h-2 rounded-full bg-emerald-200 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  activeBundle.freeShipping
                    ? "w-full bg-emerald-600"
                    : "w-2/3 bg-amber-500"
                )}
              />
            </div>
          </div>

          {/* Currency Switch Inside Drawer */}
          <div className="flex items-center justify-between text-xs font-semibold text-pine-800">
            <span>Checkout Currency:</span>
            <div className="inline-flex rounded-full bg-cream-200 p-0.5 border border-pine-900/10">
              {(["gbp", "usd"] as CurrencyCode[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onCurrencyChange(code)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-bold transition-all",
                    currency === code
                      ? "bg-pine-900 text-white"
                      : "text-pine-800"
                  )}
                >
                  {CURRENCIES[code].flag} {code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Item Card */}
          <div className="rounded-2xl bg-white border border-pine-900/15 p-4 space-y-3 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-pine-900/10">
                <CottageVisual scene="chimney" mistActive glowActive />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-pine-950 leading-snug">
                  {activeBundle.name}
                </p>
                <p className="text-xs text-pine-700 mt-0.5">
                  Qty: {activeBundle.quantity} Cottage Diffuser
                  {activeBundle.quantity > 1 ? "s" : ""} + USB-C Cable
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-extrabold text-pine-950">
                    {formatMoney(bundlePricing.price, currency)}
                  </span>
                  <span className="text-xs text-pine-700/70 line-through">
                    {formatMoney(bundlePricing.compareAt, currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Tier Switcher inside Drawer */}
            <div className="pt-2 border-t border-pine-900/10">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-pine-700 mb-1.5">
                Switch Bundle Savings:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {BUNDLE_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => onSelectBundle(tier.id)}
                    className={cn(
                      "rounded-xl py-2 px-1.5 text-[11px] font-bold border text-center transition-all",
                      tier.id === selectedBundleId
                        ? "bg-pine-900 text-amberGlow-300 border-pine-900"
                        : "bg-cream-50 text-pine-900 border-pine-900/15 hover:border-pine-900/35"
                    )}
                  >
                    {tier.quantity}x ({tier.savingsPercent}% Off)
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* In-Drawer Order Bump */}
          <div
            onClick={() => onToggleOrderBump(!includeOrderBump)}
            role="checkbox"
            aria-checked={includeOrderBump}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                onToggleOrderBump(!includeOrderBump);
              }
            }}
            className={cn(
              "cursor-pointer rounded-2xl border-2 border-dashed p-3.5 transition-all",
              includeOrderBump
                ? "border-crimson-600 bg-amber-50"
                : "border-amber-500/50 bg-white hover:bg-amber-50/40"
            )}
          >
            <div className="flex items-start gap-2.5">
              <span
                className={cn(
                  "mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0",
                  includeOrderBump
                    ? "bg-crimson-700 border-crimson-700 text-white"
                    : "border-pine-900/40 bg-white"
                )}
              >
                {includeOrderBump && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-crimson-700 uppercase">
                    <Gift className="w-3 h-3" />
                    Order Bump
                  </span>
                  <span className="text-xs font-extrabold text-crimson-700">
                    +{formatMoney(bumpPricing.price, currency)}
                  </span>
                </div>
                <p className="text-xs font-bold text-pine-950 mt-0.5">
                  {ORDER_BUMP.title}
                </p>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-crimson-700">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-5 bg-white border-t border-pine-900/15 space-y-3">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-pine-800">
              <span>Subtotal</span>
              <span className="font-semibold">
                {formatMoney(subtotal, currency)}
              </span>
            </div>
            <div className="flex justify-between text-pine-800">
              <span>Tracked Holiday Delivery</span>
              <span className="font-semibold text-emerald-700">
                {shippingFee === 0 ? "FREE" : formatMoney(shippingFee, currency)}
              </span>
            </div>
            <div className="flex justify-between text-emerald-700 text-xs font-bold">
              <span>Seasonal Bundle Savings</span>
              <span>-{formatMoney(totalSaved, currency)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-pine-950 pt-2 border-t border-pine-900/10">
              <span>Total</span>
              <span>{formatMoney(total, currency)}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={handleCheckout}
            className="w-full rounded-2xl bg-crimson-700 hover:bg-crimson-600 disabled:opacity-70 text-white font-bold py-4 px-5 text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Preparing Secure Checkout...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amberGlow-300" />
                <span>
                  Proceed to Secure Checkout — {formatMoney(total, currency)}
                </span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-pine-700 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            256-Bit Encrypted Checkout • 30-Day Money-Back Guarantee
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Lock, Sparkles } from "lucide-react";
import {
  BUNDLE_TIERS,
  BundleTier,
  CurrencyCode,
  formatMoney,
  getBundlePricing,
  getOrderBumpPrice,
} from "@/config/product";

interface StickyBuyBarProps {
  currency: CurrencyCode;
  selectedBundleId: BundleTier["id"];
  onSelectBundle: (id: BundleTier["id"]) => void;
  includeOrderBump: boolean;
  onClaimNow: () => void;
}

export function StickyBuyBar({
  currency,
  selectedBundleId,
  onSelectBundle,
  includeOrderBump,
  onClaimNow,
}: StickyBuyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 650);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const activeBundle =
    BUNDLE_TIERS.find((b) => b.id === selectedBundleId) ?? BUNDLE_TIERS[1];
  const pricing = getBundlePricing(activeBundle, currency);
  const bump = getOrderBumpPrice(currency);
  const total = pricing.price + (includeOrderBump ? bump.price : 0);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-pine-950/95 backdrop-blur-md border-t border-amberGlow-400/30 text-cream-50 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] px-3 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
        {/* Product & Instant Bundle Selector */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amberGlow-400/15 border border-amberGlow-400/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amberGlow-300" />
            </div>
            <div>
              <p className="font-serif font-bold text-sm text-white leading-tight">
                CozyGlow™ Christmas Cottage
              </p>
              <p className="text-[11px] text-amberGlow-300 font-semibold">
                {activeBundle.shortLabel}
                {includeOrderBump ? " + Festive Oil Trio" : ""}
              </p>
            </div>
          </div>

          <select
            aria-label="Quick select bundle"
            value={selectedBundleId}
            onChange={(e) =>
              onSelectBundle(e.target.value as BundleTier["id"])
            }
            className="rounded-xl bg-pine-900 border border-white/20 text-xs font-bold text-cream-50 px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-amberGlow-400"
          >
            {BUNDLE_TIERS.map((tier) => {
              const p = getBundlePricing(tier, currency);
              return (
                <option key={tier.id} value={tier.id}>
                  {tier.shortLabel} — {formatMoney(p.price, currency)}
                </option>
              );
            })}
          </select>
        </div>

        {/* 1-Click Checkout Trigger */}
        <button
          type="button"
          onClick={onClaimNow}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-crimson-700 hover:bg-crimson-600 text-white font-bold text-sm px-6 py-3 shadow-lg transition-all shrink-0"
        >
          <Lock className="w-3.5 h-3.5 text-amberGlow-300" />
          <span>
            Express Checkout — {formatMoney(total, currency)}
          </span>
        </button>
      </div>
    </div>
  );
}

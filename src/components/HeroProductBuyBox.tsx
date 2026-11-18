"use client";

import React, { useState } from "react";
import {
  Check,
  Flame,
  Lock,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Volume2,
  Wind,
  Zap,
  Gift,
} from "lucide-react";
import {
  BUNDLE_TIERS,
  BundleTier,
  CURRENCIES,
  CurrencyCode,
  GALLERY_SLIDES,
  ORDER_BUMP,
  PRODUCT_CONFIG,
  formatMoney,
  getBundlePricing,
  getOrderBumpPrice,
} from "@/config/product";
import { CottageVisual } from "./CottageVisual";
import { cn } from "@/lib/utils";

interface HeroProductBuyBoxProps {
  currency: CurrencyCode;
  selectedBundleId: BundleTier["id"];
  onSelectBundle: (id: BundleTier["id"]) => void;
  includeOrderBump: boolean;
  onToggleOrderBump: (next: boolean) => void;
  onClaimNow: () => void;
}

export function HeroProductBuyBox({
  currency,
  selectedBundleId,
  onSelectBundle,
  includeOrderBump,
  onToggleOrderBump,
  onClaimNow,
}: HeroProductBuyBoxProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [previewMist, setPreviewMist] = useState(true);
  const [previewGlow, setPreviewGlow] = useState(true);

  const activeSlide = GALLERY_SLIDES[activeSlideIndex];
  const currencyMeta = CURRENCIES[currency];
  const selectedBundle =
    BUNDLE_TIERS.find((b) => b.id === selectedBundleId) ?? BUNDLE_TIERS[1];
  const bundlePricing = getBundlePricing(selectedBundle, currency);
  const bumpPricing = getOrderBumpPrice(currency);
  const totalAmount =
    bundlePricing.price + (includeOrderBump ? bumpPricing.price : 0);

  return (
    <section
      id="buy-box"
      className="relative pt-6 pb-14 lg:pt-10 lg:pb-20 bg-gradient-to-b from-cream-100 via-cream-50 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Interactive Media Gallery + Pure-CSS Animated Chimney Mist */}
          <div className="lg:col-span-6 lg:sticky lg:top-28 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-pine-900/15 bg-pine-950 shadow-card-soft aspect-[4/3] sm:aspect-[5/4]">
              <CottageVisual
                scene={activeSlide.scene}
                mistActive={previewMist}
                glowActive={previewGlow}
                intensity="steady"
              />

              {/* Top-left Live Preview Status Pill */}
              <div className="absolute top-4 left-4 z-30 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pine-950/85 backdrop-blur-md text-amberGlow-300 border border-amber-300/30 px-3 py-1 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  {activeSlide.badge}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson-700/90 text-white px-3 py-1 text-xs font-bold shadow">
                  #1 Trending Winter Gift
                </span>
              </div>

              {/* Interactive Live Mist & Hearth Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="rounded-2xl bg-pine-950/85 backdrop-blur-md border border-white/15 px-4 py-3 text-cream-50 max-w-md">
                  <p className="text-xs font-bold uppercase tracking-wider text-amberGlow-300">
                    {activeSlide.shortTitle}
                  </p>
                  <p className="text-xs sm:text-sm text-cream-100/90 mt-0.5 leading-snug">
                    {activeSlide.caption}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-end">
                  <button
                    type="button"
                    onClick={() => setPreviewMist((v) => !v)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border transition-all backdrop-blur-md",
                      previewMist
                        ? "bg-white/95 text-pine-950 border-white shadow"
                        : "bg-pine-950/70 text-cream-100 border-white/20"
                    )}
                  >
                    <Wind className="w-3.5 h-3.5" />
                    Mist: {previewMist ? "ON" : "OFF"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewGlow((v) => !v)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border transition-all backdrop-blur-md",
                      previewGlow
                        ? "bg-amberGlow-400 text-pine-950 border-amberGlow-300 shadow"
                        : "bg-pine-950/70 text-cream-100 border-white/20"
                    )}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    LED: {previewGlow ? "2200K" : "OFF"}
                  </button>
                </div>
              </div>
            </div>

            {/* 5 Curated Visual Cards Selector */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {GALLERY_SLIDES.map((slide, idx) => {
                const isSelected = idx === activeSlideIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlideIndex(idx)}
                    className={cn(
                      "group relative rounded-2xl overflow-hidden border text-left transition-all p-1.5 bg-white",
                      isSelected
                        ? "border-crimson-600 ring-2 ring-crimson-600/25 shadow-md"
                        : "border-pine-900/15 hover:border-pine-900/40"
                    )}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-1.5">
                      <CottageVisual
                        scene={slide.scene}
                        mistActive={slide.scene !== "giftbox"}
                        glowActive
                      />
                    </div>
                    <p className="text-[10px] sm:text-[11px] font-bold text-pine-950 leading-tight line-clamp-2 px-0.5">
                      {slide.shortTitle}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Key Micro-Specs Bar */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="rounded-2xl bg-cream-100 border border-pine-900/10 p-3 flex items-center gap-2.5">
                <Volume2 className="w-5 h-5 text-pine-800 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-pine-950">&lt;25dB Silent</p>
                  <p className="text-[11px] text-pine-700">Sleep-safe flow</p>
                </div>
              </div>
              <div className="rounded-2xl bg-cream-100 border border-pine-900/10 p-3 flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-pine-950">USB-C Powered</p>
                  <p className="text-[11px] text-pine-700">200ml • 6–8 hrs</p>
                </div>
              </div>
              <div className="rounded-2xl bg-cream-100 border border-pine-900/10 p-3 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-pine-950">Auto Shut-Off</p>
                  <p className="text-[11px] text-pine-700">Zero heat / flame</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: High-Converting Buy Box */}
          <div className="lg:col-span-6 space-y-5">
            {/* Social Proof Star Badge & Live Stock Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <a
                href="#reviews"
                className="inline-flex items-center gap-2 rounded-full bg-white border border-pine-900/10 px-3.5 py-1.5 shadow-sm hover:border-pine-900/30 transition-colors"
              >
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-pine-950">
                  {PRODUCT_CONFIG.rating}/5
                </span>
                <span className="text-xs text-pine-700 font-medium">
                  ({PRODUCT_CONFIG.reviewCount.toLocaleString()}+ Verified Holiday Shoppers)
                </span>
              </a>

              <div className="inline-flex items-center gap-2 rounded-full bg-crimson-600/10 border border-crimson-600/25 px-3 py-1.5 text-xs font-bold text-crimson-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson-600 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-crimson-600" />
                </span>
                Only {currencyMeta.stockCount} cottages left in UK/US Express Warehouse
              </div>
            </div>

            {/* Product Headline & Core Value Prop */}
            <div className="space-y-2.5">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-pine-950 leading-[1.12] tracking-tight">
                {PRODUCT_CONFIG.productTitle}
              </h1>
              <p className="text-base text-pine-800 leading-relaxed">
                {PRODUCT_CONFIG.valueProposition}
              </p>
              <p className="text-xs font-semibold text-pine-700 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-700" />
                Dispatching daily from{" "}
                <span className="text-pine-950 underline decoration-amber-400/80 underline-offset-2">
                  {currencyMeta.warehouseLabel}
                </span>{" "}
                via {currencyMeta.courierLabel}
              </p>
            </div>

            {/* 3-Tier Bundle Selector Cards */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-pine-800">
                  1. Choose Your Holiday Bundle
                </span>
                <span className="text-xs font-semibold text-crimson-700">
                  Up to 56% Off Seasonal Batch
                </span>
              </div>

              <div className="space-y-3">
                {BUNDLE_TIERS.map((tier) => {
                  const selected = tier.id === selectedBundleId;
                  const pricing = getBundlePricing(tier, currency);
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => onSelectBundle(tier.id)}
                      className={cn(
                        "relative w-full text-left rounded-2xl border-2 p-4 transition-all",
                        selected
                          ? "border-pine-900 bg-white shadow-card-soft ring-2 ring-amberGlow-400/50"
                          : "border-pine-900/15 bg-white/80 hover:border-pine-900/35"
                      )}
                    >
                      {tier.badge && (
                        <span
                          className={cn(
                            "absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm",
                            tier.isPopular
                              ? "bg-crimson-700 text-white"
                              : tier.isBestValue
                              ? "bg-pine-900 text-amberGlow-300"
                              : "bg-cream-200 text-pine-900"
                          )}
                        >
                          {tier.badge}
                        </span>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span
                            className={cn(
                              "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                              selected
                                ? "border-pine-900 bg-pine-900 text-amberGlow-300"
                                : "border-pine-900/30 bg-white"
                            )}
                          >
                            {selected && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                          <div>
                            <p className="font-bold text-pine-950 text-sm sm:text-base">
                              {tier.name}
                            </p>
                            <p className="text-xs text-pine-700 mt-0.5">
                              {tier.tagline}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-lg sm:text-xl font-extrabold text-pine-950">
                            {formatMoney(pricing.price, currency)}
                          </p>
                          <p className="text-xs text-pine-700/70 line-through">
                            {formatMoney(pricing.compareAt, currency)}
                          </p>
                          {tier.quantity > 1 && (
                            <p className="text-[11px] font-bold text-emerald-700 mt-0.5">
                              {formatMoney(pricing.perUnit, currency)} / each
                            </p>
                          )}
                        </div>
                      </div>

                      <ul className="mt-3 pl-8 space-y-1">
                        {tier.includes.map((line) => (
                          <li
                            key={line}
                            className="flex items-center gap-1.5 text-xs text-pine-800 font-medium"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1-Click Order Bump Checkbox Card */}
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
                "cursor-pointer rounded-2xl border-2 border-dashed p-4 transition-all select-none",
                includeOrderBump
                  ? "border-crimson-600 bg-amber-50/90 shadow-sm"
                  : "border-amber-500/60 bg-cream-100/80 hover:bg-amber-50/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
                    includeOrderBump
                      ? "bg-crimson-700 border-crimson-700 text-white"
                      : "bg-white border-pine-900/40"
                  )}
                >
                  {includeOrderBump && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-crimson-700 text-white px-2 py-0.5 rounded-full">
                      <Gift className="w-3 h-3" />
                      {ORDER_BUMP.badge}
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-crimson-700">
                        +{formatMoney(bumpPricing.price, currency)}
                      </span>{" "}
                      <span className="text-xs text-pine-700/70 line-through">
                        {formatMoney(bumpPricing.compareAt, currency)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-pine-950 mt-1.5">
                    Yes! Add the {ORDER_BUMP.title}
                  </p>
                  <p className="text-xs text-pine-800 mt-1 leading-relaxed">
                    {ORDER_BUMP.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Primary High-Contrast CTA */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={onClaimNow}
                className="w-full rounded-2xl bg-crimson-700 hover:bg-crimson-600 active:scale-[0.99] text-white font-bold text-base sm:text-lg py-4 px-6 shadow-[0_14px_30px_-8px_rgba(185,28,28,0.65)] transition-all flex items-center justify-center gap-2.5"
              >
                <Lock className="w-4 h-4 text-amberGlow-300 shrink-0" />
                <span>
                  Claim My CozyGlow™ Now — Ships Within 24 Hours (
                  {formatMoney(totalAmount, currency)})
                </span>
              </button>

              {/* Payment & Guarantee Trust Badges */}
              <div className="rounded-2xl bg-cream-100/90 border border-pine-900/10 p-3.5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-pine-900">
                  {[
                    "Apple Pay",
                    "Google Pay",
                    "Visa",
                    "Mastercard",
                    "Klarna",
                  ].map((badge) => (
                    <span
                      key={badge}
                      className="px-2.5 py-1 rounded-md bg-white border border-pine-900/15 shadow-sm"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-semibold text-pine-800">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    30-Day Money-Back Guarantee
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    {currencyMeta.deliveryEta} Tracked Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

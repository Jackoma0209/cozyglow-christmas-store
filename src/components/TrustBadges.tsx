"use client";

import React from "react";
import { Lock, RotateCcw, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { PRODUCT_CONFIG } from "@/config/product";
import { cn } from "@/lib/utils";

export interface TrustBadgesProps {
  variant?: "product" | "checkout" | "banner";
  freeShippingUnlocked?: boolean;
  deliveryEta?: string;
  guaranteeDays?: number;
  className?: string;
}

function PaymentBadgeRow({ compact = false }: { compact?: boolean }) {
  const pillBase = compact
    ? "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[10px] font-bold border shadow-sm select-none leading-tight"
    : "inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-[11px] font-bold border shadow-sm select-none leading-tight";

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-1.5"
      aria-label="Accepted payment methods"
    >
      {/* Visa */}
      <span
        aria-label="Visa"
        className={cn(
          pillBase,
          "bg-white border-pine-900/15 text-[#1A1F71] tracking-wider italic font-extrabold"
        )}
      >
        <span aria-hidden="true">VISA</span>
      </span>

      {/* Mastercard */}
      <span
        aria-label="Mastercard"
        className={cn(
          pillBase,
          "bg-white border-pine-900/15 text-pine-950 gap-1"
        )}
      >
        <svg
          width={compact ? 16 : 18}
          height={compact ? 10 : 12}
          viewBox="0 0 24 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="9" cy="8" r="6" fill="#EB001B" />
          <circle cx="15" cy="8" r="6" fill="#F79E1B" fillOpacity="0.9" />
        </svg>
        <span aria-hidden="true" className="font-semibold">
          Mastercard
        </span>
      </span>

      {/* Apple Pay */}
      <span
        aria-label="Apple Pay"
        className={cn(
          pillBase,
          "bg-pine-950 border-pine-950 text-white gap-1"
        )}
      >
        <svg
          width={compact ? 9 : 10}
          height={compact ? 11 : 12}
          viewBox="0 0 14 17"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M11.62 9.02c-.02-1.93 1.58-2.86 1.65-2.9-.9-1.31-2.3-1.49-2.8-1.51-1.18-.12-2.32.7-2.92.7-.61 0-1.54-.68-2.53-.66-1.3.02-2.5.76-3.17 1.92-1.36 2.36-.35 5.85.97 7.76.65.94 1.42 1.99 2.43 1.95.98-.04 1.35-.63 2.53-.63 1.18 0 1.52.63 2.54.61 1.05-.02 1.71-.95 2.35-1.89.74-1.08 1.04-2.13 1.06-2.19-.02-.01-2.09-.8-2.11-3.16ZM9.66 3.3c.54-.65.9-1.56.8-2.47-.78.03-1.72.52-2.28 1.17-.5.57-.94 1.49-.82 2.37.87.07 1.76-.44 2.3-1.07Z" />
        </svg>
        <span aria-hidden="true">Pay</span>
      </span>

      {/* Amex (hidden in compact checkout drawer to prevent awkward wrapping) */}
      {!compact && (
        <span
          aria-label="American Express"
          className={cn(
            pillBase,
            "bg-[#2E77BC] border-[#2E77BC] text-white tracking-tight font-extrabold"
          )}
        >
          <span aria-hidden="true">AMEX</span>
        </span>
      )}

      {/* Klarna */}
      <span
        aria-label="Klarna"
        className={cn(
          pillBase,
          "bg-[#FFB3C7] border-[#F79AB3] text-[#0B051D] font-extrabold"
        )}
      >
        <span aria-hidden="true">Klarna.</span>
      </span>

      {/* Stripe Link */}
      <span
        aria-label="Stripe Link"
        className={cn(
          pillBase,
          "bg-white border-pine-900/15 text-pine-950 gap-1"
        )}
      >
        <span
          className="w-2 h-2 rounded-full bg-[#00D66F] inline-block shrink-0"
          aria-hidden="true"
        />
        <span aria-hidden="true">link</span>
      </span>
    </div>
  );
}

export function TrustBadges({
  variant = "product",
  freeShippingUnlocked = true,
  deliveryEta = "8–12 business days",
  guaranteeDays = PRODUCT_CONFIG.guaranteeDays,
  className,
}: TrustBadgesProps) {
  if (variant === "checkout") {
    return (
      <div className={cn("space-y-2.5 pt-1", className)}>
        <div className="grid grid-cols-3 gap-1.5">
          <div className="rounded-xl bg-cream-100/90 border border-pine-900/10 px-1.5 py-2 flex flex-col items-center text-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
            <div className="leading-tight">
              <p className="text-[11px] font-bold text-pine-950">SSL Secure</p>
              <p className="text-[10px] text-pine-700">256-Bit Stripe</p>
            </div>
          </div>

          <div className="rounded-xl bg-cream-100/90 border border-pine-900/10 px-1.5 py-2 flex flex-col items-center text-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
            <div className="leading-tight">
              <p className="text-[11px] font-bold text-pine-950">
                {guaranteeDays}-Day
              </p>
              <p className="text-[10px] text-pine-700">Money-Back</p>
            </div>
          </div>

          <div className="rounded-xl bg-cream-100/90 border border-pine-900/10 px-1.5 py-2 flex flex-col items-center text-center gap-1">
            <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
            <div className="leading-tight">
              <p
                className={cn(
                  "text-[11px] font-bold",
                  freeShippingUnlocked ? "text-emerald-700" : "text-pine-950"
                )}
              >
                {freeShippingUnlocked ? "FREE Shipping" : "Tracked"}
              </p>
              <p className="text-[10px] text-pine-700 truncate max-w-full">
                {freeShippingUnlocked ? "Tracked Parcel" : deliveryEta}
              </p>
            </div>
          </div>
        </div>

        <PaymentBadgeRow compact />
      </div>
    );
  }

  if (variant === "banner") {
    const bannerItems = [
      {
        icon: Lock,
        title: "256-Bit SSL Secure Checkout",
        subtitle: "Encrypted Stripe & Apple Pay",
      },
      {
        icon: ShieldCheck,
        title: `${guaranteeDays}-Day Money-Back Guarantee`,
        subtitle: "Risk-free holiday trial",
      },
      {
        icon: Truck,
        title: freeShippingUnlocked
          ? "FREE Tracked Bundle Shipping"
          : "Free Tracked Bundle Shipping",
        subtitle: `${deliveryEta} with live tracking`,
      },
      {
        icon: Sparkles,
        title: "Kid & Pet Safe Cool Mist",
        subtitle: "Zero flame & auto shut-off",
      },
    ];

    return (
      <section
        aria-label="Storefront trust guarantees"
        className={cn(
          "bg-cream-100 border-y border-pine-900/10 py-6",
          className
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bannerItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-pine-900 text-amberGlow-300 flex items-center justify-center shrink-0 shadow-sm">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-pine-950 leading-snug">
                      {item.title}
                    </p>
                    <p className="text-[11px] sm:text-xs text-pine-700 leading-snug mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Default: "product" variant (for HeroProductBuyBox beneath primary CTA)
  return (
    <div
      className={cn(
        "rounded-2xl bg-cream-100/90 border border-pine-900/10 p-4 space-y-3.5 shadow-sm",
        className
      )}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="rounded-xl bg-white/90 border border-pine-900/10 px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-pine-950 leading-tight">
              Secure Checkout
            </p>
            <p className="text-[11px] text-pine-700 leading-tight mt-0.5">
              256-Bit SSL via Stripe
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white/90 border border-pine-900/10 px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-pine-950 leading-tight">
              {guaranteeDays}-Day Money-Back
            </p>
            <p className="text-[11px] text-pine-700 leading-tight mt-0.5">
              Hassle-Free Guarantee
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white/90 border border-pine-900/10 px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-pine-950 leading-tight">
              Free Tracked Shipping
            </p>
            <p
              className={cn(
                "text-[11px] leading-tight mt-0.5",
                freeShippingUnlocked
                  ? "font-bold text-emerald-700"
                  : "text-pine-700"
              )}
            >
              {freeShippingUnlocked
                ? "FREE on This Bundle"
                : `FREE on 2+ • ${deliveryEta}`}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-pine-900/10 pt-3 space-y-2">
        <PaymentBadgeRow />
        <p className="text-[11px] font-medium text-pine-800 flex items-center justify-center gap-1.5 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
          <span>Guaranteed Safe &amp; Encrypted Checkout</span>
        </p>
      </div>
    </div>
  );
}

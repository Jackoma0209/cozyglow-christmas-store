"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Sparkles, Truck, PackageSearch } from "lucide-react";
import {
  CURRENCIES,
  CurrencyCode,
  PRODUCT_CONFIG,
} from "@/config/product";

interface UrgencyTopBarProps {
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  cartCount: number;
  onOpenCart: () => void;
}

function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

export function UrgencyTopBar({
  currency,
  onCurrencyChange,
  cartCount,
  onOpenCart,
}: UrgencyTopBarProps) {
  const [secondsLeft, setSecondsLeft] = useState(
    PRODUCT_CONFIG.urgencyBar.countdownInitialSeconds
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 4 * 3600 + 18 * 60 + 42));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Urgency Announcement Ribbon */}
      <div className="bg-crimson-700 text-cream-50 px-3 py-2 text-center border-b border-amber-300/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:text-sm font-medium">
          <span className="inline-flex items-center gap-1.5 font-semibold text-amber-200">
            <Truck className="w-3.5 h-3.5 shrink-0" />
            {PRODUCT_CONFIG.urgencyBar.prefix}
          </span>
          <span className="font-mono font-bold bg-pine-950/65 text-amberGlow-300 px-2 py-0.5 rounded border border-amber-300/40 tracking-tight">
            {formatCountdown(secondsLeft)}
          </span>
          <span>{PRODUCT_CONFIG.urgencyBar.suffix}</span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="bg-cream-50/95 backdrop-blur-md border-b border-pine-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-pine-900 text-amberGlow-300 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-pine-950 block leading-none">
                CozyGlow™
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-pine-700">
                Nordic Home Aromatics
              </span>
            </div>
          </Link>

          {/* Anchor Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-pine-800">
            <a href="#benefits" className="hover:text-crimson-700 transition-colors">
              Why Chimney Mist
            </a>
            <a href="#ambiance" className="hover:text-crimson-700 transition-colors">
              Ambiance Modes
            </a>
            <a href="#compare" className="hover:text-crimson-700 transition-colors">
              Compare
            </a>
            <a href="#reviews" className="hover:text-crimson-700 transition-colors">
              Reviews (1,428)
            </a>
            <a href="#faq" className="hover:text-crimson-700 transition-colors">
              FAQ
            </a>
            <Link
              href="/track"
              className="inline-flex items-center gap-1 text-pine-900 font-semibold hover:text-crimson-700 transition-colors"
            >
              <PackageSearch className="w-4 h-4" />
              Track Order
            </Link>
          </nav>

          {/* Right Controls: Multi-Currency Toggle & Checkout Drawer */}
          <div className="flex items-center gap-2.5">
            <div
              className="inline-flex items-center rounded-full bg-cream-200/80 p-1 border border-pine-900/10"
              role="group"
              aria-label="Currency selector"
            >
              {(["gbp", "usd"] as CurrencyCode[]).map((code) => {
                const active = currency === code;
                const meta = CURRENCIES[code];
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onCurrencyChange(code)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                      active
                        ? "bg-pine-900 text-cream-50 shadow-sm"
                        : "text-pine-800 hover:text-pine-950"
                    }`}
                  >
                    {meta.flag} {meta.symbol} {code.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onOpenCart}
              className="relative inline-flex items-center gap-2 rounded-full bg-pine-900 hover:bg-pine-800 text-cream-50 px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all shadow-sm"
              aria-label="Open Checkout Bag"
            >
              <ShoppingBag className="w-4 h-4 text-amberGlow-300" />
              <span className="hidden sm:inline">Checkout</span>
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-crimson-600 text-white text-[11px] font-bold">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

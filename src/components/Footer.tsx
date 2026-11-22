"use client";

import React from "react";
import Link from "next/link";
import { Mail, PackageSearch, ShieldCheck, Sparkles } from "lucide-react";
import { PRODUCT_CONFIG } from "@/config/product";
import { openCookiePreferences } from "@/lib/consent";
import { PolicyType } from "./PolicyModals";

interface FooterProps {
  onOpenPolicy: (policy: Exclude<PolicyType, null>) => void;
}

export function Footer({ onOpenPolicy }: FooterProps) {
  return (
    <footer className="bg-pine-950 text-cream-200 border-t border-white/10 pb-24 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amberGlow-400/15 border border-amberGlow-400/40 text-amberGlow-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
            </div>
            <span className="font-serif text-xl font-bold text-white">
              CozyGlow™ Home Aromatics
            </span>
          </div>
          <p className="text-xs sm:text-sm text-cream-200/75 leading-relaxed max-w-md">
            Crafted to replace hazardous winter paraffin candles and sterile humidifiers with soothing Nordic cottage warmth and whisper-quiet chimney aromatherapy.
          </p>
          <p className="text-xs text-cream-200/80 flex items-center gap-1.5 pt-1">
            <Mail className="w-3.5 h-3.5 text-amberGlow-300" aria-hidden="true" />
            {PRODUCT_CONFIG.supportEmail}
          </p>
        </div>

        {/* Store Navigation */}
        <div className="md:col-span-3 space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-amberGlow-300">
            Customer Care
          </p>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li>
              <Link
                href="/track"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <PackageSearch className="w-3.5 h-3.5" aria-hidden="true" />
                Track Your Order
              </Link>
            </li>
            <li>
              <a href="#faq" className="hover:text-white transition-colors">
                Holiday Shipping FAQ
              </a>
            </li>
            <li>
              <a href="#reviews" className="hover:text-white transition-colors">
                Verified Shopper Reviews
              </a>
            </li>
          </ul>
        </div>

        {/* Legal & Compliance */}
        <div className="md:col-span-4 space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-amberGlow-300">
            Policies &amp; Compliance
          </p>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li>
              <Link
                href="/privacy"
                onClick={(e) => {
                  if (
                    !e.metaKey &&
                    !e.ctrlKey &&
                    !e.shiftKey &&
                    !e.altKey &&
                    e.button === 0
                  ) {
                    e.preventDefault();
                    onOpenPolicy("privacy");
                  }
                }}
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                onClick={(e) => {
                  if (
                    !e.metaKey &&
                    !e.ctrlKey &&
                    !e.shiftKey &&
                    !e.altKey &&
                    e.button === 0
                  ) {
                    e.preventDefault();
                    onOpenPolicy("terms");
                  }
                }}
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="/returns"
                onClick={(e) => {
                  if (
                    !e.metaKey &&
                    !e.ctrlKey &&
                    !e.shiftKey &&
                    !e.altKey &&
                    e.button === 0
                  ) {
                    e.preventDefault();
                    onOpenPolicy("returns");
                  }
                }}
                className="hover:text-white transition-colors"
              >
                Returns &amp; 30-Day Refund Policy
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={openCookiePreferences}
                className="hover:text-white transition-colors"
              >
                Cookie Preferences
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 sm:px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-200/65">
          <p>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> CozyGlow™ Home Aromatics. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            Protected by 256-Bit SSL &amp; 30-Day Money-Back Guarantee
          </p>
        </div>
      </div>
    </footer>
  );
}

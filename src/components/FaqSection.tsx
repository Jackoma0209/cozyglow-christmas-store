"use client";

import React, { useState } from "react";
import { ChevronDown, ShieldCheck, Truck, Sparkles } from "lucide-react";
import {
  CURRENCIES,
  CurrencyCode,
  FAQS,
  PRODUCT_CONFIG,
} from "@/config/product";
import { cn } from "@/lib/utils";

interface FaqSectionProps {
  currency: CurrencyCode;
  onClaimNow: () => void;
}

export function FaqSection({ currency, onClaimNow }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const currencyMeta = CURRENCIES[currency];

  return (
    <section id="faq" className="py-16 lg:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-200 text-pine-900 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            Everything You Need To Know
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-pine-950">
            Frequently Asked Questions &amp; Holiday Guarantee
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-pine-900/15 bg-cream-50 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-pine-950 hover:bg-cream-100/70 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-pine-800 shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-pine-800 leading-relaxed border-t border-pine-900/10 pt-3.5 bg-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 30-Day Money-Back Guarantee & Holiday Dispatch Box */}
        <div className="rounded-3xl bg-gradient-to-br from-pine-900 via-pine-950 to-[#0B1914] text-cream-50 p-6 sm:p-10 border border-amberGlow-400/35 shadow-card-soft flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amberGlow-400/15 border border-amberGlow-400/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8 text-amberGlow-300" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif text-2xl font-bold text-white">
                {PRODUCT_CONFIG.guaranteeDays}-Day &ldquo;Cozy Home&rdquo; Money-Back Guarantee
              </h3>
              <p className="text-sm text-cream-200/85 leading-relaxed">
                Try CozyGlow™ on your mantel or nightstand for a full 30 days. Tracked holiday delivery via{" "}
                <span className="text-amberGlow-300 font-semibold">
                  {currencyMeta.courierLabel}
                </span>{" "}
                ({currencyMeta.deliveryEta}). If you aren&rsquo;t completely enchanted by the chimney mist glow, email{" "}
                <span className="underline">{PRODUCT_CONFIG.supportEmail}</span> for a hassle-free refund.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClaimNow}
            className="w-full lg:w-auto shrink-0 rounded-2xl bg-crimson-700 hover:bg-crimson-600 text-white font-bold px-7 py-4 text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amberGlow-300" />
            <span>Claim My CozyGlow™ Now</span>
            <Truck className="w-4 h-4 text-amberGlow-300" />
          </button>
        </div>
      </div>
    </section>
  );
}

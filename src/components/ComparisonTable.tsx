"use client";

import React from "react";
import { Check, Flame, Sparkles, X } from "lucide-react";
import { COMPARISON_ROWS } from "@/config/product";

export function ComparisonTable() {
  return (
    <section id="compare" className="py-16 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-200 text-pine-900 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-crimson-700" aria-hidden="true" />
            Why Families Upgrade From Candles
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-pine-950">
            CozyGlow™ Cottage vs. Candles &amp; Plain Humidifiers
          </h2>
          <p className="text-pine-800 text-base">
            All the nostalgic fireplace magic of a winter cabin — with zero open flame, zero soot, and 6–8 hours of soothing cool humidity.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-pine-900/15 shadow-card-soft">
          <table className="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr className="border-b border-pine-900/10 bg-cream-100">
                <th className="p-5 text-xs font-bold uppercase tracking-wider text-pine-800 w-[26%]">
                  Feature
                </th>
                <th className="p-5 bg-pine-900 text-cream-50 w-[28%]">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amberGlow-400 text-pine-950">
                      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-serif text-base font-bold leading-tight">
                        CozyGlow™ Cottage
                      </p>
                      <p className="text-[11px] text-amberGlow-300 font-semibold">
                        #1 Trending Winter Diffuser
                      </p>
                    </div>
                  </div>
                </th>
                <th className="p-5 text-sm font-bold text-pine-900 w-[23%]">
                  <span className="inline-flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-crimson-600" aria-hidden="true" />
                    Generic Candles
                  </span>
                </th>
                <th className="p-5 text-sm font-bold text-pine-900 w-[23%]">
                  Plain Plastic Humidifier
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pine-900/10 text-sm">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.feature} className="hover:bg-cream-50/70 transition-colors">
                  <td className="p-5 font-bold text-pine-950">{row.feature}</td>
                  <td className="p-5 bg-pine-900/[0.04] border-x border-pine-900/10 font-semibold text-pine-950">
                    <div className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0"
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                      <span>{row.cozyGlow}</span>
                    </div>
                  </td>
                  <td className="p-5 text-pine-700">
                    <div className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 w-5 h-5 rounded-full bg-red-100 text-crimson-700 flex items-center justify-center shrink-0"
                      >
                        <X className="w-3 h-3 stroke-[3]" />
                      </span>
                      <span>{row.candles}</span>
                    </div>
                  </td>
                  <td className="p-5 text-pine-700">
                    <div className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0"
                      >
                        <X className="w-3 h-3 stroke-[3]" />
                      </span>
                      <span>{row.plainHumidifier}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-pine-700 text-center md:hidden">
          Swipe table left or right to compare all features &rarr;
        </p>
      </div>
    </section>
  );
}

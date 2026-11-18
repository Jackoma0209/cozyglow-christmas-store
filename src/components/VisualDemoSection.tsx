"use client";

import React from "react";
import { AlertTriangle, Droplets, ShieldCheck, Sparkles, VolumeX, Wind } from "lucide-react";

export function VisualDemoSection() {
  return (
    <section id="benefits" className="py-16 lg:py-20 bg-pine-950 text-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amberGlow-400/15 border border-amberGlow-400/35 text-amberGlow-300 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            The 3-Second Winter Transformation
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
            Say Goodbye to Dry Radiator Air &amp; Lifeless Plastic Decor
          </h2>
          <p className="text-cream-200/80 text-base sm:text-lg">
            Central heating strips indoor humidity below 25%, leaving you with dry winter skin and stuffy bedrooms. CozyGlow™ turns essential humidity into a living miniature snow cabin.
          </p>
        </div>

        {/* Contrast Strip: Problem vs Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Problem Card */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-crimson-700/30 border border-crimson-500/40 text-red-200 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                Typical Winter Rooms
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">
                Dry Radiator Heat + Generic Store Trinkets
              </h3>
              <ul className="space-y-3 text-sm text-cream-200/85">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  <span>
                    <strong>Parched Winter Air:</strong> Radiators leave bedrooms dusty and scratchy without moisture replenishment.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  <span>
                    <strong>Candle Fire Anxiety:</strong> Scented paraffin candles leave black soot on mantels and pose hazards around pets and kids.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  <span>
                    <strong>Clinical White Cylinders:</strong> Standard humidifiers look like hospital equipment and clash with holiday decor.
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-black/25 border border-white/10 p-4 text-xs text-cream-200/75">
              Average holiday shopper spends £38+ per season on disposable candles that burn out in 20 hours.
            </div>
          </div>

          {/* Solution Card */}
          <div className="rounded-3xl bg-gradient-to-br from-pine-800 via-pine-900 to-[#0B1914] border-2 border-amberGlow-400/50 p-6 sm:p-8 shadow-warm-glow flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                The CozyGlow™ Standard
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">
                Hypnotic Chimney Mist + 2200K Warm Hearth Glow
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="rounded-2xl bg-pine-950/75 border border-white/15 p-4 space-y-2">
                  <Wind className="w-6 h-6 text-amberGlow-300" />
                  <p className="font-bold text-sm text-white">Real Chimney Plume</p>
                  <p className="text-xs text-cream-200/80 leading-relaxed">
                    Precision duct channels aromatic micro-mist cleanly through the brick chimney.
                  </p>
                </div>

                <div className="rounded-2xl bg-pine-950/75 border border-white/15 p-4 space-y-2">
                  <VolumeX className="w-6 h-6 text-sky-300" />
                  <p className="font-bold text-sm text-white">&lt;25dB Ultrasonic</p>
                  <p className="text-xs text-cream-200/80 leading-relaxed">
                    Quieter than a whisper — humidifies overnight without waking light sleepers.
                  </p>
                </div>

                <div className="rounded-2xl bg-pine-950/75 border border-white/15 p-4 space-y-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <p className="font-bold text-sm text-white">Auto Shut-Off Sensor</p>
                  <p className="text-xs text-cream-200/80 leading-relaxed">
                    Smart probe cuts power automatically when the 200ml tank runs dry.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-amberGlow-400/10 border border-amberGlow-300/30 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-amberGlow-300 shrink-0" />
                <p className="text-xs sm:text-sm font-medium text-cream-50">
                  <strong>200ml Tank:</strong> Fill once for 6–8 hours of continuous cool winter comfort.
                </p>
              </div>
              <a
                href="#buy-box"
                className="shrink-0 rounded-full bg-amberGlow-400 hover:bg-amberGlow-300 text-pine-950 font-bold text-xs px-4 py-2 transition-colors"
              >
                Select Bundle
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

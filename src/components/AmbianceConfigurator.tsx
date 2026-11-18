"use client";

import React, { useState } from "react";
import { Flame, Moon, Sparkles, Wind } from "lucide-react";
import { AMBIANCE_MODES, HOLIDAY_SCENTS } from "@/config/product";
import { CottageVisual } from "./CottageVisual";
import { cn } from "@/lib/utils";

export function AmbianceConfigurator() {
  const [selectedModeId, setSelectedModeId] = useState<
    "fireplace" | "nightlight" | "aromatherapy"
  >("fireplace");
  const [selectedScentId, setSelectedScentId] = useState<string>(
    HOLIDAY_SCENTS[0].id
  );

  const activeMode =
    AMBIANCE_MODES.find((m) => m.id === selectedModeId) ?? AMBIANCE_MODES[0];
  const activeScent =
    HOLIDAY_SCENTS.find((s) => s.id === selectedScentId) ?? HOLIDAY_SCENTS[0];

  const intensity =
    activeMode.id === "nightlight"
      ? "gentle"
      : activeMode.id === "aromatherapy"
      ? "boost"
      : "steady";

  return (
    <section id="ambiance" className="py-16 lg:py-20 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-pine-900 text-amberGlow-300 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Scent &amp; Ambiance Explorer
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-pine-950">
            Preview Your Evening Hearth Atmosphere
          </h2>
          <p className="text-pine-800 text-base sm:text-lg">
            Toggle lighting warmth, chimney mist output, and festive essential oil notes to see how CozyGlow™ transforms your mantel or bedside table.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-white border border-pine-900/15 p-5 sm:p-8 shadow-card-soft">
          {/* Interactive Live Cottage Preview */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border border-pine-900/15 bg-pine-950">
              <CottageVisual
                scene={activeMode.id === "nightlight" ? "night" : "chimney"}
                mistActive
                glowActive
                windowColor={activeMode.windowColor}
                accentHex={activeScent.accentHex}
                intensity={intensity}
              />

              {/* Live Telemetry HUD */}
              <div className="absolute top-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pine-950/85 backdrop-blur-md border border-white/15 px-3 py-1.5 text-xs font-bold text-amberGlow-300">
                  {activeMode.kelvin}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow"
                  style={{ backgroundColor: activeScent.accentHex }}
                >
                  Scent: {activeScent.name}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-30 rounded-2xl bg-pine-950/85 backdrop-blur-md border border-white/15 px-4 py-3 text-cream-50 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-amberGlow-300">
                    {activeMode.name}
                  </p>
                  <p className="text-xs text-cream-200/90">
                    {activeMode.mistRate} • {activeMode.noiseLevel}
                  </p>
                </div>
                <span className="text-[11px] font-semibold bg-white/10 px-2.5 py-1 rounded-full">
                  Mood: {activeScent.mood}
                </span>
              </div>
            </div>
          </div>

          {/* Right Controls: Mode Switcher + 6 Scents */}
          <div className="lg:col-span-6 space-y-6">
            {/* Step 1: Lighting & Mist Modes */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-pine-800">
                1. Choose Lighting &amp; Mist Mode
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {AMBIANCE_MODES.map((mode) => {
                  const isActive = mode.id === selectedModeId;
                  const Icon =
                    mode.id === "fireplace"
                      ? Flame
                      : mode.id === "nightlight"
                      ? Moon
                      : Wind;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSelectedModeId(mode.id)}
                      className={cn(
                        "rounded-2xl border-2 p-3.5 text-left transition-all",
                        isActive
                          ? "border-pine-900 bg-cream-100 shadow-sm"
                          : "border-pine-900/10 bg-white hover:border-pine-900/30"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5 mb-2",
                          isActive ? "text-crimson-700" : "text-pine-700"
                        )}
                      />
                      <p className="text-xs font-bold text-pine-950 leading-snug">
                        {mode.shortName}
                      </p>
                      <p className="text-[11px] text-pine-700 mt-0.5">
                        {mode.kelvin}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl bg-cream-50 border border-pine-900/10 p-4 text-sm text-pine-800 leading-relaxed">
                {activeMode.description}
              </div>
            </div>

            {/* Step 2: 6 Holiday Scents */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-pine-800">
                  2. Pair With Collector Holiday Scents
                </p>
                <span className="text-xs font-semibold text-emerald-700">
                  Included Free in 3x Village Bundle
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {HOLIDAY_SCENTS.map((scent) => {
                  const active = scent.id === selectedScentId;
                  return (
                    <button
                      key={scent.id}
                      type="button"
                      onClick={() => setSelectedScentId(scent.id)}
                      className={cn(
                        "rounded-2xl border p-3 text-left transition-all",
                        active
                          ? "border-pine-900 bg-pine-900 text-white shadow"
                          : "border-pine-900/15 bg-white hover:border-pine-900/35 text-pine-950"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: scent.accentHex }}
                        />
                        <span className="text-xs font-bold truncate">
                          {scent.name}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-[11px] mt-1 line-clamp-1",
                          active ? "text-cream-200/85" : "text-pine-700"
                        )}
                      >
                        {scent.mood}
                      </p>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-pine-700 font-medium">
                <strong>Tasting Notes ({activeScent.name}):</strong>{" "}
                {activeScent.notes}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

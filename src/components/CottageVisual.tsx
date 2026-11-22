"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CottageVisualProps {
  scene?: "chimney" | "night" | "cutaway" | "mantel" | "giftbox";
  mistActive?: boolean;
  glowActive?: boolean;
  windowColor?: string;
  accentHex?: string;
  intensity?: "gentle" | "steady" | "boost";
  className?: string;
}

export function CottageVisual({
  scene = "chimney",
  mistActive = true,
  glowActive = true,
  windowColor = "#FBBF24",
  accentHex = "#F59E0B",
  intensity = "steady",
  className,
}: CottageVisualProps) {
  const isNight = scene === "night" || scene === "chimney";
  const isCutaway = scene === "cutaway";
  const isMantel = scene === "mantel";
  const isGiftbox = scene === "giftbox";

  const steamBlur =
    intensity === "boost"
      ? "opacity-95 scale-110"
      : intensity === "gentle"
      ? "opacity-65 scale-90"
      : "opacity-85";

  return (
    <div
      className={cn(
        "relative isolate z-0 w-full h-full overflow-hidden rounded-2xl select-none flex items-center justify-center",
        isNight
          ? "bg-gradient-to-b from-[#071310] via-[#0F261E] to-[#193B2F]"
          : isCutaway
          ? "bg-gradient-to-b from-[#132922] via-[#1B3A30] to-[#0D1E18]"
          : isMantel
          ? "bg-gradient-to-b from-[#231915] via-[#312119] to-[#171210]"
          : "bg-gradient-to-b from-[#1A0D10] via-[#2B1218] to-[#121E19]",
        className
      )}
    >
      {/* Ambient radial fireplace aura */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-700"
        style={{
          background: glowActive
            ? `radial-gradient(circle at 50% 62%, ${windowColor}36 0%, ${accentHex}18 34%, transparent 72%)`
            : "none",
        }}
      />

      {/* Subtle falling snow particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { left: "12%", delay: "0s", dur: "7.5s", size: "w-1.5 h-1.5" },
          { left: "26%", delay: "1.6s", dur: "6.4s", size: "w-1 h-1" },
          { left: "39%", delay: "3.1s", dur: "8.2s", size: "w-1.5 h-1.5" },
          { left: "64%", delay: "0.9s", dur: "6.9s", size: "w-1 h-1" },
          { left: "78%", delay: "2.4s", dur: "7.8s", size: "w-1.5 h-1.5" },
          { left: "89%", delay: "4.2s", dur: "6.8s", size: "w-1 h-1" },
        ].map((flake, idx) => (
          <span
            key={idx}
            className={cn(
              "absolute top-0 rounded-full bg-white/75 animate-snowfall",
              flake.size
            )}
            style={{
              left: flake.left,
              animationDelay: flake.delay,
              animationDuration: flake.dur,
            }}
          />
        ))}
      </div>

      {/* Pure-CSS Chimney Steam Plumes */}
      {mistActive && !isGiftbox && (
        <div
          className={cn(
            "pointer-events-none absolute z-20 transition-all duration-500",
            isMantel
              ? "top-[18%] left-[37%]"
              : isCutaway
              ? "top-[10%] left-[60%]"
              : "top-[12%] left-[61%]",
            steamBlur
          )}
          aria-hidden="true"
        >
          <div className="relative w-16 h-28">
            <span className="absolute bottom-0 left-3 w-7 h-7 rounded-full bg-white/70 blur-[5px] animate-chimney-steam-1" />
            <span className="absolute bottom-1 left-2 w-9 h-9 rounded-full bg-cream-100/65 blur-[7px] animate-chimney-steam-2" />
            <span className="absolute bottom-0 left-4 w-10 h-10 rounded-full bg-white/55 blur-[9px] animate-chimney-steam-3" />
          </div>
        </div>
      )}

      {/* Scene-specific SVG / CSS Artwork */}
      {isGiftbox ? (
        <div className="relative z-10 flex flex-col items-center justify-center p-6">
          {/* Keepsake Gift Box Visual */}
          <div className="relative w-64 h-56 flex flex-col items-center justify-end">
            {/* Lid hovering slightly */}
            <div className="w-60 h-11 rounded-xl bg-gradient-to-r from-[#991B1B] via-[#B91C1C] to-[#991B1B] border border-amber-300/60 shadow-lg flex items-center justify-center mb-2 animate-subtle-float">
              <div className="w-9 h-full bg-gradient-to-b from-amber-300 to-amber-500 shadow-inner" />
              <div className="absolute -top-4 flex items-center justify-center gap-1">
                <span className="w-7 h-5 rounded-full border-4 border-amber-300 rotate-[-22deg] bg-amber-400/20" />
                <span className="w-7 h-5 rounded-full border-4 border-amber-300 rotate-[22deg] bg-amber-400/20" />
              </div>
            </div>
            {/* Box Body */}
            <div className="relative w-56 h-36 rounded-2xl bg-gradient-to-b from-[#FFFDF8] to-[#F3E6CE] border-2 border-amber-400/50 shadow-2xl flex flex-col items-center justify-center px-5 text-center overflow-hidden">
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-b from-[#B91C1C] to-[#7F1D1D] opacity-90" />
              <div className="relative z-10 bg-cream-50/95 border border-amber-400/60 rounded-xl px-4 py-2.5 shadow-md">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-crimson-700">
                  Nordic Edition
                </p>
                <p className="font-serif text-lg font-bold text-pine-950">
                  CozyGlow™
                </p>
                <p className="text-[11px] text-pine-700 font-medium">
                  Cordless Cottage Diffuser
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <svg
          viewBox="0 0 420 320"
          className="relative z-10 w-full max-w-[390px] h-auto drop-shadow-[0_24px_30px_rgba(0,0,0,0.55)]"
          role="img"
          aria-label="CozyGlow Nordic Christmas Cottage Diffuser illustration"
        >
          <defs>
            <linearGradient id="snowRoofGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="timberWallGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBF6EC" />
              <stop offset="100%" stopColor="#E6D8C3" />
            </linearGradient>
            <linearGradient id="cutawayWaterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.85" />
            </linearGradient>
            <filter id="warmGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ground snow base / Mantel shelf */}
          <ellipse
            cx="210"
            cy="282"
            rx="168"
            ry="20"
            fill={isMantel ? "#4A2E1E" : "#E2E8F0"}
            opacity="0.92"
          />
          <ellipse cx="210" cy="276" rx="154" ry="14" fill="#F8FAFC" />

          {/* Small Pine Trees flanking cottage */}
          <g transform="translate(52, 184)">
            <polygon points="24,0 0,48 48,48" fill="#14532D" />
            <polygon points="24,18 -4,68 52,68" fill="#166534" />
            <polygon points="24,0 13,22 35,22" fill="#F8FAFC" opacity="0.88" />
            <rect x="20" y="68" width="8" height="16" rx="2" fill="#78350F" />
          </g>

          <g transform="translate(320, 194)">
            <polygon points="22,0 0,42 44,42" fill="#14532D" />
            <polygon points="22,16 -4,60 48,60" fill="#166534" />
            <polygon points="22,0 12,18 32,18" fill="#F8FAFC" opacity="0.88" />
            <rect x="18" y="60" width="8" height="14" rx="2" fill="#78350F" />
          </g>

          {/* Mantel secondary mini cottage when scene === 'mantel' */}
          {isMantel && (
            <g transform="translate(274, 178) scale(0.45)" opacity="0.92">
              <rect x="40" y="70" width="120" height="90" rx="8" fill="#F7ECD8" />
              <polygon points="25,75 100,15 175,75" fill="#991B1B" />
              <polygon points="22,76 100,12 178,76 168,84 100,26 32,84" fill="#FFFFFF" />
              <rect
                x="78"
                y="94"
                width="44"
                height="42"
                rx="6"
                fill={glowActive ? windowColor : "#475569"}
              />
            </g>
          )}

          {/* Brick Chimney */}
          <g>
            <rect
              x="252"
              y="56"
              width="36"
              height="68"
              rx="4"
              fill="#991B1B"
              stroke="#7F1D1D"
              strokeWidth="2"
            />
            <rect x="247" y="52" width="46" height="12" rx="4" fill="#B91C1C" />
            {/* Snow cap on chimney rim */}
            <path
              d="M245,54 C252,46 286,46 294,54 C294,59 286,61 278,59 C272,63 263,62 257,59 C250,61 245,58 245,54 Z"
              fill="#FFFFFF"
            />
          </g>

          {/* Cottage Main Body */}
          <rect
            x="114"
            y="148"
            width="192"
            height="126"
            rx="10"
            fill="url(#timberWallGrad)"
            stroke="#C7B299"
            strokeWidth="2"
          />

          {/* Decorative Nordic Timber Beams */}
          <rect x="114" y="148" width="192" height="10" fill="#78350F" opacity="0.82" />
          <rect x="114" y="264" width="192" height="10" rx="3" fill="#5C2D16" />

          {/* Cutaway 200ml Water Reservoir Overlay */}
          {isCutaway ? (
            <g>
              <rect
                x="128"
                y="164"
                width="164"
                height="94"
                rx="8"
                fill="#0F172A"
                fillOpacity="0.72"
                stroke="#38BDF8"
                strokeWidth="2"
                strokeDasharray="5 4"
              />
              {/* 200ml water fill level */}
              <rect
                x="132"
                y="196"
                width="156"
                height="58"
                rx="6"
                fill="url(#cutawayWaterGrad)"
              />
              {/* Ultrasonic Mist Disc */}
              <ellipse cx="210" cy="246" rx="22" ry="5" fill="#E0F2FE" />
              <line
                x1="210"
                y1="242"
                x2="268"
                y2="120"
                stroke="#BAE6FD"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                opacity="0.85"
              />
              <text
                x="210"
                y="186"
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="12"
                fontWeight="700"
              >
                200ml Tank • +3 Oil Drops
              </text>
              <text
                x="210"
                y="228"
                textAnchor="middle"
                fill="#E0F2FE"
                fontSize="11"
                fontWeight="600"
              >
                2.4MHz Ultrasonic Atomizer
              </text>
            </g>
          ) : (
            <>
              {/* Left Glowing Frosted Window */}
              <g className={glowActive ? "animate-window-glow" : ""}>
                <rect
                  x="134"
                  y="176"
                  width="46"
                  height="52"
                  rx="6"
                  fill={glowActive ? windowColor : "#475569"}
                  stroke="#5C2D16"
                  strokeWidth="4"
                  filter={glowActive ? "url(#warmGlowFilter)" : undefined}
                />
                <line x1="157" y1="176" x2="157" y2="228" stroke="#5C2D16" strokeWidth="3" />
                <line x1="134" y1="202" x2="180" y2="202" stroke="#5C2D16" strokeWidth="3" />
                {/* Snow sill */}
                <rect x="130" y="226" width="54" height="7" rx="3.5" fill="#FFFFFF" />
              </g>

              {/* Center Arched Timber Door with Christmas Wreath */}
              <g>
                <path
                  d="M192,264 L192,204 C192,191 228,191 228,204 L228,264 Z"
                  fill="#7C2D12"
                  stroke="#451A03"
                  strokeWidth="3"
                />
                {/* Wreath */}
                <circle
                  cx="210"
                  cy="218"
                  r="10"
                  fill="none"
                  stroke="#15803D"
                  strokeWidth="5"
                />
                <circle cx="210" cy="227" r="3" fill="#DC2626" />
                <circle cx="222" cy="236" r="2.2" fill="#FBBF24" />
              </g>

              {/* Right Glowing Frosted Window */}
              <g className={glowActive ? "animate-window-glow" : ""}>
                <rect
                  x="240"
                  y="176"
                  width="46"
                  height="52"
                  rx="6"
                  fill={glowActive ? windowColor : "#475569"}
                  stroke="#5C2D16"
                  strokeWidth="4"
                  filter={glowActive ? "url(#warmGlowFilter)" : undefined}
                />
                <line x1="263" y1="176" x2="263" y2="228" stroke="#5C2D16" strokeWidth="3" />
                <line x1="240" y1="202" x2="286" y2="202" stroke="#5C2D16" strokeWidth="3" />
                <rect x="236" y="226" width="54" height="7" rx="3.5" fill="#FFFFFF" />
              </g>
            </>
          )}

          {/* Steep Nordic Roof */}
          <g transform={isCutaway ? "translate(0, -14)" : ""}>
            <polygon points="94,154 210,64 326,154" fill="#991B1B" />
            {/* Snowy Roof Blanket */}
            <path
              d="M84,154 L210,56 L336,154 C336,162 323,166 312,158 C302,165 289,163 279,156 L210,100 L141,156 C131,163 118,165 108,158 C97,166 84,162 84,154 Z"
              fill="url(#snowRoofGrad)"
            />
            {/* Attic circular window */}
            <circle
              cx="210"
              cy="118"
              r="14"
              fill={glowActive ? windowColor : "#475569"}
              stroke="#5C2D16"
              strokeWidth="3.5"
              className={glowActive ? "animate-window-glow" : ""}
            />
            <line x1="210" y1="104" x2="210" y2="132" stroke="#5C2D16" strokeWidth="2.5" />
            <line x1="196" y1="118" x2="224" y2="118" stroke="#5C2D16" strokeWidth="2.5" />
          </g>

          {/* Subtle Power Indicator Dot at Cottage Base */}
          <circle cx="292" cy="269" r="3" fill={glowActive ? "#34D399" : "#64748B"} />
        </svg>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import {
  OPEN_COOKIE_PREFERENCES_EVENT,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/consent";

export function CookieConsentBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasExistingChoice, setHasExistingChoice] = useState(false);

  useEffect(() => {
    const saved = readCookieConsent();
    if (saved === null) {
      setHasExistingChoice(false);
      setIsOpen(true);
    } else {
      setHasExistingChoice(true);
    }

    const handleOpenPreferences = () => {
      setHasExistingChoice(readCookieConsent() !== null);
      setIsOpen(true);
    };

    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handleOpenPreferences);
    return () => {
      window.removeEventListener(
        OPEN_COOKIE_PREFERENCES_EVENT,
        handleOpenPreferences
      );
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !hasExistingChoice) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasExistingChoice]);

  const handleChoice = (choice: "accepted" | "rejected") => {
    writeCookieConsent(choice);
    setHasExistingChoice(true);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <aside
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 rounded-2xl bg-pine-950/95 backdrop-blur-md text-cream-50 border border-amberGlow-400/35 shadow-2xl p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amberGlow-400/15 border border-amberGlow-400/35 text-amberGlow-300 flex items-center justify-center shrink-0">
            <Cookie className="w-4 h-4" aria-hidden="true" />
          </div>
          <h2 className="font-serif text-base font-bold text-white leading-tight">
            Cookie &amp; Privacy Preferences
          </h2>
        </div>

        {hasExistingChoice && (
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close cookie preferences"
            className="p-1.5 rounded-full text-cream-200/80 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <p className="text-xs text-cream-200/85 leading-relaxed mt-2.5">
        We use strictly necessary storage for Stripe Checkout, currency selection, and your shopping bag. With your permission, we also use optional analytics &amp; marketing cookies (Meta, TikTok, GA4) to measure ad performance. Read our{" "}
        <Link
          href="/privacy"
          className="text-amberGlow-300 underline underline-offset-2 hover:text-amberGlow-400 font-semibold"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <div className="grid grid-cols-2 gap-2.5 mt-4">
        <button
          type="button"
          onClick={() => handleChoice("rejected")}
          className="rounded-xl border border-white/25 bg-white/10 hover:bg-white/15 text-cream-50 font-bold text-xs px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amberGlow-400"
        >
          Essential Only
        </button>
        <button
          type="button"
          onClick={() => handleChoice("accepted")}
          className="rounded-xl bg-amberGlow-400 hover:bg-amberGlow-300 text-pine-950 font-extrabold text-xs px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Accept All
        </button>
      </div>
    </aside>
  );
}

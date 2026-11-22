"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  BUNDLE_TIERS,
  BundleTier,
  CURRENCIES,
  CurrencyCode,
  PRODUCT_CONFIG,
  getBundlePricing,
  getOrderBumpPrice,
} from "@/config/product";
import { trackAddToCart } from "@/lib/analytics";
import {
  currencyFromTimezone,
  persistCurrencyPreference,
  readClientCurrencyPreference,
} from "@/lib/currency";
import { UrgencyTopBar } from "@/components/UrgencyTopBar";
import { HeroProductBuyBox } from "@/components/HeroProductBuyBox";
import { TrustBadges } from "@/components/TrustBadges";
import { VisualDemoSection } from "@/components/VisualDemoSection";
import { AmbianceConfigurator } from "@/components/AmbianceConfigurator";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ReviewsGrid } from "@/components/ReviewsGrid";
import { FaqSection } from "@/components/FaqSection";
import { NewsletterCapture } from "@/components/NewsletterCapture";
import { Footer } from "@/components/Footer";
import { StickyBuyBar } from "@/components/StickyBuyBar";
import type { PolicyType } from "@/components/PolicyModals";

const CheckoutDrawer = dynamic(
  () =>
    import("@/components/CheckoutDrawer").then((mod) => mod.CheckoutDrawer),
  { ssr: false }
);

const PolicyModals = dynamic(
  () => import("@/components/PolicyModals").then((mod) => mod.PolicyModals),
  { ssr: false }
);

interface StorefrontClientProps {
  initialCurrency: CurrencyCode;
  hasServerGeo: boolean;
}

export function StorefrontClient({
  initialCurrency,
  hasServerGeo,
}: StorefrontClientProps) {
  const [currency, setCurrency] = useState<CurrencyCode>(initialCurrency);
  const [selectedBundleId, setSelectedBundleId] =
    useState<BundleTier["id"]>("double");
  const [includeOrderBump, setIncludeOrderBump] = useState<boolean>(false);
  const [hasAddedToBag, setHasAddedToBag] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);

  useEffect(() => {
    // Only auto-detect via browser timezone when server geo/cookie wasn't available (e.g. localhost)
    if (hasServerGeo || readClientCurrencyPreference() !== null) {
      return;
    }
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const detected = currencyFromTimezone(timeZone);
      if (detected) {
        setCurrency(detected);
      }
    } catch {
      // Ignore environments without Intl timezone support
    }
  }, [hasServerGeo]);

  const handleCurrencyChange = (nextCurrency: CurrencyCode) => {
    setCurrency(nextCurrency);
    persistCurrencyPreference(nextCurrency);
  };

  const selectedItemCount =
    (selectedBundleId === "single" ? 1 : selectedBundleId === "double" ? 2 : 3) +
    (includeOrderBump ? 1 : 0);

  const openCheckoutWithTracking = () => {
    const activeBundle =
      BUNDLE_TIERS.find((b) => b.id === selectedBundleId) ?? BUNDLE_TIERS[1];
    const bundlePricing = getBundlePricing(activeBundle, currency);
    const bumpPricing = getOrderBumpPrice(currency);
    setHasAddedToBag(true);
    trackAddToCart({
      value: bundlePricing.price + (includeOrderBump ? bumpPricing.price : 0),
      currency,
      bundleId: selectedBundleId,
      itemCount: selectedItemCount,
    });
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-pine-900">
      <UrgencyTopBar
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        cartCount={hasAddedToBag ? selectedItemCount : 0}
        onOpenCart={openCheckoutWithTracking}
      />

      <main className="flex-1">
        <HeroProductBuyBox
          currency={currency}
          selectedBundleId={selectedBundleId}
          onSelectBundle={setSelectedBundleId}
          includeOrderBump={includeOrderBump}
          onToggleOrderBump={setIncludeOrderBump}
          onClaimNow={openCheckoutWithTracking}
        />

        <TrustBadges
          variant="banner"
          freeShippingUnlocked={selectedBundleId !== "single"}
          deliveryEta={CURRENCIES[currency].deliveryEta}
          guaranteeDays={PRODUCT_CONFIG.guaranteeDays}
        />

        <VisualDemoSection />

        <AmbianceConfigurator />

        <ComparisonTable />

        <ReviewsGrid />

        <FaqSection
          currency={currency}
          onClaimNow={openCheckoutWithTracking}
        />

        <NewsletterCapture />
      </main>

      <Footer onOpenPolicy={(policy) => setActivePolicy(policy)} />

      <StickyBuyBar
        currency={currency}
        selectedBundleId={selectedBundleId}
        onSelectBundle={setSelectedBundleId}
        includeOrderBump={includeOrderBump}
        onClaimNow={openCheckoutWithTracking}
      />

      {isCheckoutOpen && (
        <CheckoutDrawer
          open={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
          selectedBundleId={selectedBundleId}
          onSelectBundle={setSelectedBundleId}
          includeOrderBump={includeOrderBump}
          onToggleOrderBump={setIncludeOrderBump}
        />
      )}

      {activePolicy !== null && (
        <PolicyModals
          activePolicy={activePolicy}
          onClose={() => setActivePolicy(null)}
        />
      )}
    </div>
  );
}

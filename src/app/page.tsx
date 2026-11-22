"use client";

import React, { useState } from "react";
import {
  BUNDLE_TIERS,
  BundleTier,
  CurrencyCode,
  getBundlePricing,
  getOrderBumpPrice,
} from "@/config/product";
import { trackAddToCart } from "@/lib/analytics";
import { UrgencyTopBar } from "@/components/UrgencyTopBar";
import { HeroProductBuyBox } from "@/components/HeroProductBuyBox";
import { VisualDemoSection } from "@/components/VisualDemoSection";
import { AmbianceConfigurator } from "@/components/AmbianceConfigurator";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ReviewsGrid } from "@/components/ReviewsGrid";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { StickyBuyBar } from "@/components/StickyBuyBar";
import { CheckoutDrawer } from "@/components/CheckoutDrawer";
import { PolicyModals, PolicyType } from "@/components/PolicyModals";

export default function StorefrontPage() {
  const [currency, setCurrency] = useState<CurrencyCode>("gbp");
  const [selectedBundleId, setSelectedBundleId] =
    useState<BundleTier["id"]>("double");
  const [includeOrderBump, setIncludeOrderBump] = useState<boolean>(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);

  const itemCount =
    (selectedBundleId === "single" ? 1 : selectedBundleId === "double" ? 2 : 3) +
    (includeOrderBump ? 1 : 0);

  const openCheckoutWithTracking = () => {
    const activeBundle =
      BUNDLE_TIERS.find((b) => b.id === selectedBundleId) ?? BUNDLE_TIERS[1];
    const bundlePricing = getBundlePricing(activeBundle, currency);
    const bumpPricing = getOrderBumpPrice(currency);
    trackAddToCart({
      value: bundlePricing.price + (includeOrderBump ? bumpPricing.price : 0),
      currency,
      bundleId: selectedBundleId,
      itemCount,
    });
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-pine-900">
      <UrgencyTopBar
        currency={currency}
        onCurrencyChange={setCurrency}
        cartCount={itemCount}
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

        <VisualDemoSection />

        <AmbianceConfigurator />

        <ComparisonTable />

        <ReviewsGrid />

        <FaqSection
          currency={currency}
          onClaimNow={openCheckoutWithTracking}
        />
      </main>

      <Footer onOpenPolicy={(policy) => setActivePolicy(policy)} />

      <StickyBuyBar
        currency={currency}
        selectedBundleId={selectedBundleId}
        onSelectBundle={setSelectedBundleId}
        includeOrderBump={includeOrderBump}
        onClaimNow={openCheckoutWithTracking}
      />

      <CheckoutDrawer
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        currency={currency}
        onCurrencyChange={setCurrency}
        selectedBundleId={selectedBundleId}
        onSelectBundle={setSelectedBundleId}
        includeOrderBump={includeOrderBump}
        onToggleOrderBump={setIncludeOrderBump}
      />

      <PolicyModals
        activePolicy={activePolicy}
        onClose={() => setActivePolicy(null)}
      />
    </div>
  );
}

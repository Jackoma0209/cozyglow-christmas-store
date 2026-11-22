"use client";

import React from "react";
import { X, ShieldCheck } from "lucide-react";
import { PRODUCT_CONFIG } from "@/config/product";

export type PolicyType = "privacy" | "terms" | "returns" | null;

interface PolicyModalsProps {
  activePolicy: PolicyType;
  onClose: () => void;
}

const POLICY_CONTENT: Record<
  Exclude<PolicyType, null>,
  { title: string; updated: string; sections: { heading: string; text: string }[] }
> = {
  privacy: {
    title: "Privacy Policy",
    updated: "November 2026",
    sections: [
      {
        heading: "1. Information We Collect",
        text: `When you browse or place an order with ${PRODUCT_CONFIG.brandName}, we collect only the details needed to fulfill your holiday delivery: name, shipping address, email address, phone number for courier SMS alerts, and encrypted payment confirmation processed by Stripe.`,
      },
      {
        heading: "2. Payment Security",
        text: "We never store raw card numbers on our servers. All transactions are processed over PCI-DSS Level 1 compliant TLS encryption via Stripe Checkout, Apple Pay, Link, and Klarna.",
      },
      {
        heading: "3. Cookies & Preferences",
        text: "Essential session storage remembers your selected bundle tier, currency preference (GBP or USD), and cart items. For privacy requests, contact our compliance desk at " + PRODUCT_CONFIG.supportEmail + ".",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    updated: "November 2026",
    sections: [
      {
        heading: "1. Seasonal Dispatch & Fulfillment",
        text: "Orders placed prior to our daily warehouse cutoff ship within 24 hours via Royal Mail Tracked 48® / DPD Express (UK) or USPS Priority / FedEx Tracked (US). Standard tracked transit takes 5–7 business days.",
      },
      {
        heading: "2. Product Usage & Safety",
        text: "CozyGlow™ Nordic Christmas Cottage Diffusers are designed for 5V/1A USB-C operation with clean tap or filtered water and water-soluble essential oils. Always place on a flat, stable surface.",
      },
      {
        heading: "3. Pricing & Bundles",
        text: "Promotional bundle savings (up to 56% off) and bonus Essential Oil Sets apply automatically while current UK/US Express Warehouse inventory lasts.",
      },
    ],
  },
  returns: {
    title: "Returns & 30-Day Money-Back Guarantee",
    updated: "November 2026",
    sections: [
      {
        heading: "1. 30-Day Holiday Trial",
        text: "If your CozyGlow™ Cottage doesn't transform your winter evenings, you have 30 full calendar days from the delivery date to request a return or free replacement.",
      },
      {
        heading: "2. Damaged or Defective Arrivals",
        text: `Should a unit arrive damaged in transit, email a quick photo and your #CG order reference to ${PRODUCT_CONFIG.supportEmail}. We dispatch a brand-new replacement immediately at zero cost to you.`,
      },
      {
        heading: "3. Fast Refund Turnaround",
        text: "Approved refunds are credited back to your original payment method (card, Apple Pay, Link, or Klarna) within 3–5 business days.",
      },
    ],
  },
};

export function PolicyModals({ activePolicy, onClose }: PolicyModalsProps) {
  if (!activePolicy) return null;

  const doc = POLICY_CONTENT[activePolicy];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={doc.title}
    >
      <div className="w-full max-w-xl rounded-3xl bg-cream-50 border border-pine-900/15 shadow-2xl overflow-hidden">
        <div className="p-5 bg-pine-950 text-cream-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amberGlow-300" />
            <div>
              <h2 className="font-serif text-lg font-bold leading-tight">
                {doc.title}
              </h2>
              <p className="text-[11px] text-cream-200/75">
                Last updated: {doc.updated} • {PRODUCT_CONFIG.brandName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
          {doc.sections.map((section) => (
            <div key={section.heading} className="space-y-1.5">
              <h3 className="font-bold text-sm text-pine-950">
                {section.heading}
              </h3>
              <p className="text-sm text-pine-800 leading-relaxed">
                {section.text}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-pine-900/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-pine-900 hover:bg-pine-800 text-cream-50 text-sm font-bold px-5 py-2.5 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

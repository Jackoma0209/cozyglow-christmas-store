import { PRODUCT_CONFIG } from "@/config/product";

export type PolicyKey = "privacy" | "terms" | "returns";

export interface PolicySection {
  heading: string;
  text: string;
}

export interface PolicyDocument {
  slug: string;
  title: string;
  metaDescription: string;
  updated: string;
  sections: PolicySection[];
}

export const POLICY_DOCUMENTS: Record<PolicyKey, PolicyDocument> = {
  privacy: {
    slug: "/privacy",
    title: "Privacy & Cookie Policy",
    metaDescription: `How ${PRODUCT_CONFIG.brandName} collects, protects, and uses personal data across orders, Resend emails, and optional analytics cookies on cozyglowhome.com.`,
    updated: "November 2026",
    sections: [
      {
        heading: "1. Information We Collect",
        text: `When you place an order or join the CozyGlow™ Holiday Club on cozyglowhome.com, we collect only the details required to fulfill your request: your name, shipping address, email address, phone number for courier delivery alerts, or the optional first name and email submitted through our newsletter capture form.`,
      },
      {
        heading: "2. Payment Security",
        text: "We never store raw card numbers on our servers. All transactions are processed over PCI-DSS Level 1 compliant TLS encryption via Stripe Checkout, Apple Pay, Link, and Klarna.",
      },
      {
        heading: "3. Email Communications & Newsletter (Resend)",
        text: `Order confirmations and dispatch updates are sent via Resend from orders@cozyglowhome.com. If you subscribe to our Holiday Club newsletter, your welcome code and seasonal scent recipes are sent from hello@cozyglowhome.com (with optional subscriber storage in Resend Audiences). You can unsubscribe anytime by replying to any marketing email or writing to ${PRODUCT_CONFIG.supportEmail}.`,
      },
      {
        heading: "4. Cookies, Analytics & Consent",
        text: "We use strictly necessary browser storage for Stripe Checkout, currency preference (GBP or USD), and your shopping bag. Optional marketing and analytics pixels (Meta Pixel, TikTok Pixel, and Google Analytics 4) remain disabled unless you select \"Accept All\" in our UK GDPR / PECR cookie banner. You can change or withdraw your cookie preference at any time via \"Cookie Preferences\" in the site footer.",
      },
      {
        heading: "5. Your UK & EU Data Rights",
        text: `Under UK GDPR and EU data protection law, you have the right to request access to, correction of, or deletion of your personal data, and to withdraw marketing or cookie consent at any time. Email ${PRODUCT_CONFIG.supportEmail} and our concierge team will respond promptly.`,
      },
    ],
  },
  terms: {
    slug: "/terms",
    title: "Terms of Service",
    metaDescription: `Terms of Service for ${PRODUCT_CONFIG.brandName} covering seasonal dispatch, safe usage, and bundle pricing on cozyglowhome.com.`,
    updated: "November 2026",
    sections: [
      {
        heading: "1. Seasonal Dispatch & Fulfillment",
        text: "Orders ship with full online tracking and typically arrive in 8–12 business days via Royal Mail / Evri Tracked (UK) or USPS / Tracked Holiday Courier (US).",
      },
      {
        heading: "2. Product Usage & Safety",
        text: "CozyGlow™ Nordic Christmas Cottage Diffusers are cordless and require 3× AAA batteries (not included), operated with clean water and optional water-soluble essential oils. Always place on a flat, stable surface.",
      },
      {
        heading: "3. Pricing & Bundles",
        text: "Promotional bundle savings (up to 56% off) apply automatically while current holiday batch inventory lasts.",
      },
    ],
  },
  returns: {
    slug: "/returns",
    title: "Returns & 30-Day Money-Back Guarantee",
    metaDescription: `${PRODUCT_CONFIG.brandName} 30-day return policy, damaged arrival replacements, and refund timelines.`,
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

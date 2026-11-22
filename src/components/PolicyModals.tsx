"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, ShieldCheck } from "lucide-react";
import { POLICY_DOCUMENTS, PolicyKey } from "@/config/policies";
import { PRODUCT_CONFIG } from "@/config/product";

export type PolicyType = PolicyKey | null;

interface PolicyModalsProps {
  activePolicy: PolicyType;
  onClose: () => void;
}

export function PolicyModals({ activePolicy, onClose }: PolicyModalsProps) {
  useEffect(() => {
    if (!activePolicy) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePolicy, onClose]);

  if (!activePolicy) return null;

  const doc = POLICY_DOCUMENTS[activePolicy];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={doc.title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-3xl bg-cream-50 border border-pine-900/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-pine-950 text-cream-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amberGlow-300" aria-hidden="true" />
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
            <X className="w-5 h-5" aria-hidden="true" />
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

        <div className="p-4 bg-white border-t border-pine-900/10 flex items-center justify-between gap-3">
          <Link
            href={doc.slug}
            onClick={onClose}
            className="text-xs font-semibold text-pine-700 hover:text-crimson-700 underline underline-offset-2 transition-colors"
          >
            Open full page
          </Link>
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

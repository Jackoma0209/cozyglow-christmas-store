import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { POLICY_DOCUMENTS, PolicyKey } from "@/config/policies";
import { PRODUCT_CONFIG } from "@/config/product";

interface PolicyPageViewProps {
  policyKey: PolicyKey;
}

const ALL_POLICY_KEYS: PolicyKey[] = ["privacy", "terms", "returns"];

export function PolicyPageView({ policyKey }: PolicyPageViewProps) {
  const doc = POLICY_DOCUMENTS[policyKey];
  const otherKeys = ALL_POLICY_KEYS.filter((key) => key !== policyKey);

  return (
    <div className="min-h-screen bg-cream-50 text-pine-950 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-pine-800 hover:text-crimson-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to CozyGlow™ Storefront
        </Link>

        <article className="rounded-3xl bg-white border border-pine-900/15 overflow-hidden shadow-card-soft">
          <header className="p-6 sm:p-8 bg-pine-950 text-cream-50 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amberGlow-400/15 border border-amberGlow-400/35 text-amberGlow-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-amberGlow-300">
                  {PRODUCT_CONFIG.brandName} • cozyglowhome.com
                </p>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight mt-0.5">
                  {doc.title}
                </h1>
              </div>
            </div>
            <p className="text-xs text-cream-200/75 mt-3">
              Last updated: {doc.updated}
            </p>
          </header>

          <div className="p-6 sm:p-8 space-y-6">
            {doc.sections.map((section) => (
              <section key={section.heading} className="space-y-1.5">
                <h2 className="font-bold text-base text-pine-950">
                  {section.heading}
                </h2>
                <p className="text-sm text-pine-800 leading-relaxed">
                  {section.text}
                </p>
              </section>
            ))}

            <div className="rounded-2xl bg-cream-100 border border-pine-900/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-crimson-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-xs sm:text-sm text-pine-800">
                  <p className="font-bold text-pine-950">
                    Need help or have a privacy question?
                  </p>
                  <p>
                    Contact our concierge team at{" "}
                    <a
                      href={`mailto:${PRODUCT_CONFIG.supportEmail}`}
                      className="font-semibold text-crimson-700 underline underline-offset-2"
                    >
                      {PRODUCT_CONFIG.supportEmail}
                    </a>
                    .
                  </p>
                </div>
              </div>

              <Link
                href="/#buy-box"
                className="rounded-xl bg-pine-900 hover:bg-pine-800 text-cream-50 text-xs font-bold px-4 py-2.5 text-center transition-colors shrink-0"
              >
                Shop CozyGlow™
              </Link>
            </div>

            <nav
              aria-label="Other legal policies"
              className="pt-4 border-t border-pine-900/10 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-pine-800"
            >
              <span>Other store policies:</span>
              <div className="flex flex-wrap items-center gap-4">
                {otherKeys.map((key) => {
                  const other = POLICY_DOCUMENTS[key];
                  return (
                    <Link
                      key={key}
                      href={other.slug}
                      className="hover:text-crimson-700 underline underline-offset-2 transition-colors"
                    >
                      {other.title}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </article>
      </div>
    </div>
  );
}

"use client";

import React, { FormEvent, useState } from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  Gift,
  Loader2,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { trackLead } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface NewsletterCaptureProps {
  source?: string;
  className?: string;
}

interface SubscribeResponse {
  ok: boolean;
  demoMode?: boolean;
  emailSent?: boolean;
  audienceAdded?: boolean;
  welcomeCode?: string;
  message?: string;
  error?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterCapture({
  source = "storefront-footer-capture",
  className,
}: NewsletterCaptureProps) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [successData, setSuccessData] = useState<{
    email: string;
    welcomeCode: string;
    message: string;
    demoMode: boolean;
  } | null>(null);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      // Clipboard API unavailable in restricted environments
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          firstName: firstName.trim() || undefined,
          source,
          website,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as SubscribeResponse;

      if (!response.ok || !data.ok) {
        setErrorMessage(
          data.error ||
            "Something went wrong while subscribing. Please try again."
        );
        return;
      }

      trackLead({ source });
      setSuccessData({
        email: trimmedEmail,
        welcomeCode: data.welcomeCode || "COZY10",
        message:
          data.message ||
          "Welcome to the CozyGlow™ Holiday Club! Check your inbox for your welcome gift.",
        demoMode: Boolean(data.demoMode),
      });
    } catch {
      setErrorMessage(
        "Unable to connect right now. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="newsletter"
      className={cn(
        "py-14 lg:py-16 bg-cream-100 border-t border-pine-900/10",
        className
      )}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl overflow-hidden shadow-card-soft border border-pine-900/10 grid grid-cols-1 lg:grid-cols-12 bg-white">
          {/* Left Panel: Holiday Club Benefits */}
          <div className="lg:col-span-6 bg-pine-900 text-cream-50 p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amberGlow-400/15 border border-amberGlow-400/35 text-amberGlow-300 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                CozyGlow™ Holiday Club
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                Unlock 10% Off + Festive Chimney Scent Recipes
              </h2>

              <p className="text-sm text-cream-200/85 leading-relaxed">
                Join cozy homes across the UK &amp; US for seasonal aromatherapy blends, early bundle access, and winter ambiance tips.
              </p>

              <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-cream-100">
                <li className="flex items-start gap-2.5">
                  <Gift className="w-4 h-4 text-amberGlow-300 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Instant 10% welcome code emailed from{" "}
                    <span className="font-semibold text-amberGlow-300">
                      hello@cozyglowhome.com
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-amberGlow-300 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Priority restock alerts before the December delivery cutoff
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amberGlow-300 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Curated essential oil recipes — zero spam, unsubscribe anytime
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Panel: Capture Form or Confirmation State */}
          <div className="lg:col-span-6 bg-white p-7 sm:p-9 flex flex-col justify-center">
            {successData ? (
              <div className="space-y-5" aria-live="polite">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-bold text-pine-950">
                      You&rsquo;re In the Holiday Club!
                    </h3>
                    <p className="text-xs sm:text-sm text-pine-800/85 leading-relaxed">
                      {successData.message}
                    </p>
                    <p className="text-xs text-pine-700">
                      Subscriber:{" "}
                      <span className="font-semibold text-pine-950">
                        {successData.email}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-cream-50 border border-amberGlow-500/40 p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-crimson-700">
                      Your 10% Welcome Code
                    </p>
                    <p className="font-mono text-xl font-extrabold tracking-widest text-pine-950 mt-0.5">
                      {successData.welcomeCode}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(successData.welcomeCode)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-pine-900 hover:bg-pine-800 text-cream-50 text-xs font-bold px-3.5 py-2.5 transition-colors shrink-0"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amberGlow-300" aria-hidden="true" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amberGlow-300" aria-hidden="true" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {successData.demoMode && (
                  <p className="text-[11px] text-pine-700 bg-cream-100 rounded-xl px-3 py-2 border border-pine-900/10">
                    Local preview mode: add <code className="font-mono">RESEND_API_KEY</code> to send live welcome emails from <span className="font-semibold">hello@cozyglowhome.com</span>.
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4 relative">
                <div>
                  <h3 className="font-serif text-xl font-bold text-pine-950">
                    Get Your 10% Welcome Gift
                  </h3>
                  <p className="text-xs sm:text-sm text-pine-800/80 mt-1">
                    Enter your email below and we&rsquo;ll send your code straight away.
                  </p>
                </div>

                {/* Honeypot field for bot filtering */}
                <div
                  aria-hidden="true"
                  className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden opacity-0 pointer-events-none"
                >
                  <label htmlFor="newsletter-website">Website</label>
                  <input
                    id="newsletter-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="newsletter-first-name"
                      className="block text-xs font-semibold text-pine-900 mb-1"
                    >
                      First Name{" "}
                      <span className="text-pine-700/70 font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="newsletter-first-name"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      maxLength={60}
                      placeholder="e.g. Charlotte"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-pine-900/20 bg-cream-50/70 px-3.5 py-2.5 text-sm text-pine-950 placeholder:text-pine-700/50 focus:outline-none focus:ring-2 focus:ring-amberGlow-400 focus:border-pine-900 transition-colors disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newsletter-email"
                      className="block text-xs font-semibold text-pine-900 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      id="newsletter-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      maxLength={254}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-pine-900/20 bg-cream-50/70 px-3.5 py-2.5 text-sm text-pine-950 placeholder:text-pine-700/50 focus:outline-none focus:ring-2 focus:ring-amberGlow-400 focus:border-pine-900 transition-colors disabled:opacity-60"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div
                    role="alert"
                    className="rounded-xl bg-red-50 border border-crimson-600/25 px-3.5 py-2.5 text-xs font-medium text-crimson-700"
                  >
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-crimson-700 hover:bg-crimson-600 text-white font-bold px-5 py-3.5 text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span>Sending Welcome Gift...</span>
                    </>
                  ) : (
                    <>
                      <Gift className="w-4 h-4 text-amberGlow-300" aria-hidden="true" />
                      <span>Send My 10% Welcome Code</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-pine-700/75 text-center leading-relaxed">
                  By subscribing, you agree to receive cozy seasonal offers from CozyGlow™ Home Aromatics. You can unsubscribe with one click at any time.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

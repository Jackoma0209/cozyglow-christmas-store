"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  PackageSearch,
  Sparkles,
  Truck,
} from "lucide-react";

const TRACKING_STAGES = [
  {
    title: "Order Verified & Quality Checked",
    detail: "Ultrasonic 2.4MHz mist disc & 2200K LED tested at Express Warehouse",
    time: "Today • Completed",
    done: true,
  },
  {
    title: "Packed in Protective Keepsake Box",
    detail: "Packed with braided USB-C cable & holiday cushioning",
    time: "Today • Completed",
    done: true,
  },
  {
    title: "Dispatched to Express Holiday Courier",
    detail: "Priority sorting hub scan (Royal Mail Tracked 48® / USPS Priority)",
    time: "In Transit • Next 24h",
    done: true,
  },
  {
    title: "Out for Doorstep Delivery",
    detail: "Estimated delivery within 5–7 business days with SMS arrival alert",
    time: "Upcoming",
    done: false,
  },
];

function TrackContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("order") || "#CG-84920";
  const [orderInput, setOrderInput] = useState(initialOrder);
  const [activeOrder, setActiveOrder] = useState(initialOrder);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = orderInput.trim() || "#CG-84920";
    setActiveOrder(cleaned);
  };

  return (
    <div className="min-h-screen bg-cream-50 text-pine-950 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-pine-800 hover:text-crimson-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to CozyGlow™ Storefront
        </Link>

        <div className="rounded-3xl bg-white border border-pine-900/15 p-6 sm:p-8 shadow-card-soft space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-pine-900 text-amberGlow-300 flex items-center justify-center shrink-0">
              <PackageSearch className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-pine-950">
                Track Your CozyGlow™ Holiday Parcel
              </h1>
              <p className="text-xs sm:text-sm text-pine-700">
                Enter your #CG order reference or email tracking ID for live warehouse &amp; courier updates.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleLookup}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={orderInput}
              onChange={(e) => setOrderInput(e.target.value)}
              placeholder="e.g. #CG-84920"
              aria-label="Order reference number"
              className="flex-1 rounded-2xl border border-pine-900/20 bg-cream-50 px-4 py-3 text-sm font-semibold text-pine-950 focus:outline-none focus:ring-2 focus:ring-pine-900"
            />
            <button
              type="submit"
              className="rounded-2xl bg-crimson-700 hover:bg-crimson-600 text-white font-bold px-6 py-3 text-sm transition-colors shrink-0"
            >
              Track Parcel
            </button>
          </form>

          <div className="rounded-2xl bg-cream-100 border border-pine-900/10 p-5 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-pine-900/10">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-pine-700">
                  Tracking Reference
                </p>
                <p className="font-mono text-lg font-extrabold text-pine-950">
                  {activeOrder}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 text-xs font-bold">
                <Truck className="w-3.5 h-3.5" />
                Express Batch • On Schedule
              </span>
            </div>

            <div className="space-y-4">
              {TRACKING_STAGES.map((stage, idx) => (
                <div key={stage.title} className="flex items-start gap-3.5">
                  <div className="flex flex-col items-center">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        stage.done
                          ? "bg-emerald-600 text-white"
                          : "bg-cream-200 text-pine-700 border border-pine-900/20"
                      }`}
                    >
                      {stage.done ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Package className="w-3.5 h-3.5" />
                      )}
                    </span>
                    {idx < TRACKING_STAGES.length - 1 && (
                      <span className="w-0.5 h-8 bg-pine-900/15 mt-1" />
                    )}
                  </div>
                  <div className="pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-pine-950">
                        {stage.title}
                      </p>
                      <span className="text-[11px] font-semibold text-pine-700">
                        • {stage.time}
                      </span>
                    </div>
                    <p className="text-xs text-pine-800 mt-0.5">{stage.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-pine-950 text-cream-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-amberGlow-300 shrink-0" />
              <span>Need to add another cottage before the holiday cutoff?</span>
            </div>
            <Link
              href="/#buy-box"
              className="rounded-xl bg-amberGlow-400 hover:bg-amberGlow-300 text-pine-950 font-bold text-xs px-4 py-2 text-center transition-colors shrink-0"
            >
              Return to Bundle Offer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6 text-sm font-semibold text-pine-900">
          Loading parcel tracker...
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}

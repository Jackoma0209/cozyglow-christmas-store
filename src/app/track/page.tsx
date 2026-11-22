"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Package,
  PackageSearch,
  Sparkles,
  Truck,
} from "lucide-react";
import { CurrencyCode, PRODUCT_CONFIG, formatMoney } from "@/config/product";

type FulfillmentStatus = "processing" | "packed" | "dispatched" | "delivered";

interface TrackOrderResult {
  demoMode: boolean;
  orderReference: string;
  createdAt: string;
  currency: CurrencyCode;
  amountTotal: number;
  fulfillmentStatus: FulfillmentStatus;
  shippingCity: string | null;
  shippingCountry: string | null;
  courierLabel: string;
  trackingNumber: string | null;
  trackingUrl: string | null;
  items: { description: string; quantity: number }[];
}

function buildStages(order: TrackOrderResult) {
  const rank: Record<FulfillmentStatus, number> = {
    processing: 0,
    packed: 1,
    dispatched: 2,
    delivered: 3,
  };
  const current = rank[order.fulfillmentStatus];

  return [
    {
      title: "Order Verified & Quality Checked",
      detail:
        "Payment verified and ultrasonic 2.4MHz unit queued at Express Warehouse.",
      time: current >= 0 ? "Completed" : "Pending",
      done: current >= 0,
    },
    {
      title: "Packed in Protective Keepsake Box",
      detail:
        "Packed in protective holiday cushioning for safe transit.",
      time: current >= 1 ? "Completed" : "In Queue",
      done: current >= 1,
    },
    {
      title: "Dispatched to Express Holiday Courier",
      detail: order.trackingNumber
        ? `Tracking ID ${order.trackingNumber} via ${order.courierLabel}`
        : `Scheduled via ${order.courierLabel}`,
      time: current >= 2 ? "In Transit" : "Awaiting Courier Scan",
      done: current >= 2,
    },
    {
      title: "Delivered to Doorstep",
      detail: order.shippingCity
        ? `Destination: ${order.shippingCity}${
            order.shippingCountry ? `, ${order.shippingCountry}` : ""
          }`
        : "Estimated arrival 8–12 business days with full tracking.",
      time: current >= 3 ? "Delivered" : "Upcoming",
      done: current >= 3,
    },
  ];
}

function TrackContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("order") || "";
  const [orderInput, setOrderInput] = useState(initialOrder);
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<TrackOrderResult | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setOrderResult(null);

    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderRef: orderInput.trim(),
          email: emailInput.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error || "No matching CozyGlow™ order was found."
        );
      }
      setOrderResult(data as TrackOrderResult);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Unable to look up order status. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const stages = orderResult ? buildStages(orderResult) : [];

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
                Enter your <span className="font-mono font-bold">#CG</span>{" "}
                order reference and checkout email address for verified dispatch
                status.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleLookup}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3"
          >
            <input
              type="text"
              required
              value={orderInput}
              onChange={(e) => setOrderInput(e.target.value)}
              placeholder="Order ref (e.g. #CG-84920)"
              aria-label="Order reference number"
              className="sm:col-span-4 rounded-2xl border border-pine-900/20 bg-cream-50 px-4 py-3 text-sm font-semibold text-pine-950 focus:outline-none focus:ring-2 focus:ring-pine-900"
            />
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Checkout email address"
              aria-label="Checkout email address"
              className="sm:col-span-5 rounded-2xl border border-pine-900/20 bg-cream-50 px-4 py-3 text-sm font-semibold text-pine-950 focus:outline-none focus:ring-2 focus:ring-pine-900"
            />
            <button
              type="submit"
              disabled={loading}
              className="sm:col-span-3 rounded-2xl bg-crimson-700 hover:bg-crimson-600 disabled:opacity-70 text-white font-bold px-5 py-3 text-sm transition-colors inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <span>Track Parcel</span>
              )}
            </button>
          </form>

          {errorMsg && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-2.5 text-xs sm:text-sm text-crimson-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p>{errorMsg}</p>
                <p className="text-xs text-pine-700 mt-1">
                  Need help? Email {PRODUCT_CONFIG.supportEmail} with your
                  order number.
                </p>
              </div>
            </div>
          )}

          {orderResult && (
            <div className="rounded-2xl bg-cream-100 border border-pine-900/10 p-5 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-pine-900/10">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-pine-700">
                    Verified Order Reference
                  </p>
                  <p className="font-mono text-lg font-extrabold text-pine-950">
                    {orderResult.orderReference}
                  </p>
                  <p className="text-xs text-pine-700 mt-0.5">
                    Placed on{" "}
                    {new Date(orderResult.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}{" "}
                    • Total{" "}
                    {formatMoney(orderResult.amountTotal, orderResult.currency)}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 text-xs font-bold capitalize">
                  <Truck className="w-3.5 h-3.5" />
                  {orderResult.fulfillmentStatus}
                  {orderResult.demoMode ? " (Demo)" : ""}
                </span>
              </div>

              {orderResult.items.length > 0 && (
                <div className="rounded-xl bg-white border border-pine-900/10 p-3.5 space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-pine-700">
                    Items in Parcel
                  </p>
                  {orderResult.items.map((item, idx) => (
                    <p
                      key={`${item.description}-${idx}`}
                      className="text-xs sm:text-sm font-semibold text-pine-950"
                    >
                      {item.quantity}x {item.description}
                    </p>
                  ))}
                </div>
              )}

              {orderResult.trackingUrl && (
                <a
                  href={orderResult.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-pine-900 hover:bg-pine-800 text-cream-50 text-xs font-bold px-4 py-2.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amberGlow-300" />
                  Open Live Courier Tracking
                  {orderResult.trackingNumber
                    ? ` (${orderResult.trackingNumber})`
                    : ""}
                </a>
              )}

              <div className="space-y-4">
                {stages.map((stage, idx) => (
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
                      {idx < stages.length - 1 && (
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
                      <p className="text-xs text-pine-800 mt-0.5">
                        {stage.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!orderResult && !errorMsg && (
            <div className="rounded-2xl bg-cream-100 border border-pine-900/10 p-5 text-xs sm:text-sm text-pine-800 leading-relaxed">
              Your <span className="font-mono font-bold">#CG</span> reference
              is displayed on your order confirmation screen and in your receipt
              email immediately after checkout.
            </div>
          )}

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

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BadgeCheck, Camera, Star, ThumbsUp } from "lucide-react";
import { PRODUCT_CONFIG, REVIEWS, ReviewItem } from "@/config/product";
import { CottageVisual } from "./CottageVisual";

const SCENE_BADGE_MAP: Record<ReviewItem["sceneTone"], string> = {
  mantel: "Mantelpiece Reel",
  bedside: "Bedside Nightlight",
  "secret-santa": "Gift Unboxing",
  dining: "3x Village Centerpiece",
  nursery: "Family Safe Demo",
  office: "Winter WFH Setup",
};

export function ReviewsGrid() {
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});
  const [failedPhotos, setFailedPhotos] = useState<Record<string, boolean>>({});

  const toggleHelpful = (id: string) => {
    setHelpfulVotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="reviews" className="py-16 lg:py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-pine-900/10 px-3.5 py-1.5 shadow-sm">
              <div className="flex items-center gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-pine-950">
                {PRODUCT_CONFIG.rating}/5 Average Rating ({PRODUCT_CONFIG.reviewCount.toLocaleString("en-US")}+ Reviews)
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-pine-950">
              Loved Across Living Rooms, Bedside Tables &amp; Gift Exchanges
            </h2>
          </div>

          <a
            href="#buy-box"
            className="inline-flex items-center justify-center rounded-full bg-pine-900 hover:bg-pine-800 text-cream-50 text-sm font-bold px-5 py-3 transition-colors shrink-0"
          >
            Claim Your Holiday Bundle →
          </a>
        </div>

        {/* Masonry-style 3-column UGC Review Wall */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {REVIEWS.map((review, index) => {
            const voted = !!helpfulVotes[review.id];
            const count = review.helpfulCount + (voted ? 1 : 0);
            const isMantel =
              review.sceneTone === "mantel" || review.sceneTone === "dining";

            return (
              <article
                key={review.id}
                className="break-inside-avoid rounded-3xl bg-white border border-pine-900/15 overflow-hidden shadow-card-soft flex flex-col"
              >
                {/* Photo / Video Style UGC Preview Header */}
                <div className="relative h-52 bg-pine-950 overflow-hidden">
                  <CottageVisual
                    scene={
                      isMantel
                        ? "mantel"
                        : review.sceneTone === "secret-santa"
                        ? "giftbox"
                        : index % 2 === 0
                        ? "chimney"
                        : "night"
                    }
                    mistActive
                    glowActive
                    intensity={index % 2 === 0 ? "steady" : "gentle"}
                    decorative
                  />

                  {review.imageSrc && !failedPhotos[review.imageSrc] && (
                    <Image
                      src={review.imageSrc}
                      alt={`${review.author} — ${review.sceneCaption}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      onError={() =>
                        setFailedPhotos((prev) =>
                          prev[review.imageSrc!]
                            ? prev
                            : { ...prev, [review.imageSrc!]: true }
                        )
                      }
                      className="z-10 object-cover"
                    />
                  )}

                  <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-pine-950/85 backdrop-blur-md text-white px-2.5 py-1 text-[11px] font-bold">
                    <Camera className="w-3 h-3 text-amberGlow-300" aria-hidden="true" />
                    {SCENE_BADGE_MAP[review.sceneTone]}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 z-20 rounded-xl bg-black/65 backdrop-blur-sm px-3 py-1.5 text-[11px] text-cream-100 font-medium">
                    &ldquo;{review.sceneCaption}&rdquo;
                  </div>
                </div>

                {/* Review Content */}
                <div className="p-5 sm:p-6 space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="flex items-center gap-0.5"
                      aria-label={`Rated ${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          aria-hidden="true"
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-cream-200 text-pine-900 px-2.5 py-0.5 text-[11px] font-bold">
                      {review.tag}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-pine-950 leading-snug">
                    {review.title}
                  </h3>

                  <p className="text-sm text-pine-800 leading-relaxed">
                    {review.body}
                  </p>

                  <div className="pt-3 border-t border-pine-900/10 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-pine-950 flex items-center gap-1">
                        {review.author}
                        <span className="inline-flex items-center gap-0.5 text-emerald-700 font-semibold">
                          <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" />
                          Verified Purchase
                        </span>
                      </p>
                      <p className="text-[11px] text-pine-700">
                        {review.location} • {review.bundleBought}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleHelpful(review.id)}
                      aria-pressed={voted}
                      aria-label={`Mark review by ${review.author} as helpful (${count} votes)`}
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        voted
                          ? "border-pine-900 bg-pine-900 text-white"
                          : "border-pine-900/15 text-pine-800 hover:border-pine-900/40"
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" aria-hidden="true" />
                      {count}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

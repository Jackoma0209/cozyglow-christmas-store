import {
  BUNDLE_TIERS,
  CurrencyCode,
  FAQS,
  GALLERY_SLIDES,
  PRODUCT_CONFIG,
  REVIEWS,
  getBundlePricing,
  getStandardShippingFee,
} from "@/config/product";

interface StructuredDataProps {
  currency: CurrencyCode;
  siteUrl: string;
}

export function StructuredData({ currency, siteUrl }: StructuredDataProps) {
  const cleanUrl = siteUrl.replace(/\/+$/, "");
  const isoCurrency = currency.toUpperCase();
  const prices = BUNDLE_TIERS.map((tier) =>
    getBundlePricing(tier, currency).price
  );
  const lowPrice = Math.min(...prices).toFixed(2);
  const highPrice = Math.max(...prices).toFixed(2);
  const shippingDestinationCountry = currency === "gbp" ? "GB" : "US";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${cleanUrl}/#organization`,
        name: "CozyGlow™ Home Aromatics",
        url: cleanUrl,
        logo: `${cleanUrl}/icon.svg`,
        email: PRODUCT_CONFIG.supportEmail,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: PRODUCT_CONFIG.supportEmail,
          availableLanguage: ["English"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${cleanUrl}/#website`,
        name: "CozyGlow™ Home Aromatics",
        url: cleanUrl,
        publisher: {
          "@id": `${cleanUrl}/#organization`,
        },
        inLanguage: "en",
      },
      {
        "@type": "Product",
        "@id": `${cleanUrl}/#product`,
        name: PRODUCT_CONFIG.productTitle,
        description: PRODUCT_CONFIG.valueProposition,
        sku: "CG-NORDIC-COTTAGE-01",
        brand: {
          "@type": "Brand",
          name: "CozyGlow™",
        },
        image: GALLERY_SLIDES.map((slide) => `${cleanUrl}${slide.imageSrc}`),
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: isoCurrency,
          lowPrice,
          highPrice,
          offerCount: BUNDLE_TIERS.length,
          availability: "https://schema.org/InStock",
          offers: BUNDLE_TIERS.map((tier) => {
            const pricing = getBundlePricing(tier, currency);
            const shippingFee = getStandardShippingFee(tier, currency);
            return {
              "@type": "Offer",
              name: tier.name,
              sku: `CG-COTTAGE-${tier.quantity}X`,
              url: `${cleanUrl}/#buy-box`,
              priceCurrency: isoCurrency,
              price: pricing.price.toFixed(2),
              availability: "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
              hasMerchantReturnPolicy: {
                "@type": "MerchantReturnPolicy",
                applicableCountry: shippingDestinationCountry,
                returnPolicyCategory:
                  "https://schema.org/MerchantReturnFiniteReturnWindow",
                merchantReturnDays: PRODUCT_CONFIG.guaranteeDays,
                returnMethod: "https://schema.org/ReturnByMail",
              },
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: {
                  "@type": "MonetaryAmount",
                  value: shippingFee.toFixed(2),
                  currency: isoCurrency,
                },
                shippingDestination: {
                  "@type": "DefinedRegion",
                  addressCountry: shippingDestinationCountry,
                },
                deliveryTime: {
                  "@type": "ShippingDeliveryTime",
                  handlingTime: {
                    "@type": "QuantitativeValue",
                    minValue: 0,
                    maxValue: 1,
                    unitCode: "DAY",
                  },
                  transitTime: {
                    "@type": "QuantitativeValue",
                    minValue: 8,
                    maxValue: 12,
                    unitCode: "DAY",
                  },
                },
              },
            };
          }),
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: PRODUCT_CONFIG.rating,
          reviewCount: PRODUCT_CONFIG.reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
        review: REVIEWS.map((review) => ({
          "@type": "Review",
          author: {
            "@type": "Person",
            name: review.author,
          },
          name: review.title,
          reviewBody: review.body,
          reviewRating: {
            "@type": "Rating",
            ratingValue: review.rating,
            bestRating: 5,
            worstRating: 1,
          },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${cleanUrl}/#faq`,
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  const serialized = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}

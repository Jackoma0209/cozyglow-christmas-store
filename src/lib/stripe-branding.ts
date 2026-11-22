import Stripe from "stripe";

export const STRIPE_CHECKOUT_API_VERSION =
  "2025-09-30.clover" as unknown as Stripe.LatestApiVersion;

export const STRIPE_STATEMENT_DESCRIPTOR_SUFFIX = "COZYGLOW";

export function buildCheckoutBrandingSettings(origin: string): Record<string, unknown> {
  const cleanOrigin = origin.replace(/\/+$/, "");
  const isPublicHttps = cleanOrigin.startsWith("https://");

  return {
    display_name: "CozyGlow™",
    background_color: "#FFFDF8",
    button_color: "#991B1B",
    border_style: "rounded",
    font_family: "inter",
    ...(isPublicHttps
      ? {
          icon: {
            type: "url",
            url: `${cleanOrigin}/images/products/01-chimney-mist-hero.jpg`,
          },
        }
      : {}),
  };
}

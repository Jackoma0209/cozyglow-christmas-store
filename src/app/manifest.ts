import type { MetadataRoute } from "next";
import { PRODUCT_CONFIG } from "@/config/product";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CozyGlow™ Home Aromatics",
    short_name: "CozyGlow™",
    description: PRODUCT_CONFIG.valueProposition,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFDF8",
    theme_color: "#0F241C",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

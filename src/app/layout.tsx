import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AnalyticsPixels } from "@/components/AnalyticsPixels";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://cozyglowhome.com"
).replace(/\/+$/, "");

const googleSiteVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const viewport: Viewport = {
  themeColor: "#0F241C",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "CozyGlow™ — Nordic Christmas Cottage Aroma Diffuser & Chimney Humidifier",
    template: "%s | CozyGlow™ Home Aromatics",
  },
  description:
    "Cordless snowy winter cottage humidifier that puffs gentle aromatic mist out of the chimney while casting a warm 2200K fireplace LED glow through frosted cottage windows. Tracked UK & US holiday delivery.",
  applicationName: "CozyGlow™ Home Aromatics",
  category: "Home & Garden",
  authors: [{ name: "CozyGlow™ Home Aromatics", url: siteUrl }],
  creator: "CozyGlow™ Home Aromatics",
  publisher: "CozyGlow™ Home Aromatics",
  keywords: [
    "Christmas cottage diffuser",
    "chimney mist humidifier",
    "Nordic Christmas cottage aroma diffuser",
    "cordless essential oil diffuser",
    "warm LED Christmas house diffuser",
    "CozyGlow",
    "Christmas gift ideas",
    "whisper quiet bedroom humidifier",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CozyGlow™ — Christmas Cottage Chimney Mist Diffuser",
    description:
      "Turn dry winter air into a warm Nordic hearth. Whisper-quiet <25dB ultrasonic chimney mist + warm fireplace LED glow.",
    url: "/",
    siteName: "CozyGlow™ Home Aromatics",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/images/og-cozyglow.jpg",
        width: 1200,
        height: 630,
        alt: "CozyGlow™ Christmas Cottage Chimney Mist Diffuser",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CozyGlow™ — Christmas Cottage Chimney Mist Diffuser",
    description:
      "Turn dry winter air into a warm Nordic hearth. Whisper-quiet <25dB ultrasonic chimney mist + warm fireplace LED glow.",
    images: ["/images/og-cozyglow.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  ...(googleSiteVerification
    ? {
        verification: {
          google: googleSiteVerification,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen overflow-x-clip font-sans antialiased bg-cream-50 text-pine-900 selection:bg-amberGlow-300/40 selection:text-pine-950">
        {children}
        <AnalyticsPixels />
        <CookieConsentBanner />
      </body>
    </html>
  );
}

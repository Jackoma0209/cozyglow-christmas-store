import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AnalyticsPixels } from "@/components/AnalyticsPixels";
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cozyglow-christmas-store.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title:
    "CozyGlow™ — Nordic Christmas Cottage Aroma Diffuser & Chimney Humidifier",
  description:
    "Cordless snowy winter cottage humidifier that puffs gentle aromatic mist out of the chimney while casting a warm 2200K fireplace LED glow through frosted cottage windows. Tracked UK & US holiday delivery.",
  openGraph: {
    title: "CozyGlow™ — Christmas Cottage Chimney Mist Diffuser",
    description:
      "Turn dry winter air into a warm Nordic hearth. Whisper-quiet <25dB ultrasonic chimney mist + warm fireplace LED glow.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-sans antialiased bg-cream-50 text-pine-900 selection:bg-amberGlow-300/40 selection:text-pine-950">
        {children}
        <AnalyticsPixels />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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

export const metadata: Metadata = {
  title:
    "CozyGlow™ — Nordic Christmas Cottage Aroma Diffuser & Chimney Humidifier",
  description:
    "USB-C powered snowy winter cottage humidifier that puffs gentle aromatic mist out of the chimney while casting a warm 2200K fireplace LED glow through frosted cottage windows. Fast UK & US dispatch.",
  openGraph: {
    title: "CozyGlow™ — Christmas Cottage Chimney Mist Diffuser",
    description:
      "Turn dry winter air into a warm Nordic hearth. Whisper-quiet <25dB ultrasonic chimney mist + warm fireplace LED glow.",
    type: "website",
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
      </body>
    </html>
  );
}

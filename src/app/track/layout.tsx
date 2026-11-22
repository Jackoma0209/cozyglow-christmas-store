import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Holiday Parcel",
  description:
    "Look up verified courier tracking and dispatch progress for your CozyGlow™ order.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrackLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

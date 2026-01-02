import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import { PageLoader } from "@/components/page-loader";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "prayer",
  description: "2026 Prayer",
  viewport: {
    width: "device-width",
    initialScale: 1,
    interactiveWidget: "resizes-content",
  },
  openGraph: {
    title: "prayer",
    description: "2026 Prayer",
    images: [
      {
        url: "/prayer-ogp-1.png",
        width: 1200,
        height: 630,
        alt: "prayer - 2026 Prayer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "prayer",
    description: "2026 Prayer",
    images: ["/prayer-ogp-1.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${instrumentSerif.className} antialiased`}>
        <PageLoader />
        {children}
      </body>
    </html>
  );
}

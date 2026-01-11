import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import { PageLoader } from "@/components/page-loader";
import { ConditionalHeader } from "@/components/conditional-header";
import { Footer } from "@/components/footer";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "2026 prayer",
  description: "submit your prayer for 2026",
  viewport: {
    width: "device-width",
    initialScale: 1,
    interactiveWidget: "resizes-content",
  },
  openGraph: {
    title: "2026 prayer",
    description: "submit your prayer for 2026",
    images: [
      {
        url: "/prayer-ogp-1.png",
        width: 1200,
        height: 630,
        alt: "2026 prayer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 prayer",
    description: "submit your prayer for 2026",
    images: ["/prayer-ogp-1.png"],
  },
  icons: {
    icon: "/purp.png",
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
        <ConditionalHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-newsreader",
  adjustFontFallback: true,
  preload: true,
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-instrument-sans",
  adjustFontFallback: true,
});

const siteUrl = "https://hopetheorylabs.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Hope Theory Labs — Fast websites for businesses, AI services in early access",
  description:
    "Hope Theory Labs builds fast, mobile-first websites for businesses, with AI services available in early access. Based in Dhaka, Bangladesh.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Hope Theory Labs",
    description: "Fast websites for businesses. AI services in early access.",
    type: "website",
    url: "/",
    siteName: "Hope Theory Labs",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Hope Theory Labs — Your data. Connected. Your business. Smarter." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hope Theory Labs",
    description: "Fast websites for businesses. AI services in early access.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0F1B2D",
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Hope Theory Labs",
  url: siteUrl,
  image: `${siteUrl}/og.png`,
  email: "hopetheorybd@gmail.com",
  telephone: "+8801718463471",
  areaServed: "Bangladesh",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={[newsreader.variable, instrumentSans.variable].join(" ")}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}

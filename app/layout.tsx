import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Instrument_Sans, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

/*
  Fonts — docs/BRAND.md. Self-hosted via next/font/google, subset, display: swap,
  only the weights the site uses. CSS variables feed the Tailwind @theme in globals.css.
*/

// Editorial section headings: Newsreader 400.
const newsreader = Newsreader({ subsets: ["latin"], weight: ["400"], display: "swap", variable: "--font-newsreader" });

// Body and controls: Instrument Sans 400/500.
const instrumentSans = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500"], display: "swap", variable: "--font-instrument-sans" });

// Small uppercase section labels: JetBrains Mono 400.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

// Bangla: Hind Siliguri 400/600.
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-hind-siliguri",
});

/*
  SEO metadata (issue #6) — exact copy from docs/SPEC.md.
  Static export: no server dynamic APIs; everything is declarative.
*/
const SITE_URL = "https://hopetheorylabs.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Hope Theory Labs — AI transformation and websites for businesses",
  description:
    "Hope Theory Labs builds fast websites and AI integrations, and turns your data into one living intelligence. Based in Dhaka, Bangladesh.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Hope Theory Labs",
    title: "Hope Theory Labs — AI transformation and websites for businesses",
    description: "Websites, AI integrations and AI transformation. Every source, one mind.",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "Hope Theory Labs — AI transformation and websites for businesses" },
    ],
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hope Theory Labs — AI transformation and websites for businesses",
    description:
      "Hope Theory Labs builds fast websites and AI integrations, and turns your data into one living intelligence. Based in Dhaka, Bangladesh.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

// themeColor lives in the viewport export in Next.js 15+.
export const viewport: Viewport = {
  themeColor: "#07090C",
};

/*
  JSON-LD ProfessionalService (issue #6) — SPEC fields only:
  name, url, email, telephone, areaServed, address. No ratings, no reviews.
*/
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Hope Theory Labs",
  url: SITE_URL,
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
      className={[
        newsreader.variable,
        instrumentSans.variable,
        jetbrainsMono.variable,
        hindSiliguri.variable,
      ].join(" ")}
    >
      <head>
        {/* Issue #5: JS gate for the CSS reveals — no-JS readers keep full visibility. */}
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

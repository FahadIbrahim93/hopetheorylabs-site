import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

/*
  Fonts — docs/BRAND.md. Self-hosted via next/font/google, subset, display: swap,
  only the weights the site uses. CSS variables feed the Tailwind @theme in globals.css.
*/

// Headings: Space Grotesk 600/700 (variable font).
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

// Body: Inter 400/600 (variable font).
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-inter",
});

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
  title: "Hope Theory Labs — Fast websites for Bangladeshi businesses",
  description:
    "Mobile-first websites with WhatsApp ordering and cash on delivery, built in Dhaka. We build a free concept of your site first. From ৳25,000.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Hope Theory Labs",
    title: "Hope Theory Labs — Fast websites for Bangladeshi businesses",
    description:
      "Mobile-first websites with WhatsApp ordering and cash on delivery, built in Dhaka. We build a free concept of your site first. From ৳25,000.",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "Hope Theory Labs — fast websites for Bangladeshi businesses" },
    ],
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hope Theory Labs — Fast websites for Bangladeshi businesses",
    description:
      "Mobile-first websites with WhatsApp ordering and cash on delivery, built in Dhaka. We build a free concept of your site first. From ৳25,000.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

// themeColor lives in the viewport export in Next.js 15+.
export const viewport: Viewport = {
  themeColor: "#0F1B2D",
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
        spaceGrotesk.variable,
        inter.variable,
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

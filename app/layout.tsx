import type { Metadata, Viewport } from "next";
import { AssistantLauncher } from "@/components/assistant/AssistantLauncher";
import { en } from "@/content/en";
import { Instrument_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-newsreader",
  adjustFontFallback: true,
  preload: true,
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-instrument-sans",
  adjustFontFallback: true,
});

const siteUrl = "https://hopetheorylabs.vercel.app";

const title = "Hope Theory Labs — AI Engineering & Custom Software | Dhaka";
const description =
  "AI and software engineering in Dhaka: forward-deployed engineering, custom web and mobile applications, AI integrations, automation and connected enterprise systems. An AI Audit is optional.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s — Hope Theory Labs" },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    type: "website",
    url: "/",
    siteName: "Hope Theory Labs",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Hope Theory Labs — AI engineering and custom software" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
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
  email: "hopetheorylabs@gmail.com",
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
        <AssistantLauncher
          copy={en.assistant}
          email={en.contact.email}
          calcomUrl={process.env.NEXT_PUBLIC_CALCOM_URL}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}

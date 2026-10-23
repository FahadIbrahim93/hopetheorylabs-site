import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Hope Theory Labs",
  description: "Fast websites for Bangladeshi businesses.",
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
      <body>{children}</body>
    </html>
  );
}

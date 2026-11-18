import type { Metadata } from "next";

import { ContentProvider } from "@/components/ContentProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingSection } from "@/components/PricingSection";

export const metadata: Metadata = {
  title: "AI Audit and website packages",
  description:
    "The AI Audit and forward-deployed AI engineering are quoted per scope after discovery. Website packages from ৳10,000 are a separate, supporting offer.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <ContentProvider>
      <div className="site-shell standalone-route">
        <Header />
        <main id="main" tabIndex={-1}>
          <PricingSection headingLevel={1} />
        </main>
        <Footer />
      </div>
    </ContentProvider>
  );
}

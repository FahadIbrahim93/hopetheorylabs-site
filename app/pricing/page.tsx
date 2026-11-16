import type { Metadata } from "next";

import { ContentProvider } from "@/components/ContentProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingSection } from "@/components/PricingSection";

export const metadata: Metadata = {
  title: "Website packages and pricing",
  description:
    "Published website packages from ৳10,000: Starter, Counter and Showroom, with the founding Counter at ৳15,000. AI audit and AI engineering are quoted after discovery.",
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

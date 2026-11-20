import type { Metadata } from "next";

import { ContentProvider } from "@/components/ContentProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingSection } from "@/components/PricingSection";

export const metadata: Metadata = {
  title: "AI Audit and AI engineering",
  description:
    "The AI Audit and forward-deployed AI engineering are quoted per scope after discovery. The published Starter, Counter and Showroom website packages are listed on the services page.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <ContentProvider>
      <div className="site-shell standalone-route">
        <Header />
        <main id="main" tabIndex={-1}>
          <PricingSection headingLevel={1} packagesLink />
        </main>
        <Footer />
      </div>
    </ContentProvider>
  );
}

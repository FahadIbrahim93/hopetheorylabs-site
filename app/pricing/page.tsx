import type { Metadata } from "next";

import { ContentProvider } from "@/components/ContentProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingSection } from "@/components/PricingSection";

export const metadata: Metadata = {
  title: "Custom Software, AI Engineering and Website Packages",
  description:
    "Custom software, AI integrations, forward-deployed engineering and optional AI Audits are quoted per scope. Website packages from ৳10,000 are available separately.",
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

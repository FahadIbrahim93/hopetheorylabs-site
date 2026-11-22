import type { Metadata } from "next";

import { ContentProvider } from "@/components/ContentProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingSection } from "@/components/PricingSection";

export const metadata: Metadata = {
  title: "Engineering quotes and website packages",
  description:
    "Forward-deployed engineering, custom software, AI integration and enterprise systems are quoted per scope. The optional AI Audit is scoped separately; website packages are listed on services.",
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

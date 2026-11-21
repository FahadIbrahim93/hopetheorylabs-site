import type { Metadata } from "next";

import { ContentProvider } from "@/components/ContentProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ServicesPageContent } from "@/components/ServicesPageContent";
import { StandaloneAtmosphere } from "@/components/StandaloneAtmosphere";

export const metadata: Metadata = {
  title: "Services and website packages",
  description:
    "Six ways Hope Theory Labs works with you, led by the AI Audit and forward-deployed AI engineering, plus the published Starter, Counter and Showroom website packages. AI and custom work is quoted per scope after discovery.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <ContentProvider>
      <div className="site-shell standalone-route">
        <StandaloneAtmosphere />
        <Header />
        <main id="main" tabIndex={-1}>
          <ServicesPageContent />
        </main>
        <Footer />
      </div>
    </ContentProvider>
  );
}

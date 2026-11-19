import type { Metadata } from "next";

import { ContentProvider } from "@/components/ContentProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ServicesPageContent } from "@/components/ServicesPageContent";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Six engineering capabilities: forward-deployed delivery, custom web/mobile applications, AI integrations and automation, enterprise systems, optional AI Audits, and managed engineering. Quoted per scope.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <ContentProvider>
      <div className="site-shell standalone-route">
        <Header />
        <main id="main" tabIndex={-1}>
          <ServicesPageContent />
        </main>
        <Footer />
      </div>
    </ContentProvider>
  );
}

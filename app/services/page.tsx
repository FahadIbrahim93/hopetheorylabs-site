import type { Metadata } from "next";

import { ContentProvider } from "@/components/ContentProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ServicesPageContent } from "@/components/ServicesPageContent";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Six ways Hope Theory Labs works with you. Lead with the AI Audit and forward-deployed AI engineering, with AI integration, custom software, enterprise systems and managed engineering alongside. Quoted per scope after discovery.",
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

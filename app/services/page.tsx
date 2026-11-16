import type { Metadata } from "next";

import { ContentProvider } from "@/components/ContentProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ServicesPageContent } from "@/components/ServicesPageContent";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Five ways Hope Theory Labs works with you: forward-deployed engineering, custom web and mobile software, AI integration and automation, enterprise systems and data, managed engineering. Custom work is quoted after discovery.",
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

import type { Metadata } from "next";

import { ContentProvider } from "@/components/ContentProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { About } from "@/components/About";

export const metadata: Metadata = {
  title: "About",
  description:
    "Hope Theory Labs is an AI engineering and custom software studio in Dhaka, founded and run by Fahad Ibrahim. The person you talk to is the person who builds.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <ContentProvider>
      <div className="site-shell standalone-route">
        <Header />
        <main id="main" tabIndex={-1}>
          <About headingLevel={1} />
        </main>
        <Footer />
      </div>
    </ContentProvider>
  );
}

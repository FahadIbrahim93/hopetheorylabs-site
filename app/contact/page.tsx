import type { Metadata } from "next";

import { ContentProvider } from "@/components/ContentProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Hope Theory Labs about custom software, forward-deployed engineering, AI integration, enterprise systems or an optional AI Audit. Engineering is scoped after discovery; website packages start at ৳10,000.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <ContentProvider>
      <div className="site-shell standalone-route">
        <Header />
        <main id="main" tabIndex={-1}>
          <Contact headingLevel={1} />
        </main>
        <Footer />
      </div>
    </ContentProvider>
  );
}

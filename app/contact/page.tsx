import type { Metadata } from "next";

import { ContentProvider } from "@/components/ContentProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell Hope Theory Labs what you are working on. Custom software and AI work is scoped after discovery; published website packages start at ৳10,000. Replies on WhatsApp.",
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

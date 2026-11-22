import type { Metadata } from "next";

import { ContentProvider } from "@/components/ContentProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { About } from "@/components/About";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Hope Theory Labs approaches forward-deployed engineering, custom software, AI integration and connected systems. Based in Dhaka, Bangladesh.",
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

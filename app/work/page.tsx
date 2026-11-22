import type { Metadata } from "next";

import { ContentProvider } from "@/components/ContentProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WorkIndex } from "@/components/WorkIndex";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Proof from Hope Theory Labs, labelled honestly: concept pitches, shipped studio software, and work we can point at without invented metrics or client logos.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <ContentProvider>
      <div className="site-shell standalone-route">
        <Header />
        <main id="main" tabIndex={-1}>
          <WorkIndex />
        </main>
        <Footer />
      </div>
    </ContentProvider>
  );
}

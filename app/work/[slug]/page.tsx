import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentProvider } from "@/components/ContentProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WorkCasePageContent } from "@/components/WorkCasePageContent";
import { en } from "@/content/en";

export const dynamicParams = false;

export function generateStaticParams() {
  return en.work.cases.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = en.work.cases.find((entry) => entry.slug === slug);
  if (!item) return {};
  return {
    title: `${item.title} · ${item.tag}`,
    description: item.summary,
    alternates: { canonical: `/work/${item.slug}` },
  };
}

export default async function WorkCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!en.work.cases.some((entry) => entry.slug === slug)) notFound();

  return (
    <ContentProvider>
      <div className="site-shell standalone-route">
        <Header />
        <main id="main" tabIndex={-1}>
          <WorkCasePageContent slug={slug} />
        </main>
        <Footer />
      </div>
    </ContentProvider>
  );
}

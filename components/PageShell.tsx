"use client";

import { LazyMotion, domAnimation } from "framer-motion";

import { Reveal } from "./Reveal";
import { LanguageProvider, useContent, useLang } from "./LanguageProvider";

import { About } from "./About";
import { Contact } from "./Contact";
import { EarlyAccessAI } from "./EarlyAccessAI";
import { FeatureGrid } from "./FeatureGrid";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { HowItWorksTimeline } from "./HowItWorksTimeline";
import { Pricing } from "./Pricing";
import { StickyWhatsApp } from "./StickyWhatsApp";
import { WorkCard } from "./WorkCard";

/*
  One page, SPEC order, now language-aware (issue #3).

  Everything lives inside <LanguageProvider> so a toggle re-renders every
  visible string. The shell root carries data-lang, which globals.css uses
  to swap the Latin display/body fonts for Hind Siliguri when bn is active.
  The static export prerenders the English page; other languages apply on
  hydration.
*/
function Shell() {
  const content = useContent();
  const { lang } = useLang();

  return (
    <div data-lang={lang}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-teal focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        {content.header.skip}
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Reveal>
          <HowItWorksTimeline />
        </Reveal>
        <Reveal>
          <FeatureGrid />
        </Reveal>
        <Reveal>
          <WorkCard />
        </Reveal>
        <Reveal>
          <Pricing />
        </Reveal>
        <Reveal>
          <EarlyAccessAI />
        </Reveal>
        <Reveal>
          <About />
        </Reveal>
        <Reveal>
          <Contact />
        </Reveal>
      </main>
      <Reveal>
        <Footer />
      </Reveal>
      <StickyWhatsApp href={content.contact.phoneHref} label={content.hero.primaryCta} />
    </div>
  );
}

export function PageShell() {
  return (
    <LanguageProvider>
      {/* issue #5: LazyMotion + domAnimation, strict — plain motion.* imports are rejected. */}
      <LazyMotion features={domAnimation} strict>
        <Shell />
      </LazyMotion>
    </LanguageProvider>
  );
}

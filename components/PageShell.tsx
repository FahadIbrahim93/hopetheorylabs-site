"use client";

import dynamic from "next/dynamic";

import { LanguageProvider, useContent, useLang } from "./LanguageProvider";
import { About } from "./About";
import { Contact } from "./Contact";
import { FeatureGrid } from "./FeatureGrid";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { HeaderScroll } from "./HeaderScroll";
import { Hero } from "./Hero";
import { HowItWorksTimeline } from "./HowItWorksTimeline";
import { LivingFlow } from "./LivingFlow";
import { MethodSection } from "./MethodSection";
import { PricingSection } from "./PricingSection";
import { Reveal } from "./Reveal";
import { ShiftSection } from "./ShiftSection";
import { NarrativeRail } from "./NarrativeRail";
import { StickyWhatsApp } from "./StickyWhatsApp";
import { StudioAtmosphere } from "./StudioAtmosphere";
import { WorkSection } from "./WorkSection";

const Experience = dynamic(() => import("./experience/Experience").then((m) => m.Experience), {
  ssr: false,
});

function Shell() {
  const content = useContent();
  const { lang } = useLang();
  return <div data-lang={lang} className="site-shell">
    <a href="#main" className="skip-link">{content.header.skip}</a>
    <Header />
    <HeaderScroll />
    <StudioAtmosphere />
    <NarrativeRail />
    <Experience />
    <main id="main" tabIndex={-1}>
      <Hero />
      <Reveal><MethodSection /></Reveal>
      <Reveal><ShiftSection /></Reveal>
      <Reveal><LivingFlow /></Reveal>
      <Reveal><HowItWorksTimeline /></Reveal>
      <Reveal><FeatureGrid /></Reveal>
      <Reveal><PricingSection /></Reveal>
      <Reveal><WorkSection /></Reveal>
      <Reveal><About /></Reveal>
      <Reveal><Contact /></Reveal>
    </main>
    <Footer />
    <StickyWhatsApp href={content.hero.whatsappLink} label={content.hero.primaryCta} />
    <div className="ambient-nodes" aria-hidden="true">
      {content.hero.coreNodes.map((node, i) => <span key={node} className={`ambient-node node-${i + 1}`}><i />{node}</span>)}
    </div>
    <span className="ambient-monogram" aria-hidden="true">H</span>
  </div>;
}
export function PageShell() {
  return <LanguageProvider><Shell /></LanguageProvider>;
}

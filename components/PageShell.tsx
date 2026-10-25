"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { LanguageProvider, useContent, useLang } from "./LanguageProvider";
import { About } from "./About";
import { Contact } from "./Contact";
import { FeatureGrid } from "./FeatureGrid";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { HowItWorksTimeline } from "./HowItWorksTimeline";
import { IntelligenceCore } from "./IntelligenceCore";
import { LivingFlow } from "./LivingFlow";
import { MethodSection } from "./MethodSection";
import { Reveal } from "./Reveal";
import { ShiftSection } from "./ShiftSection";
import { StateHud } from "./StateHud";
import { StickyWhatsApp } from "./StickyWhatsApp";
import { WorkCard } from "./WorkCard";

function Shell() {
  const content = useContent();
  const { lang } = useLang();
  return <div data-lang={lang} className="site-shell">
    <a href="#main" className="skip-link">{content.header.skip}</a>
    <Header />
    <StateHud />
    <main id="main" tabIndex={-1}>
      <Hero />
      <Reveal><MethodSection /></Reveal>
      <Reveal><ShiftSection /></Reveal>
      <Reveal><LivingFlow /></Reveal>
      <Reveal><HowItWorksTimeline /></Reveal>
      <Reveal><FeatureGrid /></Reveal>
      <Reveal><WorkCard /></Reveal>
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
  return <LanguageProvider><LazyMotion features={domAnimation} strict><Shell /></LazyMotion></LanguageProvider>;
}

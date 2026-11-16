import type { SiteContent } from "./types";
import { en } from "./en";

/*
 * TODO: Bangla copy must be reviewed by Fahad Ibrahim before the language toggle
 * goes live. Keep the schema in sync with English; values temporarily mirror it.
 */
export const bn: SiteContent = {
  ...en,
  header: { ...en.header, nav: en.header.nav.map((item) => ({ ...item })), cta: { ...en.header.cta } },
  hero: { ...en.hero, coreNodes: [...en.hero.coreNodes], coreNodeDetails: [...en.hero.coreNodeDetails] },
  story: { ...en.story, flowItems: en.story.flowItems.map((item) => ({ ...item })) },
  howItWorks: { ...en.howItWorks, steps: en.howItWorks.steps.map((item) => ({ ...item })) },
  services: {
    ...en.services,
    pillars: en.services.pillars.map((pillar) => ({ ...pillar, outputs: [...pillar.outputs] })),
    labels: { ...en.services.labels },
    detailsCta: { ...en.services.detailsCta },
    packages: { ...en.services.packages, cta: { ...en.services.packages.cta } },
  },
  about: { ...en.about, founder: { ...en.about.founder } },
  work: {
    ...en.work,
    cases: en.work.cases.map((c) => ({
      ...c,
      deliverables: [...c.deliverables],
      link: c.link ? { ...c.link } : undefined,
      secondaryLink: c.secondaryLink ? { ...c.secondaryLink } : undefined,
      gamePreview: c.gamePreview ? { ...c.gamePreview } : undefined,
      phoneDemo: c.phoneDemo
        ? { ...c.phoneDemo, items: [...c.phoneDemo.items] }
        : undefined,
    })),
  },
  contact: { ...en.contact },
  footer: { ...en.footer, ticker: [...en.footer.ticker], nav: en.footer.nav.map((item) => ({ ...item })) },
  studio: { ...en.studio },
};
export default bn;

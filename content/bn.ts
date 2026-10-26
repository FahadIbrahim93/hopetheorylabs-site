import type { SiteContent } from "./types";
import { en } from "./en";

/*
 * TODO: Bangla copy must be reviewed by Fahad Ibrahim before the language toggle
 * goes live. Keep the schema in sync with English; values temporarily mirror it.
 */
export const bn: SiteContent = {
  ...en,
  header: { ...en.header, nav: en.header.nav.map((item) => ({ ...item })) },
  hero: { ...en.hero, coreNodes: [...en.hero.coreNodes], coreNodeDetails: [...en.hero.coreNodeDetails] },
  story: { ...en.story, flowItems: en.story.flowItems.map((item) => ({ ...item })) },
  howItWorks: { ...en.howItWorks, steps: en.howItWorks.steps.map((item) => ({ ...item })) },
  services: {
    ...en.services,
    websiteLane: {
      ...en.services.websiteLane,
      items: en.services.websiteLane.items.map((item) => ({ ...item })),
    },
    aiLane: {
      ...en.services.aiLane,
      items: en.services.aiLane.items.map((item) => ({ ...item })),
    },
  },
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
  footer: { ...en.footer, ticker: [...en.footer.ticker] },
  studio: { ...en.studio },
};
export default bn;

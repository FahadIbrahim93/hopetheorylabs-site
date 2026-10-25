import type { SiteContent } from "./types";
import { en } from "./en";

/*
 * TODO: Bangla copy must be reviewed by Fahad/Tamim before the language toggle
 * goes live. Keep the schema in sync with English; values temporarily mirror it.
 */
export const bn: SiteContent = {
  ...en,
  header: { ...en.header, nav: en.header.nav.map((item) => ({ ...item })) },
  hero: { ...en.hero, coreNodes: [...en.hero.coreNodes], coreNodeDetails: [...en.hero.coreNodeDetails] },
  story: { ...en.story, flowItems: en.story.flowItems.map((item) => ({ ...item })) },
  howItWorks: { ...en.howItWorks, steps: en.howItWorks.steps.map((item) => ({ ...item })) },
  services: { ...en.services, items: en.services.items.map((item) => ({ ...item })) },
  work: { ...en.work, phoneItems: [...en.work.phoneItems] },
  contact: { ...en.contact },
  footer: { ...en.footer, ticker: [...en.footer.ticker] },
};
export default bn;

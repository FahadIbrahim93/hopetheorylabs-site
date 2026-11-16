"use client";

import { createContext, useContext, type ReactNode } from "react";

import { en } from "@/content/en";
import type { SiteContent } from "@/content/types";

/*
  Copy provider. The site ships one language.

  Bangla was scaffolded in issue #3 but never translated: `content/bn.ts`
  spread the English object, the toggle was disabled, and the font token
  pointed at a webfont that was never loaded. The half-feature is removed
  rather than left wired up (issue #50 follow-up); when the copy is written
  and reviewed, bring back a real provider with a second language object.
*/
const ContentContext = createContext<SiteContent>(en);

export function ContentProvider({ children }: { children: ReactNode }) {
  return <ContentContext.Provider value={en}>{children}</ContentContext.Provider>;
}

export function useContent(): SiteContent {
  return useContext(ContentContext);
}

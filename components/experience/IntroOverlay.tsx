"use client";

import { useSyncExternalStore } from "react";

import { useContent } from "../LanguageProvider";
import { useExperienceMode } from "./mode";
import { getDiscrete, subscribeDiscrete } from "./store";

/** Brand intro line — hidden under reduced motion (matches the concept page). */
export function IntroOverlay() {
  const { studio } = useContent();
  const mode = useExperienceMode();
  const reduced = useSyncExternalStore(subscribeDiscrete, () => getDiscrete().reducedMotion, () => false);
  if (mode !== "webgl" || reduced) return null;
  return (
    <div className="experience-intro" aria-hidden="true">
      <span>{studio.introWordmark}</span>
      <p className="experience-intro-cue">{studio.introCue}</p>
      <i />
    </div>
  );
}

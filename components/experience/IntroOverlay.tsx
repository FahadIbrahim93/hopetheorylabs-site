"use client";

import { useExperienceMode } from "./mode";
import { getDiscrete, subscribeDiscrete } from "./store";
import { useSyncExternalStore } from "react";

/** Brand intro line — hidden under reduced motion (matches the concept page). */
export function IntroOverlay() {
  const mode = useExperienceMode();
  const reduced = useSyncExternalStore(subscribeDiscrete, () => getDiscrete().reducedMotion, () => false);
  if (mode !== "webgl" || reduced) return null;
  return (
    <div className="experience-intro" aria-hidden="true">
      <span>Hope Theory Labs</span>
      <i />
    </div>
  );
}

"use client";

import { useSyncExternalStore } from "react";

import { getDiscrete, subscribeDiscrete } from "./store";

/** Thin hook so Hero/HUD never import the full Experience module (and its WebGL tree). */
export function useExperienceMode() {
  return useSyncExternalStore(subscribeDiscrete, () => getDiscrete().mode, () => "pending" as const);
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribeDiscrete, () => getDiscrete().reducedMotion, () => false);
}

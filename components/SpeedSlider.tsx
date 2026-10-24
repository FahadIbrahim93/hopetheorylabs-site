"use client";

import { useState } from "react";

import { useContent } from "./LanguageProvider";

/*
  Before/after loading comparison (issues #5 + #2): a native range input
  wipes between the slow "Before" skeleton and the fast "After" one —
  identical geometry, the wipe (clip-path inset from the right) is the only
  difference. Draggable and fully keyboard operable (arrow keys move a
  range input natively); labelled exactly by the content files —
  "Illustrative only", no numbers ever. Skeletons are aria-hidden; the
  readable copy is only the Before / After / Illustrative only labels.

  Reduced motion: the wipe tracks the input instantly (drag feedback stays
  immediate; nothing else animates here).
*/
export function SpeedSlider() {
  const content = useContent();
  const [position, setPosition] = useState(55);

  const skeleton = (tone: string) => (
    <div className="mt-4 space-y-3">
      <div className={`h-2 rounded-full ${tone} w-2/3`} />
      <div className={`h-2 rounded-full ${tone} w-full`} />
      <div className={`h-2 rounded-full ${tone} w-5/6`} />
      <div className={`h-2 rounded-full ${tone} w-full`} />
      <div className={`h-2 rounded-full ${tone} w-1/2`} />
      <div className={`h-2 rounded-full ${tone} w-3/4`} />
      <div className={`h-2 rounded-full ${tone} w-full`} />
      <div className={`h-2 rounded-full ${tone} w-2/3`} />
      <div className={`h-2 rounded-full ${tone} w-5/6`} />
      <div className={`h-2 rounded-full ${tone} w-1/2`} />
    </div>
  );

  return (
    <div className="mt-16 border-t border-paper/10 pt-16">
      <div className="relative mt-2 select-none" aria-hidden="true">
        {/* AFTER (fast) — base layer, always fully visible. */}
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
            {content.speedSlider.after}
          </p>
          {skeleton("bg-paper/15")}
          <div className="mt-2 flex items-center gap-3">
            <div className="h-10 w-36 rounded-md bg-teal/70" />
            <div className="h-2 w-1/2 rounded-full bg-paper/15" />
          </div>
        </div>

        {/* BEFORE (slow) — clipped over the base, from the right edge. */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/40">
            {content.speedSlider.before}
          </p>
          {skeleton("bg-paper/10")}
          <div className="mt-2 flex items-center gap-3">
            <div className="h-10 w-36 rounded-md bg-paper/10" />
            <div className="h-3 w-2/3 rounded-full bg-teal/25" />
          </div>
        </div>

        {/* Wipe handle line. */}
        <div
          className="pointer-events-none absolute bottom-0 top-0 w-px bg-teal"
          style={{ left: `${position}%` }}
        />
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label={content.speedSlider.aria}
        className="mt-6 h-9 w-full cursor-ew-resize appearance-none bg-transparent accent-teal"
      />

      <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">
        {content.speedSlider.label}
      </p>
    </div>
  );
}

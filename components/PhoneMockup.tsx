"use client";

import { useEffect, useState } from "react";

/*
  Looped WhatsApp order-flow demo (issue #5), pure CSS/HTML + a small
  interval — generic sample products only (docs/SPEC.md). Decorative:
  aria-hidden, the hero carries the sr-only description. Fixed dimensions
  per breakpoint so the page has zero layout shift (CLS < 0.1).

  Loop: product list -> Add to cart (cart badge appears) -> Order on
  WhatsApp button pressed -> WhatsApp-style chat bubble with the SPEC
  message. Every frame change is a quiet CSS transition using the shared
  motion tokens; prefers-reduced-motion renders the last frame statically.
*/
const FRAME_MS = 1600;
const FRAMES = 4;

export function PhoneMockup() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (reduced.matches) return; // hold the final bubble frame, static
    }
    const timer = window.setInterval(() => {
      setFrame((f) => (f + 1) % FRAMES);
    }, FRAME_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="h-[560px] w-[280px] rounded-[2.25rem] border border-paper/15 bg-paper/5 p-4 md:h-[600px] md:w-[300px]"
    >
      <div className="flex h-full flex-col">
        <div className="mx-auto h-1.5 w-16 rounded-full bg-paper/20" />

        {/* Screen 1: product list (generic samples). */}
        <div
          className={`mt-6 space-y-3 transition-all duration-500 [transition-timing-function:var(--ease-signature)] ${
            frame >= 1 ? "-translate-y-2 opacity-40" : ""
          }`}
        >
          <div className="h-10 w-full rounded-md bg-paper/10" />
          <div className="h-10 w-full rounded-md bg-paper/10" />
          <div className="h-10 w-2/3 rounded-md bg-paper/10" />
        </div>

        {/* Screen 2: cart badge appears after "Add to cart". */}
        <div
          className={`mt-4 flex items-center justify-between transition-opacity duration-500 [transition-timing-function:var(--ease-signature)] ${
            frame >= 1 && frame < 3 ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="font-mono text-[11px] uppercase tracking-widest text-paper/50">
            Cart · 1 item
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal font-mono text-xs text-ink">
            1
          </span>
        </div>

        {/* Screen 3: Order on WhatsApp button pressed. */}
        <div className="mt-auto space-y-3">
          <div
            className={`h-10 w-full rounded-md bg-teal/25 transition-opacity duration-500 [transition-timing-function:var(--ease-signature)] ${
              frame < 3 ? "opacity-100" : "opacity-30"
            }`}
          />
        </div>

        {/* Screen 4: WhatsApp-style chat bubble. */}
        <div
          className={`mt-3 w-fit max-w-full rounded-xl rounded-bl-sm bg-paper/90 px-3 py-2 text-xs leading-snug text-ink transition-all duration-500 [transition-timing-function:var(--ease-signature)] ${
            frame >= 3 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          Hi! I&apos;d like to order: 1 x Sample item. Cash on delivery.
        </div>
      </div>
    </div>
  );
}

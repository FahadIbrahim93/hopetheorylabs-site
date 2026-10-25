"use client";

import { useEffect, useRef } from "react";

import { NODE_COLORS, nodeSide } from "./nodes";
import { useContent } from "../LanguageProvider";
import { experienceActions, getDiscrete, onSceneFrame } from "./store";

/*
  Flow-section node labels (.flow-node), monogram and caption — ported from
  the supplied concept page. Updated via the scene frame bridge (no per-frame
  React renders).
*/

export function NodeLabels() {
  const content = useContent();
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const monoRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return onSceneFrame(({ nodes, labelOpacity, flowActive: active, monogram, caption }) => {
      root.style.visibility = labelOpacity > 0.02 || active ? "visible" : "hidden";
      root.removeAttribute("aria-hidden");
      if (!active) root.setAttribute("aria-hidden", "true");

      const mono = monoRef.current;
      if (mono) {
        mono.style.opacity = monogram.opacity.toFixed(3);
        mono.style.transform = `translate(${monogram.x.toFixed(1)}px, ${monogram.y.toFixed(1)}px) translate(-50%, -50%)`;
      }

      const cap = capRef.current;
      if (cap) {
        const show = caption >= 0 && active;
        cap.style.opacity = show ? "1" : "0";
        if (show) {
          cap.textContent = content.hero.coreNodeDetails[caption] ?? "";
          cap.style.transform = `translate(${monogram.x.toFixed(1)}px, ${(monogram.y + window.innerHeight * 0.2).toFixed(1)}px) translate(-50%, 0)`;
        }
      }

      const focused = getDiscrete().focusNode;
      for (let i = 0; i < nodes.length; i++) {
        const el = itemRefs.current[i];
        const node = nodes[i];
        if (!el) continue;
        const side = nodeSide(i);
        const offset = side < 0 ? "calc(-100% + 25px)" : "-25px";
        el.style.transform = `translate(${node.x.toFixed(1)}px, ${node.y.toFixed(1)}px) translate(${offset}, -50%)`;
        el.style.opacity = (node.visible ? labelOpacity : 0).toFixed(3);
        const interactive = active && labelOpacity > 0.5;
        el.tabIndex = interactive ? 0 : -1;
        el.style.pointerEvents = interactive ? "auto" : "none";
        el.classList.toggle("is-on", focused === i);
        if (!interactive && focused === i) experienceActions.setFocusNode(-1);
      }
    });
  }, [content.hero.coreNodeDetails]);

  return (
    <div ref={rootRef} className="flow-label-layer" aria-hidden="true">
      {content.hero.coreNodes.map((name, i) => (
        <button
          key={name}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          type="button"
          className={`flow-node${nodeSide(i) < 0 ? " flow-node-left" : " flow-node-right"}`}
          style={{ "--node-color": NODE_COLORS[i] } as React.CSSProperties}
          onPointerEnter={() => experienceActions.setFocusNode(i)}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse" && getDiscrete().focusNode === i) experienceActions.setFocusNode(-1);
          }}
          onFocus={() => experienceActions.setFocusNode(i)}
          onBlur={() => {
            if (getDiscrete().focusNode === i) experienceActions.setFocusNode(-1);
          }}
          onClick={() => experienceActions.setFocusNode(i)}
        >
          {nodeSide(i) < 0 ? (
            <>
              {name}
              <i aria-hidden="true" />
            </>
          ) : (
            <>
              <i aria-hidden="true" />
              {name}
            </>
          )}
        </button>
      ))}
      <div ref={monoRef} className="flow-monogram" aria-hidden="true">
        H
      </div>
      <p ref={capRef} className="flow-caption" aria-live="polite" />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

import { useContent } from "../LanguageProvider";
import { activeNode, experienceActions, getDiscrete, onSceneFrame } from "./store";

/*
  HTML labels that ride on the projected 3D source nodes. Real text (crisp,
  zoomable, translatable) rather than textures, updated by direct DOM writes
  from the scene's frame bridge, so no React render happens per frame. They
  are pointer targets for mouse and touch; keyboard users get the same
  selection through the accessible legend in the living-platform section, so
  this overlay is hidden from assistive technology.
*/

export function NodeLabels() {
  const content = useContent();
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let shown = true;
    return onSceneFrame(({ nodes, labelOpacity }) => {
      const visible = labelOpacity > 0.04;
      if (visible !== shown) {
        shown = visible;
        root.style.visibility = visible ? "visible" : "hidden";
      }
      if (!visible) return;
      const focused = activeNode();
      const { selectedNode: selected, focusSource } = getDiscrete();
      for (let i = 0; i < nodes.length; i++) {
        const el = itemRefs.current[i];
        const node = nodes[i];
        if (!el) continue;
        const scale = 0.82 + node.depth * 0.3;
        el.style.transform = `translate3d(${node.x.toFixed(1)}px, ${(node.y + 16 + node.labelShift).toFixed(1)}px, 0) translate(-50%, 0) scale(${scale.toFixed(3)})`;
        const occlusion = node.behindCore ? 0.25 : 1;
        const alpha = node.visible ? labelOpacity * (0.3 + 0.7 * node.depth) * occlusion : 0;
        el.style.opacity = (focused === i ? Math.max(alpha, labelOpacity) : alpha).toFixed(3);
        el.style.pointerEvents = alpha > 0.15 ? "auto" : "none";
        // The tooltip only appears for scene-originated focus; legend focus
        // already shows the same detail text next to the legend.
        const state = focused === i ? (focusSource === "legend" ? "focus-quiet" : "focus") : selected === i ? "selected" : "";
        if (el.dataset.state !== state) el.dataset.state = state;
        const side = node.x > window.innerWidth * 0.6 ? "left" : node.x < window.innerWidth * 0.4 ? "right" : "center";
        if (el.dataset.side !== side) el.dataset.side = side;
      }
    });
  }, []);

  return (
    <div ref={rootRef} className="node-labels" aria-hidden="true">
      {content.hero.coreNodes.map((name, i) => (
        <button
          key={name}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          type="button"
          tabIndex={-1}
          className="node-label"
          onPointerEnter={(event) => {
            if (event.pointerType === "touch") return;
            experienceActions.setFocusNode(i);
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "touch") return;
            if (getDiscrete().focusNode === i) experienceActions.setFocusNode(-1);
          }}
          onClick={() => {
            const next = getDiscrete().selectedNode === i ? -1 : i;
            experienceActions.setSelectedNode(next);
          }}
        >
          <span className="node-label-name">{name}</span>
          <span className="node-label-tip">{content.hero.coreNodeDetails[i]}</span>
        </button>
      ))}
    </div>
  );
}

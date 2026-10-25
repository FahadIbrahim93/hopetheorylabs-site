"use client";

import { useSyncExternalStore } from "react";

import { activeNode, experienceActions, getDiscrete, subscribeDiscrete } from "./experience/store";
import { useContent } from "./LanguageProvider";

/*
  Act III: the living business constellation. The 3D scene composes the eight
  source nodes and their connections into the reserved stage; this legend is
  the accessible, keyboard-operable way to inspect each source. Hover/focus
  previews a source, click/tap pins it. The same selection drives the scene's
  highlighted edge and the projected labels.
*/
export function LivingFlow() {
  const { story, hero } = useContent();
  const active = useSyncExternalStore(subscribeDiscrete, activeNode, () => -1);
  const selected = useSyncExternalStore(subscribeDiscrete, () => getDiscrete().selectedNode, () => -1);

  return <section id="flow" className="flow-section border-b border-paper/10" aria-labelledby="flow-heading">
    <div className="flow-inner">
      <div className="flow-copy">
        <p className="eyebrow">{story.flowEyebrow}</p>
        <h2 id="flow-heading">{story.flowHeading}</h2>
        <p>{story.flowText}</p>
        <div className="flow-pills">{story.flowItems.map((item, i) => <div className="flow-pill" key={item.title}><span className="flow-index">0{i + 1}</span><b>{item.title}</b><span>{item.text}</span></div>)}</div>
      </div>
      <div className="flow-stage">
        <div className="scene-slot flow-visual" data-scene-anchor="flow" aria-hidden="true" />
        <div className="source-legend">
          <p className="legend-hint" id="legend-hint">{story.flowHint}</p>
          <ul className="legend-list" aria-labelledby="legend-hint">
            {hero.coreNodes.map((name, i) => <li key={name}>
              <button
                type="button"
                className={`legend-item${active === i ? " is-active" : ""}`}
                aria-pressed={selected === i}
                onPointerEnter={(event) => { if (event.pointerType !== "touch") experienceActions.setFocusNode(i); }}
                onPointerLeave={(event) => { if (event.pointerType !== "touch" && getDiscrete().focusNode === i) experienceActions.setFocusNode(-1); }}
                onFocus={() => experienceActions.setFocusNode(i)}
                onBlur={() => { if (getDiscrete().focusNode === i) experienceActions.setFocusNode(-1); }}
                onClick={() => experienceActions.setSelectedNode(selected === i ? -1 : i)}
              >
                <i aria-hidden="true" />{name}
              </button>
            </li>)}
          </ul>
          <p className="legend-detail" aria-live="polite">
            {active >= 0 && <><b>{hero.coreNodes[active]}</b> — {hero.coreNodeDetails[active]}</>}
          </p>
        </div>
      </div>
    </div>
  </section>;
}

"use client";

import { useEffect, useState } from "react";

import { useExperienceMode } from "./experience/Experience";
import { onSceneHud } from "./experience/store";

const fallback = { label: "Scattered", barWidth: 0 };

export function StateHud() {
  const mode = useExperienceMode();
  const [stage, setStage] = useState(fallback);

  useEffect(() => {
    if (mode === "webgl") {
      return onSceneHud((snap) => setStage(snap));
    }
    if (typeof IntersectionObserver === "undefined") return;
    const stages = [
      { id: "top", label: "Scattered", progress: 0.08 },
      { id: "method", label: "Structured", progress: 0.35 },
      { id: "flow", label: "Alive", progress: 0.65 },
      { id: "contact", label: "Alive", progress: 1 },
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const next = stages.find((s) => s.id === visible?.target.id);
        if (next) setStage({ label: next.label, barWidth: next.progress });
      },
      { threshold: [0.2, 0.45] },
    );
    stages.forEach((s) => {
      const node = document.getElementById(s.id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [mode]);

  return (
    <aside className="state-hud" aria-hidden="true">
      State
      <br />
      <b>{stage.label}</b>
      <div className="state-bar">
        <i style={{ width: `${Math.min(100, stage.barWidth * 100)}%` }} />
      </div>
    </aside>
  );
}

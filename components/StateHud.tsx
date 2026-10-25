"use client";
import { useEffect, useState } from "react";
const stages = [
  { id: "top", label: "Scattered", progress: "16%" },
  { id: "method", label: "Mapping", progress: "32%" },
  { id: "shift", label: "Connecting", progress: "48%" },
  { id: "flow", label: "Flowing", progress: "64%" },
  { id: "how", label: "Integrating", progress: "80%" },
  { id: "services", label: "Intelligent", progress: "100%" },
];
export function StateHud() {
  const [stage, setStage] = useState(stages[0]);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const next = stages.find((item) => item.id === visible?.target.id);
      if (next) setStage(next);
    }, { threshold: [0.15, 0.35, 0.55] });
    stages.forEach((item) => { const node = document.getElementById(item.id); if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, []);
  return <aside className="state-hud" aria-hidden="true">State<br/><b>{stage.label}</b><div className="state-bar"><i style={{ width: stage.progress }} /></div></aside>;
}

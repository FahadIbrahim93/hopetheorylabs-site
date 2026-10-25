"use client";

import type { PointerEvent } from "react";

import { useContent } from "./LanguageProvider";

/*
  Hope Theory Labs intelligence core.
  Built from inline SVG + CSS (no 3D runtime or external assets) to preserve
  the supplied concept's orbiting wireframe, radar sweep, signal paths and
  eight connected source nodes while respecting the site's performance budget.
*/
const nodes = [
  { x: 320, y: 62, lx: 320, ly: 34, anchor: "middle" as const },
  { x: 500, y: 132, lx: 518, ly: 126, anchor: "start" as const },
  { x: 548, y: 292, lx: 570, ly: 296, anchor: "start" as const },
  { x: 476, y: 450, lx: 496, ly: 474, anchor: "start" as const },
  { x: 320, y: 518, lx: 320, ly: 550, anchor: "middle" as const },
  { x: 164, y: 450, lx: 144, ly: 474, anchor: "end" as const },
  { x: 92, y: 292, lx: 70, ly: 296, anchor: "end" as const },
  { x: 140, y: 132, lx: 122, ly: 126, anchor: "end" as const },
];

export function IntelligenceCore() {
  const content = useContent();

  function respondToPointer(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    element.style.setProperty("--core-tilt-x", `${-y * 5}deg`);
    element.style.setProperty("--core-tilt-y", `${x * 6}deg`);
  }

  function resetPointer(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--core-tilt-x", "0deg");
    event.currentTarget.style.setProperty("--core-tilt-y", "0deg");
  }

  return (
    <div
      className="intelligence-core relative mx-auto w-full max-w-[570px]"
      onPointerMove={respondToPointer}
      onPointerLeave={resetPointer}
      aria-hidden="true"
    >
      <div className="core-aura" />
      <svg
        className="core-art relative z-[1] block h-auto w-full overflow-visible"
        viewBox="0 0 640 590"
        fill="none"
        role="presentation"
      >
        <defs>
          <radialGradient id="core-sphere-fill" cx="0" cy="0" r="1" gradientTransform="translate(292 258) rotate(49) scale(184)">
            <stop stopColor="#F4E6C3" stopOpacity=".92" />
            <stop offset=".22" stopColor="#B99A5B" stopOpacity=".72" />
            <stop offset=".56" stopColor="#1C4A49" stopOpacity=".68" />
            <stop offset="1" stopColor="#0F1B2D" stopOpacity=".08" />
          </radialGradient>
          <linearGradient id="core-scan-gradient" x1="320" y1="170" x2="320" y2="430" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D8C18A" stopOpacity="0" />
            <stop offset=".5" stopColor="#D8C18A" stopOpacity=".32" />
            <stop offset="1" stopColor="#14B8A6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="core-link-gradient" x1="100" y1="90" x2="540" y2="500" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D8C18A" stopOpacity=".08" />
            <stop offset=".5" stopColor="#14B8A6" stopOpacity=".8" />
            <stop offset="1" stopColor="#D8C18A" stopOpacity=".12" />
          </linearGradient>
          <clipPath id="core-sphere-clip">
            <circle cx="320" cy="292" r="118" />
          </clipPath>
        </defs>

        {/* Orbit rings and calibration ticks */}
        <g className="core-orbit" stroke="#D8C18A" strokeOpacity=".26">
          <ellipse cx="320" cy="292" rx="210" ry="86" transform="rotate(-28 320 292)" />
          <ellipse cx="320" cy="292" rx="210" ry="86" transform="rotate(52 320 292)" />
          <ellipse cx="320" cy="292" rx="170" ry="226" transform="rotate(12 320 292)" strokeOpacity=".13" />
          <circle cx="320" cy="292" r="148" stroke="#14B8A6" strokeOpacity=".28" strokeDasharray="2 9" />
        </g>

        {/* Eight signal routes converge on the central intelligence core. */}
        <g stroke="url(#core-link-gradient)" strokeWidth="1.2">
          {nodes.map((node, index) => (
            <path key={index} d={`M ${node.x} ${node.y} Q ${(node.x + 320) / 2 + (index % 2 ? 22 : -22)} ${(node.y + 292) / 2} 320 292`} />
          ))}
        </g>
        <g stroke="#14B8A6" strokeOpacity=".45" strokeWidth="1">
          {nodes.map((node, index) => (
            <circle key={index} cx={(node.x + 320) / 2} cy={(node.y + 292) / 2} r="2" className="core-signal" style={{ animationDelay: `${index * 180}ms` }} />
          ))}
        </g>

        {/* Central wireframe intelligence sphere */}
        <circle cx="320" cy="292" r="118" fill="url(#core-sphere-fill)" stroke="#D8C18A" strokeOpacity=".75" />
        <g clipPath="url(#core-sphere-clip)" stroke="#D8C18A" strokeOpacity=".45" strokeWidth=".8">
          <ellipse cx="320" cy="292" rx="118" ry="35" />
          <ellipse cx="320" cy="292" rx="118" ry="70" />
          <ellipse cx="320" cy="292" rx="35" ry="118" />
          <ellipse cx="320" cy="292" rx="70" ry="118" />
          <ellipse cx="320" cy="292" rx="118" ry="50" transform="rotate(58 320 292)" />
          <ellipse cx="320" cy="292" rx="118" ry="50" transform="rotate(-58 320 292)" />
          <path d="M202 292H438M320 174V410" strokeOpacity=".7" />
        </g>
        <circle cx="320" cy="292" r="128" stroke="#14B8A6" strokeOpacity=".38" strokeDasharray="1 7" />
        <g className="core-radar">
          <path d="M320 292 L320 170 A122 122 0 0 1 414 214 Z" fill="url(#core-scan-gradient)" />
          <path d="M320 292 L320 170" stroke="#D8C18A" strokeOpacity=".8" strokeWidth="1" />
        </g>
        <circle cx="320" cy="292" r="7" fill="#E8D5A5" />
        <circle cx="320" cy="292" r="15" stroke="#E8D5A5" strokeOpacity=".6" />
        <circle cx="320" cy="292" r="23" stroke="#14B8A6" strokeOpacity=".45" strokeDasharray="2 5" />

        {/* Source nodes */}
        {nodes.map((node, index) => (
          <g key={content.hero.coreNodes[index]}>
            <circle cx={node.x} cy={node.y} r="15" fill="#0F1B2D" stroke="#D8C18A" strokeOpacity=".6" />
            <circle cx={node.x} cy={node.y} r="5" fill="#14B8A6" />
            <circle cx={node.x} cy={node.y} r="21" stroke="#14B8A6" strokeOpacity=".22" strokeDasharray="2 5" />
            <text
              x={node.lx}
              y={node.ly}
              textAnchor={node.anchor}
              fill="#F8FAFC"
              fillOpacity=".82"
              fontSize="11"
              letterSpacing="1.5"
              fontFamily="var(--font-jetbrains-mono), monospace"
            >
              {content.hero.coreNodes[index].toUpperCase()}
            </text>
          </g>
        ))}
        <path d="M320 26V12M320 570V558M54 292H42M598 292H586" stroke="#D8C18A" strokeOpacity=".65" />
        <circle cx="320" cy="12" r="2" fill="#D8C18A" />
        <circle cx="42" cy="292" r="2" fill="#14B8A6" />
        <circle cx="598" cy="292" r="2" fill="#14B8A6" />
      </svg>
      <div className="core-caption relative z-[1] mx-auto mt-[-2px] flex max-w-[360px] items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50">
        <span className="h-px flex-1 bg-paper/15" />
        <span>{content.hero.coreCaption}</span>
        <span className="h-px flex-1 bg-paper/15" />
      </div>
    </div>
  );
}

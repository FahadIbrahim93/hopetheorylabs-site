"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import type { AssistantCopy } from "@/content/types";
import "./assistant.css";

// The panel is a separate chunk: it is only fetched when the bubble is used,
// so the first paint and the Lighthouse budget stay as they are.
const Panel = dynamic(() => import("./AssistantPanel"), { ssr: false });

export interface AssistantLauncherProps {
  copy: AssistantCopy;
  whatsapp: string;
  email: string;
  calcomUrl?: string;
}

export function AssistantLauncher({ copy, whatsapp, email, calcomUrl }: AssistantLauncherProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const preload = () => {
    void import("./AssistantPanel");
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="asst-b"
        aria-label={copy.open}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        onPointerEnter={preload}
        onFocus={preload}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4.5 5.5h15v10.5h-9.6L4.5 20V5.5z" />
          <path d="M8.5 10.2h7M8.5 13.2h4.5" />
        </svg>
      </button>
      {open ? (
        <Panel
          copy={copy}
          whatsapp={whatsapp}
          email={email}
          calcomUrl={calcomUrl}
          onClose={() => {
            setOpen(false);
            buttonRef.current?.focus();
          }}
        />
      ) : null}
    </>
  );
}

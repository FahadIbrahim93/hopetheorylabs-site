"use client";

import { useLang, useContent } from "./LanguageProvider";

/*
  EN / বাংলা segmented toggle (issue #3).
  Two real buttons, each with aria-pressed and its own accessible name, so
  it is keyboard operable and state is announced. Copy for the labels is
  fixed script text, not translatable copy.
*/
export function LanguageToggle() {
  const { lang, setLang } = useLang();
  const content = useContent();

  return (
    <span
      role="group"
      aria-label={content.header.language}
      className="inline-flex items-center rounded-md border border-paper/15 p-0.5 font-mono text-xs"
    >
      <button
        type="button"
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
        className={`min-h-9 rounded px-2 uppercase tracking-widest transition-colors ${
          lang === "en" ? "bg-paper/10 text-paper" : "text-paper/50 hover:text-paper"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        aria-pressed={lang === "bn"}
        lang="bn"
        onClick={() => setLang("bn")}
        className={`min-h-9 rounded px-2 font-bangla transition-colors ${
          lang === "bn" ? "bg-paper/10 text-paper" : "text-paper/50 hover:text-paper"
        }`}
      >
        বাংলা
      </button>
    </span>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { en } from "@/content/en";
import type { SiteContent } from "@/content/types";

export type Lang = "en" | "bn";

const LANG_STORAGE_KEY = "htl-lang";
/* Only the active language ships: Bangla copy is a separate chunk fetched on demand. */
let bnCache: SiteContent | null = null;
const loadBn = () => import("@/content/bn").then((m) => (bnCache = m.bn));

/*
  Tiny external store over localStorage (issue #3). useSyncExternalStore is
  the SSR-safe pattern: the server snapshot is the prerendered "en" page,
  hydration renders the same, and the saved choice applies right after with
  no hydration mismatch and no setState-in-effect (the useState version
  failed the react-hooks/set-state-in-effect rule).
*/
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Lang {
  try {
    return window.localStorage.getItem(LANG_STORAGE_KEY) === "bn" ? "bn" : "en";
  } catch {
    return "en"; // private mode / storage disabled
  }
}

function getServerSnapshot(): Lang {
  return "en";
}

/* Persist + switch <html lang>, then notify subscribers (same-tab updates). */
function setLangEverywhere(lang: Lang) {
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // storage disabled — switching still works for the session
  }
  document.documentElement.lang = lang;
  for (const notify of listeners) notify();
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  content: SiteContent;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Keeps <html lang> in sync with the restored/toggled choice.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const [bn, setBn] = useState<SiteContent | null>(bnCache);
  useEffect(() => {
    if (lang !== "bn" || bn) return;
    let cancelled = false;
    loadBn().then((content) => {
      if (!cancelled) setBn(content);
    });
    return () => {
      cancelled = true;
    };
  }, [lang, bn]);

  const setLang = useCallback((next: Lang) => setLangEverywhere(next), []);
  // Until the Bangla chunk arrives, keep showing English (and lang stays "en" for data-lang).
  const activeLang: Lang = lang === "bn" && bn ? "bn" : "en";
  const content = activeLang === "bn" && bn ? bn : en;

  return (
    <LanguageContext.Provider value={{ lang: activeLang, setLang, content }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useContent(): SiteContent {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useContent must be used inside <LanguageProvider>");
  return ctx.content;
}

export function useLang(): { lang: Lang; setLang: (lang: Lang) => void } {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return { lang: ctx.lang, setLang: ctx.setLang };
}

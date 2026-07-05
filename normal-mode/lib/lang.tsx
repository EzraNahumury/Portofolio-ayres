"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Globe } from "lucide-react";

/**
 * Site language for Normal Mode. Shares the same localStorage key as the
 * retro site's i18n ("ayres-lang"), so switching language in one mode
 * carries over to the other. Default: Indonesian.
 */

export type Lang = "id" | "en";
const STORE_KEY = "ayres-lang";

const LangCtx = createContext<{ lang: Lang; toggle: () => void }>({
  lang: "id",
  toggle: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  // Deterministic initial value for the static export; the stored choice is
  // applied after mount.
  const [lang, setLang] = useState<Lang>("id");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved === "en" || saved === "id") setLang(saved);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggle = () => {
    setLang((prev) => {
      const next = prev === "id" ? "en" : "id";
      try {
        localStorage.setItem(STORE_KEY, next);
      } catch {
        /* non-fatal */
      }
      return next;
    });
  };

  return <LangCtx.Provider value={{ lang, toggle }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}

/** Picks the right variant from a { id, en } pair. */
export function usePick() {
  const { lang } = useLang();
  return <T,>(pair: { id: T; en: T }): T => (lang === "en" ? pair.en : pair.id);
}

/** Round pill that toggles the language — sits beside the Retro Mode CTA. */
export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, toggle } = useLang();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Ganti bahasa / Switch language"
      title="Bahasa / Language"
      className={`inline-flex items-center gap-2 rounded-full border border-border-strong bg-white/[0.04] px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-white/[0.09] ${className}`}
    >
      <Globe className="size-4" aria-hidden />
      <span className="min-w-[20px] text-center tracking-wide">
        {lang.toUpperCase()}
      </span>
    </button>
  );
}

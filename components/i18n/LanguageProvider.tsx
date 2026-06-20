"use client";

import { createContext, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  translate,
  LANG_COOKIE,
  type Lang,
  type TranslationKey,
} from "@/lib/i18n/translate";

interface LanguageContextValue {
  lang: Lang;
  t: (key: TranslationKey) => string;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Wraps the app with the active language (provided by the server from the
 * cookie). Switching writes the cookie and refreshes so server components
 * re-render in the new language.
 */
export function LanguageProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const setLang = useCallback(
    (next: Lang) => {
      // 1 year, site-wide cookie so server components can read it.
      document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      router.refresh();
    },
    [router],
  );

  const t = useCallback((key: TranslationKey) => translate(lang, key), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

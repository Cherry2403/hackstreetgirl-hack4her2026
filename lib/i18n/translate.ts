import { dictionary, type Lang, type TranslationKey, LANGS } from "./dictionary";

export const DEFAULT_LANG: Lang = "nl";
export const LANG_COOKIE = "bol_lang";

export function isLang(value: string | undefined | null): value is Lang {
  return value === "nl" || value === "en";
}

export function normalizeLang(value: string | undefined | null): Lang {
  return isLang(value) ? value : DEFAULT_LANG;
}

/** Translate a key for a given language. Falls back to the key itself. */
export function translate(lang: Lang, key: TranslationKey): string {
  const entry = dictionary[key];
  if (!entry) return key;
  return entry[lang] ?? entry[DEFAULT_LANG] ?? key;
}

/** Translate and interpolate {placeholders} from the params object. */
export function translateFormat(
  lang: Lang,
  key: TranslationKey,
  params: Record<string, string | number>,
): string {
  let out = translate(lang, key);
  for (const [k, v] of Object.entries(params)) {
    out = out.replaceAll(`{${k}}`, String(v));
  }
  // collapse any double spaces left by empty placeholders
  return out.replace(/\s{2,}/g, " ").trim();
}

export { LANGS };
export type { Lang, TranslationKey };

import { cookies } from "next/headers";
import {
  normalizeLang,
  translate,
  LANG_COOKIE,
  type Lang,
  type TranslationKey,
} from "./translate";

/** Read the active language from the request cookie (server components). */
export async function getLang(): Promise<Lang> {
  const store = await cookies();
  return normalizeLang(store.get(LANG_COOKIE)?.value);
}

/**
 * Server-side translator. Returns the active language plus a bound `t()`.
 *
 *   const { t, lang } = await getT();
 *   <h1>{t("home.heroTitle")}</h1>
 */
export async function getT(): Promise<{
  lang: Lang;
  t: (key: TranslationKey) => string;
}> {
  const lang = await getLang();
  return { lang, t: (key) => translate(lang, key) };
}

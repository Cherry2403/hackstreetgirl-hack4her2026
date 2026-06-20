"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translate";

const OPTIONS: { value: string; key: TranslationKey }[] = [
  { value: "relevance", key: "sort.relevance" },
  { value: "popular", key: "sort.popular" },
  { value: "price-asc", key: "sort.priceAsc" },
  { value: "price-desc", key: "sort.priceDesc" },
  { value: "rating", key: "sort.rating" },
  { value: "sustainability", key: "sort.sustainability" },
  { value: "lifespan", key: "sort.lifespan" },
  { value: "value", key: "sort.value" },
  { value: "combined", key: "sort.combined" },
];

export default function SortSelect({ current }: { current: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "relevance") params.delete("sort");
    else params.set("sort", value);
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-zinc-500">{t("search.sort")}</span>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-bol-border bg-white px-3 py-1.5 font-medium outline-none focus:ring-2 focus:ring-bol-blue"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {t(o.key)}
          </option>
        ))}
      </select>
    </label>
  );
}

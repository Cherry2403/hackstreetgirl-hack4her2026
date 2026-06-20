"use client";

import { useCompare, type CompareItem } from "./CompareContext";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/** Per-product "Compare with other articles" checkbox used on result rows. */
export default function CompareCheckbox({ item }: { item: CompareItem }) {
  const { has, toggle, isFull } = useCompare();
  const { t } = useLanguage();
  const checked = has(item.id);
  const disabled = !checked && isFull;

  return (
    <label
      className={`flex w-fit cursor-pointer items-center gap-2 text-sm ${
        disabled ? "cursor-not-allowed text-zinc-300" : "text-zinc-700"
      }`}
      title={disabled ? t("compare.max") : undefined}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={() => toggle(item)}
        className="h-4 w-4 accent-bol-blue"
      />
      {t("search.compareRow")}
    </label>
  );
}

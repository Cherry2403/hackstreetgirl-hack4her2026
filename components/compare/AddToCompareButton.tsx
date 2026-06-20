"use client";

import { useCompare, type CompareItem } from "./CompareContext";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/** "Compare with other articles" toggle for the product detail page. */
export default function AddToCompareButton({ item }: { item: CompareItem }) {
  const { has, toggle, isFull } = useCompare();
  const { t } = useLanguage();
  const checked = has(item.id);
  const disabled = !checked && isFull;

  return (
    <button
      onClick={() => toggle(item)}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 text-sm font-medium ${
        checked
          ? "text-bol-green"
          : disabled
            ? "cursor-not-allowed text-zinc-300"
            : "text-bol-link hover:underline"
      }`}
      title={disabled ? t("compare.max") : undefined}
    >
      <CompareIcon className="h-4 w-4" />
      {checked ? t("product.addedToCompare") : t("product.compareLink")}
    </button>
  );
}

function CompareIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M4 7h6M4 7l2-2M4 7l2 2M20 17h-6M20 17l-2-2M20 17l-2 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 7h6M4 17h6" strokeLinecap="round" />
    </svg>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { productImage } from "@/lib/format";
import { formatEuro } from "@/lib/format";
import { useCompare, MAX_COMPARE } from "./CompareContext";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/** Floating "Compare articles (n/4)" tray, fixed bottom-right. */
export default function CompareTray() {
  const { items, remove, clear } = useCompare();
  const { t } = useLanguage();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  if (items.length === 0) return null;

  const roomLeft = MAX_COMPARE - items.length;

  return (
    <div className="fixed bottom-0 right-0 z-50 w-[340px] max-w-[calc(100vw-1rem)] overflow-hidden rounded-t-xl border border-bol-border bg-white shadow-2xl sm:bottom-4 sm:right-4 sm:rounded-xl">
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center justify-between bg-bol-blue px-4 py-3 text-white"
      >
        <span className="text-base font-bold">
          {t("compare.tray")} ({items.length}/{MAX_COMPARE})
        </span>
        <ChevronIcon
          className={`h-5 w-5 transition-transform ${collapsed ? "" : "rotate-180"}`}
        />
      </button>

      {!collapsed && (
        <div className="p-3">
          <ul>
            {items.map((item) => {
              const { whole, fraction } = formatEuro(item.price);
              return (
                <li
                  key={item.id}
                  className="flex items-center gap-3 border-b border-bol-border py-3 last:border-0"
                >
                  <img
                    src={productImage(item.id, item.name)}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded bg-bol-gray object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-bold leading-tight">
                      {item.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1 text-bol-yellow-dark">
                      <Stars rating={item.rating} />
                      <span className="text-xs text-zinc-500">
                        ({item.reviewCount})
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm font-bold text-[#e2240f]">
                      {whole},{fraction}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    aria-label={t("compare.remove")}
                    className="shrink-0 text-zinc-400 hover:text-zinc-700"
                  >
                    <CloseCircleIcon className="h-6 w-6" />
                  </button>
                </li>
              );
            })}
          </ul>

          {roomLeft > 0 && (
            <p className="my-3 rounded-lg bg-bol-gray py-3 text-center text-sm text-zinc-600">
              {t("compare.roomFor")} {roomLeft}{" "}
              {roomLeft === 1 ? t("compare.article") : t("compare.articles")}.
            </p>
          )}

          <button
            disabled={items.length < 2}
            onClick={() =>
              router.push(`/compare?ids=${items.map((i) => i.id).join(",")}`)
            }
            className="w-full rounded-full bg-bol-blue py-3 font-bold text-white transition-colors hover:bg-bol-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("compare.cta")}
          </button>
          <button
            onClick={clear}
            className="mt-2 w-full text-center text-xs text-zinc-400 hover:text-zinc-600 hover:underline"
          >
            {t("compare.clearList")}
          </button>
        </div>
      )}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className="relative inline-block text-xs leading-none">
      <span className="text-bol-border">★★★★★</span>
      <span
        className="absolute left-0 top-0 overflow-hidden text-bol-yellow-dark"
        style={{ width: `${pct}%` }}
      >
        ★★★★★
      </span>
    </span>
  );
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className={className}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CloseCircleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" strokeLinecap="round" />
    </svg>
  );
}

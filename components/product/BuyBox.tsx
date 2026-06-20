"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import Price from "@/components/Price";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/** bol-style right-hand purchase column. */
export default function BuyBox({ product }: { product: Product }) {
  const { t } = useLanguage();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const delivery = product.sameDay
    ? t("buy.deliveryToday")
    : product.nextDay
      ? t("buy.deliveryTomorrow")
      : t("buy.deliveryStandard");

  return (
    <div className="rounded-xl border border-bol-border bg-white p-4">
      <Price amount={product.price} size="lg" className="text-[#e2240f]" />

      <p className="mt-2 flex items-center gap-1 text-sm text-bol-green">
        <ClockIcon className="h-4 w-4" /> {delivery}
      </p>

      <div className="mt-3 text-sm text-zinc-600">
        <p>
          {t("common.soldBy")}{" "}
          <span className="font-medium text-bol-ink">
            {product.warehouseName || "bol"}
          </span>
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs">
          <CheckIcon className="h-3.5 w-3.5 text-bol-green" /> {t("buy.returns")}
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs">
          <CheckIcon className="h-3.5 w-3.5 text-bol-green" />{" "}
          {t("buy.shippingIncluded")}
        </p>
      </div>

      {/* Quantity */}
      <label className="mt-4 block text-sm">
        <span className="mb-1 block text-zinc-500">{t("buy.quantity")}</span>
        <select
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-full rounded-md border border-bol-border px-3 py-2 outline-none focus:ring-2 focus:ring-bol-blue"
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <button
        onClick={() => {
          setAdded(true);
          setTimeout(() => setAdded(false), 1800);
        }}
        className="mt-3 w-full rounded-full bg-bol-yellow py-3 font-bold text-bol-blue transition-colors hover:bg-bol-yellow-dark"
      >
        {added ? t("common.added") : t("common.addToCart")}
      </button>
      <button className="mt-2 w-full rounded-full border border-bol-blue py-2.5 text-sm font-medium text-bol-blue hover:bg-bol-blue/5">
        {t("buy.wishlist")}
      </button>
    </div>
  );
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className={className}>
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

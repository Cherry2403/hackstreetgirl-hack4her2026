"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const MOCK_ITEM = {
  name: "Hunkemöller Swimsuit Luxury Red",
  seller: "Hunkemöller NL",
  price: 29.99,
  originalPrice: 44.99,
  deliveryDate: "June 25",
  image: "https://u-mercari-images.mercdn.net/photos/m65370248386_2.jpg?1758322022",
};

export default function CartPage() {
  const { t } = useLanguage();
  const [qty, setQty] = useState(1);

  const total = (MOCK_ITEM.price * qty).toFixed(2);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-bol-ink">{t("cart.title")}</h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Cart item */}
        <div className="flex-1">
          <div className="rounded-xl border border-bol-border bg-white p-5">
            <div className="flex gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MOCK_ITEM.image}
                alt={MOCK_ITEM.name}
                className="h-28 w-28 shrink-0 rounded-lg object-cover"
              />
              <div className="flex flex-1 flex-col gap-1">
                <p className="font-semibold text-bol-ink">{MOCK_ITEM.name}</p>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#e2240f]">
                    {MOCK_ITEM.price.toFixed(2)}
                  </span>
                  <span className="rounded bg-[#e2240f] px-1.5 py-0.5 text-xs font-bold text-white">
                    {t("cart.discount")}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  {t("cart.mostly")}{" "}
                  <span className="line-through">{MOCK_ITEM.originalPrice.toFixed(2)}</span>
                </p>

                {/* Qty + actions */}
                <div className="mt-2 flex items-center gap-3">
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="rounded-md border border-bol-border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-bol-blue"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <button className="text-bol-blue hover:opacity-75">
                    <HeartIcon className="h-5 w-5" />
                  </button>
                  <button className="text-zinc-500 hover:text-[#e2240f]">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>

                <p className="mt-1 flex items-center gap-1 text-sm text-bol-green">
                  <CheckCircleIcon className="h-4 w-4" />
                  {t("cart.deliveredBy")} {MOCK_ITEM.deliveryDate}
                </p>
                <p className="text-xs text-zinc-500">
                  {t("cart.salesBy")}{" "}
                  <span className="underline">{MOCK_ITEM.seller}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="w-full lg:w-80">
          <div className="rounded-xl border border-bol-border bg-white p-5">
            <h2 className="mb-4 font-bold text-bol-ink">{t("cart.overview")}</h2>

            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">
                {t("cart.totalItems")} ({qty})
              </span>
              <span className="font-medium">€ {total}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="flex items-center gap-1 text-zinc-600">
                {t("cart.shippingCosts")}
                <InfoIcon className="h-3.5 w-3.5 text-zinc-400" />
              </span>
              <span className="font-medium text-bol-green">€ 0,00</span>
            </div>

            <hr className="my-4 border-bol-border" />

            <div className="mb-4 flex items-start gap-2 rounded-lg bg-bol-gray p-3 text-xs text-zinc-600">
              <GiftIcon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
              <span>{t("cart.giftCard")}</span>
            </div>

            <div className="mb-4 flex justify-between rounded-lg bg-[#fffbe6] px-4 py-3">
              <span className="font-bold text-bol-ink">{t("cart.stillToPay")}</span>
              <span className="font-bold text-bol-ink">€ {total}</span>
            </div>

            <Link
              href="/checkout"
              className="block w-full rounded-full bg-bol-blue py-3 text-center font-bold text-white hover:bg-bol-blue-dark"
            >
              {t("cart.toCheckout")}
            </Link>

            {/* Payment icons */}
            <div className="mt-4 flex items-center justify-center gap-3 opacity-70">
              <IdealIcon />
              <MastercardIcon />
              <VisaIcon />
              <AmexIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Continue shopping */}
      <div className="mt-8">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-full border border-bol-blue px-5 py-2.5 text-sm font-bold text-bol-blue hover:bg-bol-blue/5"
        >
          {t("cart.continueShopping")}
        </Link>
      </div>
    </div>
  );
}

function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  );
}
function TrashIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CheckCircleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function InfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v1M12 12v4" strokeLinecap="round" />
    </svg>
  );
}
function GiftIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <rect x="3" y="8" width="18" height="13" rx="1" />
      <path d="M12 8V21M3 12h18" strokeLinecap="round" />
      <path d="M12 8c0-2 1.5-4 3-4s2 2 0 4M12 8c0-2-1.5-4-3-4s-2 2 0 4" strokeLinecap="round" />
    </svg>
  );
}
function IdealIcon() {
  return (
    <span className="flex h-7 w-10 items-center justify-center rounded border border-zinc-200 bg-white text-xs font-bold text-[#cc0066]">
      iD
    </span>
  );
}
function MastercardIcon() {
  return (
    <span className="flex h-7 w-10 items-center justify-center rounded border border-zinc-200 bg-white">
      <svg viewBox="0 0 38 24" className="h-5 w-8">
        <circle cx="15" cy="12" r="8" fill="#eb001b" />
        <circle cx="23" cy="12" r="8" fill="#f79e1b" />
      </svg>
    </span>
  );
}
function VisaIcon() {
  return (
    <span className="flex h-7 w-10 items-center justify-center rounded border border-zinc-200 bg-white text-xs font-bold text-[#1a1f71]">
      VISA
    </span>
  );
}
function AmexIcon() {
  return (
    <span className="flex h-7 w-10 items-center justify-center rounded border border-zinc-200 bg-[#007bc1] text-[10px] font-bold text-white">
      AMEX
    </span>
  );
}

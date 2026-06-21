"use client";

import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useCart } from "@/components/cart/CartContext";

export default function CartPage() {
  const { t } = useLanguage();
  const { items, removeFromCart, updateQty, totalItems, totalPrice } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-bol-ink">{t("cart.title")}</h1>

      {items.length === 0 ? (
        <div className="rounded-xl border border-bol-border bg-white p-10 text-center">
          <p className="text-lg font-medium text-zinc-500">Your cart is empty.</p>
          <Link
            href="/search"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-bol-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-bol-blue-dark"
          >
            {t("cart.continueShopping")}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Cart items */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl border border-bol-border bg-white p-5">
                <div className="flex gap-4">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-bol-gray text-2xl font-bold text-zinc-400">
                    {item.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="font-semibold text-bol-ink">{item.name}</p>
                    <span className="text-lg font-bold text-[#e2240f]">
                      € {item.price.toFixed(2)}
                    </span>

                    <div className="mt-2 flex items-center gap-3">
                      <select
                        value={item.qty}
                        onChange={(e) => updateQty(item.id, Number(e.target.value))}
                        className="rounded-md border border-bol-border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-bol-blue"
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-400 hover:text-[#e2240f]"
                        aria-label="Remove item"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="w-full lg:w-80">
            <div className="rounded-xl border border-bol-border bg-white p-5">
              <h2 className="mb-4 font-bold text-bol-ink">{t("cart.overview")}</h2>

              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">
                  {t("cart.totalItems")} ({totalItems})
                </span>
                <span className="font-medium">€ {totalPrice.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="flex items-center gap-1 text-zinc-600">
                  {t("cart.shippingCosts")}
                </span>
                <span className="font-medium text-bol-green">€ 0,00</span>
              </div>

              <hr className="my-4 border-bol-border" />

              <div className="mb-4 flex justify-between rounded-lg bg-[#fffbe6] px-4 py-3">
                <span className="font-bold text-bol-ink">{t("cart.stillToPay")}</span>
                <span className="font-bold text-bol-ink">€ {totalPrice.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className="block w-full rounded-full bg-bol-blue py-3 text-center font-bold text-white hover:bg-bol-blue-dark"
              >
                {t("cart.toCheckout")}
              </Link>

              <div className="mt-4 flex items-center justify-center gap-3 opacity-70">
                <IdealIcon />
                <MastercardIcon />
                <VisaIcon />
                <AmexIcon />
              </div>
            </div>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-8">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-full border border-bol-blue px-5 py-2.5 text-sm font-bold text-bol-blue hover:bg-bol-blue/5"
          >
            {t("cart.continueShopping")}
          </Link>
        </div>
      )}
    </div>
  );
}

function TrashIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
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

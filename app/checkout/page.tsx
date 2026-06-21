"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ANIMALS } from "@/lib/animals";
import AnimalUnlockModal from "@/components/animals/AnimalUnlockModal";
import { useCart } from "@/components/cart/CartContext";

type PayMethod = "ideal" | "creditcard" | "paypal";

export default function CheckoutPage() {
  const { t } = useLanguage();
  const { items, totalItems, totalPrice, clear } = useCart();
  const [method, setMethod] = useState<PayMethod>("ideal");
  const [paying, setPaying] = useState(false);
  const [unlockedAnimal, setUnlockedAnimal] = useState<(typeof ANIMALS)[0] | null>(null);

  function handlePay() {
    setPaying(true);
    setTimeout(() => {
      clear();
      setPaying(false);
      const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
      setUnlockedAnimal(animal);
    }, 1800);
  }

  return (
    <>
      {unlockedAnimal && (
        <AnimalUnlockModal
          animal={unlockedAnimal}
          onClose={() => setUnlockedAnimal(null)}
        />
      )}

      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-bol-ink">{t("checkout.title")}</h1>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Left — payment method + delivery */}
          <div className="flex flex-1 flex-col gap-4">

            {/* Delivery address */}
            <div className="rounded-xl border border-bol-border bg-white p-5">
              <h2 className="mb-3 font-bold text-bol-ink">{t("checkout.deliverTo")}</h2>
              <div className="flex items-start gap-3">
                <LocationIcon className="mt-0.5 h-5 w-5 shrink-0 text-bol-blue" />
                <div>
                  <p className="font-medium text-bol-ink">Customer_Name</p>
                  <p className="text-sm text-zinc-500">{t("checkout.address")}</p>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="rounded-xl border border-bol-border bg-white p-5">
              <h2 className="mb-4 font-bold text-bol-ink">{t("checkout.payMethod")}</h2>

              <div className="flex flex-col gap-2">
                {(
                  [
                    { id: "ideal", label: t("checkout.ideal"), icon: <IdealBadge /> },
                    { id: "creditcard", label: t("checkout.creditCard"), icon: <CardBadge /> },
                    { id: "paypal", label: t("checkout.paypal"), icon: <PaypalBadge /> },
                  ] as { id: PayMethod; label: string; icon: React.ReactNode }[]
                ).map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition-colors ${
                      method === opt.id
                        ? "border-bol-blue bg-bol-blue/5"
                        : "border-bol-border hover:border-bol-blue/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymethod"
                      value={opt.id}
                      checked={method === opt.id}
                      onChange={() => setMethod(opt.id)}
                      className="accent-bol-blue"
                    />
                    {opt.icon}
                    <span className="font-medium text-bol-ink">{opt.label}</span>
                  </label>
                ))}
              </div>

              {/* iDEAL bank selector */}
              {method === "ideal" && (
                <select className="mt-4 w-full rounded-lg border border-bol-border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-bol-blue">
                  <option>ABN AMRO</option>
                  <option>ING</option>
                  <option>Rabobank</option>
                  <option>SNS Bank</option>
                  <option>Triodos Bank</option>
                </select>
              )}
            </div>

            {/* Secure payment notice */}
            <div className="flex items-center gap-2 px-1 text-xs text-zinc-500">
              <LockIcon className="h-4 w-4 shrink-0 text-bol-green" />
              {t("checkout.securePayment")}
            </div>
          </div>

          {/* Right — order summary + pay button */}
          <div className="w-full lg:w-80">
            <div className="rounded-xl border border-bol-border bg-white p-5">
              <h2 className="mb-4 font-bold text-bol-ink">{t("checkout.orderSummary")}</h2>

              {/* Product rows */}
              <div className="divide-y divide-bol-border border-b border-bol-border pb-4">
                {items.length === 0 ? (
                  <p className="py-2 text-sm text-zinc-400">No items in cart.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-bol-gray text-sm font-bold text-zinc-400">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <p className="text-sm font-medium leading-snug text-bol-ink line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-xs text-zinc-400">qty {item.qty}</p>
                      </div>
                      <p className="shrink-0 font-bold text-bol-ink">
                        € {(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div className="mt-3 space-y-2 text-sm text-zinc-600">
                <div className="flex justify-between">
                  <span>{t("cart.totalItems")} ({totalItems})</span>
                  <span>€ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("cart.shippingCosts")}</span>
                  <span className="text-bol-green">€ 0,00</span>
                </div>
              </div>

              <div className="my-4 flex justify-between rounded-lg bg-[#fffbe6] px-4 py-3 font-bold text-bol-ink">
                <span>{t("cart.stillToPay")}</span>
                <span>€ {totalPrice.toFixed(2)}</span>
              </div>

              {/* PAY button */}
              <button
                onClick={handlePay}
                disabled={paying || items.length === 0}
                className="w-full rounded-full bg-bol-blue py-3.5 font-bold text-white transition-colors hover:bg-bol-blue-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {paying ? (
                  <span className="flex items-center justify-center gap-2">
                    <SpinnerIcon className="h-4 w-4 animate-spin" />
                    {t("checkout.processing")}
                  </span>
                ) : (
                  t("checkout.pay")
                )}
              </button>

              {/* Payment icons */}
              <div className="mt-4 flex items-center justify-center gap-3 opacity-60">
                <IdealBadge />
                <CardBadge />
                <PaypalBadge />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-bol-blue hover:underline"
          >
            ← Terug naar winkelwagen
          </Link>
        </div>
      </div>
    </>
  );
}

function IdealBadge() {
  return (
    <span className="flex h-7 w-12 items-center justify-center rounded border border-zinc-200 bg-white text-sm font-bold text-[#cc0066]">
      iD
    </span>
  );
}
function CardBadge() {
  return (
    <span className="flex h-7 w-12 items-center justify-center rounded border border-zinc-200 bg-white">
      <svg viewBox="0 0 38 24" className="h-5">
        <circle cx="15" cy="12" r="8" fill="#eb001b" />
        <circle cx="23" cy="12" r="8" fill="#f79e1b" />
      </svg>
    </span>
  );
}
function PaypalBadge() {
  return (
    <span className="flex h-7 w-14 items-center justify-center rounded border border-zinc-200 bg-white text-xs font-extrabold">
      <span className="text-[#003087]">Pay</span>
      <span className="text-[#009cde]">Pal</span>
    </span>
  );
}
function LocationIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M12 21C12 21 5 13.5 5 8a7 7 0 0 1 14 0c0 5.5-7 13-7 13z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="8" r="2.5" />
    </svg>
  );
}
function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
    </svg>
  );
}
function SpinnerIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className}>
      <path d="M12 2a10 10 0 0 1 0 20A10 10 0 0 1 12 2" strokeLinecap="round" opacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}

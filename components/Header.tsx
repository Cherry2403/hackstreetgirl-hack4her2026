"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import HeaderAnimal from "@/components/animals/HeaderAnimal";

const CATEGORIES = [
  "Fitness",
  "Beauty & Skincare",
  "Baby",
  "Electronics",
  "Home & Garden",
  "Fashion",
  "Pet",
  "Eco-Friendly",
  "Digital Goods",
];

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const currentQuery = searchParams.get("q") ?? "";

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const q = String(new FormData(form).get("q") ?? "");
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/search?${params.toString()}`);
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Utility bar */}
      <div className="hidden bg-white text-sm md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <div className="flex items-center gap-6 text-zinc-700">
            <span>{t("util.freeShipping")}</span>
            <span>{t("util.delivery")}</span>
            <span>{t("util.freeReturns")}</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-700">
            <span>
              <b className="font-bold text-bol-green">Select</b>{" "}
              {t("util.selectBenefits")}
            </span>
            <LanguageSwitcher variant="light" />
          </div>
        </div>
      </div>

      {/* Main blue bar */}
      <div className="relative overflow-hidden bg-bol-blue text-white">
        {/* Collectible animal walks here — below logo/search (z-0), above the blue bg */}
        <HeaderAnimal />
        <div className="relative z-10 mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          {/* Logo (white via CSS filter) */}
          <Link href="/" aria-label="bol home" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="bol"
              className="h-13 w-auto brightness-0 invert"
            />
          </Link>

          {/* Search (pill, white background) */}
          <form onSubmit={onSubmit} className="relative flex flex-1">
            <input
              key={currentQuery}
              name="q"
              type="search"
              defaultValue={currentQuery}
              placeholder={t("header.searchPlaceholder")}
              className="w-full rounded-full border-0 bg-white py-2.5 pl-5 pr-14 text-bol-ink outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-bol-yellow"
              aria-label={t("header.search")}
            />
            <button
              type="submit"
              aria-label={t("header.search")}
              className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-bol-blue hover:bg-bol-gray"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
          </form>

          {/* Account / wishlist / cart */}
          <nav className="flex items-center gap-5 text-sm">
            <Link
              href="/account"
              className="flex items-center gap-2 hover:opacity-90"
              aria-label="Account"
            >
              <span className="hidden text-right leading-tight sm:block">
                <span className="block text-xs font-normal">{t("header.welcome")}</span>
                <span className="block font-bold">Customer_Name</span>
              </span>
              <UserIcon className="h-6 w-6" />
            </Link>
            <Link href="/" aria-label={t("header.wishlist")} className="hover:opacity-80">
              <HeartIcon className="h-6 w-6" />
            </Link>
            <Link
              href="/cart"
              aria-label={t("header.cart")}
              className="relative hover:opacity-80"
            >
              <CartIcon className="h-6 w-6" />
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-bol-yellow px-1 text-xs font-bold text-bol-ink">
                1
              </span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Category strip */}
      <div className="border-b border-bol-border bg-white">
        <div className="no-scrollbar mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-2.5 text-sm font-medium">
          <span className="flex shrink-0 items-center gap-1.5 font-bold text-bol-ink">
            <MenuIcon className="h-4 w-4" /> {t("header.allCategories")}
          </span>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/search?category=${encodeURIComponent(c)}`}
              className="shrink-0 whitespace-nowrap text-zinc-700 hover:text-bol-blue hover:underline"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" strokeLinecap="round" />
    </svg>
  );
}
function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  );
}
function CartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="9" cy="20" r="1.6" />
      <circle cx="18" cy="20" r="1.6" />
      <path d="M2 3h3l2.4 12.4a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.5-1.2L22 7H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MenuIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}

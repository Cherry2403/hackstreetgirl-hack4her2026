import Link from "next/link";
import { getT } from "@/lib/i18n/server";
import { translateFormat } from "@/lib/i18n/translate";
import type { TranslationKey } from "@/lib/i18n/translate";
import AnimalCollection from "@/components/animals/AnimalCollection";

export const metadata = { title: "My sphere | bol" };

const CUSTOMER_NAME = "Customer name";

/** Sidebar navigation items (matches bol's "mijn bol" account menu). */
const NAV: { key: TranslationKey; icon: React.ReactNode; active?: boolean }[] = [
  { key: "account.mySphere", icon: <UserIcon />, active: true },
  { key: "account.orders", icon: <BoxIcon /> },
  { key: "account.payInvoices", icon: <InvoiceIcon /> },
  { key: "account.returns", icon: <ReturnIcon /> },
  { key: "account.conversations", icon: <ChatIcon /> },
  { key: "account.dataPreferences", icon: <GearIcon /> },
  { key: "account.giftVouchers", icon: <GiftIcon /> },
  { key: "account.selectKobo", icon: <RefreshIcon /> },
  { key: "account.digitalProducts", icon: <DigitalIcon /> },
  { key: "account.sell", icon: <SellIcon /> },
  { key: "account.logout", icon: <LogoutIcon /> },
];

export default async function AccountPage() {
  const { t, lang } = await getT();
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 md:w-64">
          <ul>
            {NAV.map((item) => (
              <li key={item.key}>
                <Link
                  href="/account"
                  className={`flex items-center gap-3 border-l-2 py-2.5 pl-3 text-[15px] ${
                    item.active
                      ? "border-bol-blue font-bold text-bol-ink"
                      : "border-transparent text-zinc-700 hover:text-bol-blue"
                  }`}
                >
                  <span
                    className={item.active ? "text-bol-ink" : "text-zinc-500"}
                  >
                    {item.icon}
                  </span>
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content — My sphere */}
        <div className="min-w-0 flex-1">
          {/* Green hero banner */}
          <section className="relative overflow-hidden rounded-2xl bg-[#c8ecd2] px-8 py-7">
            <span className="inline-flex items-center rounded-full bg-bol-blue px-3 py-1 text-sm font-bold text-white">
              mijn&nbsp;<span className="font-extrabold">bol.</span>
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-bol-blue sm:text-4xl">
              {translateFormat(lang, "account.helloName", { name: CUSTOMER_NAME })}
            </h1>
            <p className="mt-2 max-w-md text-lg font-medium text-bol-blue">
              {t("account.heroSub")}
            </p>
            <span
              className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/3 bg-[#b6e3c3] sm:block"
              style={{ clipPath: "ellipse(75% 100% at 100% 50%)" }}
              aria-hidden
            />
            <span className="absolute bottom-4 right-8 hidden text-7xl sm:block" aria-hidden>
              📦
            </span>
          </section>

          {/* Your last order */}
          <section className="mt-8">
            <h2 className="text-xl font-bold text-bol-ink">{t("account.lastOrder")}</h2>
            <p className="mt-2 text-zinc-700">{t("account.noOrders")}</p>
            <Link
              href="/account"
              className="mt-3 inline-flex items-center gap-1 font-medium text-bol-link hover:underline"
            >
              <ChevronRight /> {t("account.viewAllOrders")}
            </Link>
          </section>

          {/* Invoices */}
          <section className="mt-8">
            <h2 className="text-xl font-bold text-bol-ink">{t("account.invoices")}</h2>
            <p className="mt-2 text-zinc-700">{t("account.noInvoices")}</p>
            <Link
              href="/account"
              className="mt-3 inline-flex items-center gap-1 font-medium text-bol-link hover:underline"
            >
              <ChevronRight /> {t("account.toOverview")}
            </Link>
          </section>

          {/* Two cards */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {/* Data & Preferences */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-bol-ink">
                {t("account.dataPreferences")}
              </h2>
              <div className="rounded-lg border border-bol-border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-bol-ink">
                      {t("account.thisIsYou")}
                    </h3>
                    <div className="mt-2 space-y-0.5 text-zinc-700">
                      <p>Demo User</p>
                      <p>Voorbeeldstraat 1</p>
                      <p>1000 AA Amsterdam</p>
                      <p>{t("account.customerNumber")}: 0000000000</p>
                    </div>
                    <p className="mt-4 text-zinc-700">demo@example.com</p>
                  </div>
                  <AvatarIcon />
                </div>
              </div>
            </section>

            {/* Gift vouchers */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-bol-ink">
                {t("account.giftVouchers")}
              </h2>
              <div className="rounded-lg border border-bol-border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-bol-ink">
                      {t("account.gotBon")}
                    </h3>
                    <p className="mt-2 text-zinc-700">{t("account.gotBonText")}</p>
                  </div>
                  <GiftBoxIcon />
                </div>
              </div>
            </section>
          </div>

          {/* Animal collection — bottom of My Sphere */}
          <AnimalCollection />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- icons --- */

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="h-4 w-4">
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" strokeLinecap="round" />
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5z" strokeLinejoin="round" />
      <path d="M3 8.5 12 13l9-4.5M12 13v7" />
    </svg>
  );
}
function InvoiceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <circle cx="8" cy="14" r="5" />
      <path d="M14 5h6M14 9h6M14 13h4" strokeLinecap="round" />
    </svg>
  );
}
function ReturnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path d="M3 12h13a4 4 0 0 1 0 8h-3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 8 3 12l4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path d="M4 5h16v11H8l-4 4z" strokeLinejoin="round" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" strokeLinecap="round" />
    </svg>
  );
}
function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path d="M4 11h16v9H4z" strokeLinejoin="round" />
      <path d="M2 7h20v4H2zM12 7v13M12 7S10 3 7.5 4 9 7 12 7zM12 7s2-4 4.5-3S15 7 12 7z" strokeLinejoin="round" />
    </svg>
  );
}
function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path d="M20 11a8 8 0 0 0-14-4M4 13a8 8 0 0 0 14 4" strokeLinecap="round" />
      <path d="M18 3v4h-4M6 21v-4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DigitalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8M8 13h8M8 17h5" strokeLinecap="round" />
    </svg>
  );
}
function SellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" strokeLinecap="round" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 8 6 12l4 4M6 12h11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function AvatarIcon() {
  return (
    <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#dbe6ff]">
      <svg viewBox="0 0 24 24" fill="#1d00b8" className="h-12 w-12">
        <circle cx="12" cy="9" r="4.5" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0z" />
      </svg>
    </span>
  );
}
function GiftBoxIcon() {
  return (
    <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#dbe6ff]">
      <svg viewBox="0 0 24 24" fill="none" className="h-11 w-11">
        <rect x="4" y="10" width="16" height="10" rx="1" fill="#f3b98a" />
        <rect x="3" y="7" width="18" height="4" rx="1" fill="#f3b98a" />
        <path d="M12 7v13" stroke="#1d00b8" strokeWidth="2.5" />
        <path d="M3 9h18" stroke="#1d00b8" strokeWidth="2.5" />
        <path d="M12 7S9.5 3 7.5 4.5 9.5 7 12 7zM12 7s2.5-3.5 4.5-2.5S14.5 7 12 7z" fill="#1d00b8" />
      </svg>
    </span>
  );
}

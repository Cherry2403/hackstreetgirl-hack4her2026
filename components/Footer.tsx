import Link from "next/link";
import { getT } from "@/lib/i18n/server";
import type { TranslationKey } from "@/lib/i18n/translate";

export default async function Footer() {
  const { t } = await getT();

  const columns: { title: TranslationKey; links: TranslationKey[] }[] = [
    {
      title: "footer.serviceContact",
      links: [
        "footer.customerService",
        "footer.orderingPaying",
        "footer.deliveryOptions",
        "footer.returns",
      ],
    },
    {
      title: "footer.atBol",
      links: [
        "footer.aboutBol",
        "footer.careers",
        "footer.sustainability",
        "footer.press",
      ],
    },
    {
      title: "footer.sellViaBol",
      links: [
        "footer.sellBusiness",
        "footer.partner",
        "footer.advertise",
        "footer.affiliate",
      ],
    },
  ];

  return (
    <footer className="mt-12 border-t border-bol-border bg-bol-gray">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 text-sm font-bold text-bol-ink">{t(col.title)}</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              {col.links.map((l) => (
                <li key={l}>
                  <Link href="/" className="hover:text-bol-link hover:underline">
                    {t(l)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="mb-3 text-sm font-bold text-bol-ink">
            {t("footer.shopSustainably")}
          </h3>
          <p className="text-sm text-zinc-600">{t("footer.shopSustainablyText")}</p>
          <Link
            href="/search?sort=sustainability"
            className="mt-3 inline-block text-sm font-medium text-bol-green hover:underline"
          >
            {t("footer.viewMostSustainable")}
          </Link>
        </div>
      </div>
      <div className="border-t border-bol-border py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} {t("footer.disclaimer")}
      </div>
    </footer>
  );
}

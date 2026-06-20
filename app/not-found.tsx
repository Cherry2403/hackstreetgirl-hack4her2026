import Link from "next/link";
import { getT } from "@/lib/i18n/server";

export default async function NotFound() {
  const { t } = await getT();
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <span className="text-6xl">🔌</span>
      <h1 className="mt-4 text-2xl font-bold">{t("notFound.title")}</h1>
      <p className="mt-2 text-sm text-zinc-500">{t("notFound.text")}</p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-bol-blue px-6 py-2.5 font-medium text-white hover:bg-bol-blue-dark"
      >
        {t("notFound.home")}
      </Link>
    </div>
  );
}

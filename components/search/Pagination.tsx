import Link from "next/link";
import { getT } from "@/lib/i18n/server";

interface PaginationProps {
  page: number;
  pageCount: number;
  /** Existing query params (without `page`) to preserve in links. */
  baseParams: URLSearchParams;
}

export default async function Pagination({
  page,
  pageCount,
  baseParams,
}: PaginationProps) {
  if (pageCount <= 1) return null;
  const { t } = await getT();

  const href = (p: number) => {
    const params = new URLSearchParams(baseParams.toString());
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    const qs = params.toString();
    return `/search${qs ? `?${qs}` : ""}`;
  };

  // window of page numbers around the current page
  const pages: number[] = [];
  const from = Math.max(1, page - 2);
  const to = Math.min(pageCount, page + 2);
  for (let i = from; i <= to; i++) pages.push(i);

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
      <PageLink href={href(page - 1)} disabled={page <= 1}>
        {t("page.prev")}
      </PageLink>

      {from > 1 && (
        <>
          <PageLink href={href(1)}>1</PageLink>
          {from > 2 && <span className="px-1 text-zinc-400">…</span>}
        </>
      )}

      {pages.map((p) => (
        <PageLink key={p} href={href(p)} active={p === page}>
          {p}
        </PageLink>
      ))}

      {to < pageCount && (
        <>
          {to < pageCount - 1 && <span className="px-1 text-zinc-400">…</span>}
          <PageLink href={href(pageCount)}>{pageCount}</PageLink>
        </>
      )}

      <PageLink href={href(page + 1)} disabled={page >= pageCount}>
        {t("page.next")}
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  children,
  active = false,
  disabled = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}) {
  const base =
    "min-w-9 rounded-md border px-3 py-1.5 text-sm font-medium text-center";
  if (disabled) {
    return (
      <span className={`${base} cursor-not-allowed border-bol-border text-zinc-300`}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={`${base} ${
        active
          ? "border-bol-blue bg-bol-blue text-white"
          : "border-bol-border bg-white text-bol-ink hover:border-bol-blue"
      }`}
    >
      {children}
    </Link>
  );
}

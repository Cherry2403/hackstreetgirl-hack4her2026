"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { ProductFacets } from "@/lib/products";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface FilterSidebarProps {
  facets: ProductFacets;
}

export default function FilterSidebar({ facets }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  function update(mutate: (p: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  }

  function setParam(key: string, value: string | null) {
    update((p) => {
      if (value == null || value === "") p.delete(key);
      else p.set(key, value);
    });
  }

  function toggleParam(key: string) {
    update((p) => {
      if (p.get(key) === "true") p.delete(key);
      else p.set(key, "true");
    });
  }

  const activeCategory = searchParams.get("category");
  const activeSub = searchParams.get("subcategory");
  const activeEco = searchParams.get("ecoLabel");
  const activeWarehouse = searchParams.get("warehouse");
  const activeGrade = searchParams.get("grade");
  const activeMinLifespan = searchParams.get("minLifespan");
  const activeValue = searchParams.get("valuePerYear");
  const carbonNeutral = searchParams.get("carbonNeutral") === "true";
  const sameDay = searchParams.get("sameDay") === "true";

  const hasFilters =
    activeCategory ||
    activeSub ||
    activeEco ||
    activeWarehouse ||
    activeGrade ||
    activeMinLifespan ||
    activeValue ||
    carbonNeutral ||
    sameDay ||
    searchParams.get("minPrice") ||
    searchParams.get("maxPrice");

  return (
    <aside className="w-full shrink-0 space-y-4 md:w-64">
      {hasFilters && (
        <button
          onClick={() =>
            update((p) => {
              const q = p.get("q");
              const sort = p.get("sort");
              for (const k of [...p.keys()]) p.delete(k);
              if (q) p.set("q", q);
              if (sort) p.set("sort", sort);
            })
          }
          className="text-sm font-medium text-bol-link hover:underline"
        >
          ✕ {t("filter.clearAll")}
        </button>
      )}

      <FilterGroup title={t("filter.category")}>
        {activeCategory ? (
          <button
            onClick={() => {
              setParam("category", null);
              setParam("subcategory", null);
            }}
            className="text-sm font-medium text-bol-link hover:underline"
          >
            ← {activeCategory}
          </button>
        ) : (
          <FacetList
            facets={facets.categories}
            active={activeCategory}
            onSelect={(v) => setParam("category", v)}
          />
        )}
      </FilterGroup>

      {activeCategory && facets.subcategories.length > 0 && (
        <FilterGroup title={t("filter.subcategory")}>
          <FacetList
            facets={facets.subcategories}
            active={activeSub}
            onSelect={(v) => setParam("subcategory", activeSub === v ? null : v)}
          />
        </FilterGroup>
      )}

      <FilterGroup title={t("filter.price")}>
        <PriceFilter
          applyLabel={t("filter.apply")}
          min={facets.priceMin}
          max={facets.priceMax}
          currentMin={searchParams.get("minPrice")}
          currentMax={searchParams.get("maxPrice")}
          onApply={(lo, hi) =>
            update((p) => {
              if (lo) p.set("minPrice", lo);
              else p.delete("minPrice");
              if (hi) p.set("maxPrice", hi);
              else p.delete("maxPrice");
            })
          }
        />
      </FilterGroup>

      <FilterGroup title={t("filter.sustainability")}>
        <div className="mb-3">
          <p className="mb-1 text-xs font-bold uppercase text-zinc-500">Grade</p>
          <div className="flex flex-wrap gap-1">
            {["A", "B"].map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => setParam("grade", activeGrade === grade ? null : grade)}
                className={`rounded-full px-2 py-1 text-xs font-bold ${
                  activeGrade === grade
                    ? "bg-bol-green text-white"
                    : "bg-bol-green/10 text-bol-green"
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>
        <NumberFilter
          label="Minimum lifespan"
          current={activeMinLifespan}
          placeholder="3"
          onApply={(value) => setParam("minLifespan", value || null)}
        />
        <CheckRow
          label="Best price/lifespan value"
          checked={activeValue === "best"}
          onChange={() => setParam("valuePerYear", activeValue === "best" ? null : "best")}
        />
        <div className="my-3 border-t border-bol-border" />
        <CheckRow
          label={t("filter.carbonNeutral")}
          checked={carbonNeutral}
          onChange={() => toggleParam("carbonNeutral")}
        />
        <div className="mt-2 space-y-1">
          {facets.ecoLabels.map((f) => (
            <RadioRow
              key={f.value}
              label={f.value}
              count={f.count}
              checked={activeEco === f.value}
              onChange={() =>
                setParam("ecoLabel", activeEco === f.value ? null : f.value)
              }
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={t("filter.delivery")}>
        <CheckRow
          label={t("filter.deliveredToday")}
          checked={sameDay}
          onChange={() => toggleParam("sameDay")}
        />
      </FilterGroup>

      <FilterGroup title={t("filter.warehouse")}>
        <FacetList
          facets={facets.warehouses}
          active={activeWarehouse}
          onSelect={(v) =>
            setParam("warehouse", activeWarehouse === v ? null : v)
          }
        />
      </FilterGroup>
    </aside>
  );
}

function NumberFilter({
  label,
  current,
  placeholder,
  onApply,
}: {
  label: string;
  current: string | null;
  placeholder: string;
  onApply: (value: string) => void;
}) {
  const [value, setValue] = useState(current ?? "");

  return (
    <label className="mb-2 block text-sm text-zinc-700">
      <span className="mb-1 block text-xs font-medium text-zinc-500">{label}</span>
      <div className="flex gap-2">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          className="min-w-0 flex-1 rounded border border-bol-border px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-bol-blue"
        />
        <button
          type="button"
          onClick={() => onApply(value)}
          className="rounded bg-bol-blue px-2 text-xs font-bold text-white hover:bg-bol-blue-dark"
        >
          OK
        </button>
      </div>
    </label>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-lg border border-bol-border bg-white p-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-sm font-bold"
      >
        {title}
        <span className="text-zinc-400">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

function FacetList({
  facets,
  active,
  onSelect,
}: {
  facets: { value: string; count: number }[];
  active: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <ul className="max-h-60 space-y-1 overflow-y-auto text-sm">
      {facets.map((f) => (
        <li key={f.value}>
          <button
            onClick={() => onSelect(f.value)}
            className={`flex w-full items-center justify-between rounded px-1 py-0.5 text-left hover:bg-bol-gray ${
              active === f.value ? "font-semibold text-bol-blue" : "text-zinc-700"
            }`}
          >
            <span className="truncate">{f.value}</span>
            <span className="ml-2 shrink-0 text-xs text-zinc-400">{f.count}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-bol-blue"
      />
      {label}
    </label>
  );
}

function RadioRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-zinc-700">
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 accent-bol-green"
        />
        {label}
      </span>
      <span className="text-xs text-zinc-400">{count}</span>
    </label>
  );
}

function PriceFilter({
  min,
  max,
  currentMin,
  currentMax,
  onApply,
  applyLabel,
}: {
  min: number;
  max: number;
  currentMin: string | null;
  currentMax: string | null;
  onApply: (lo: string, hi: string) => void;
  applyLabel: string;
}) {
  const [lo, setLo] = useState(currentMin ?? "");
  const [hi, setHi] = useState(currentMax ?? "");

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          placeholder={`€${min}`}
          value={lo}
          onChange={(e) => setLo(e.target.value)}
          className="w-full rounded border border-bol-border px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-bol-blue"
        />
        <span className="text-zinc-400">–</span>
        <input
          type="number"
          inputMode="numeric"
          placeholder={`€${max}`}
          value={hi}
          onChange={(e) => setHi(e.target.value)}
          className="w-full rounded border border-bol-border px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-bol-blue"
        />
      </div>
      <button
        onClick={() => onApply(lo, hi)}
        className="w-full rounded-md bg-bol-blue py-1.5 text-sm font-medium text-white hover:bg-bol-blue-dark"
      >
        {applyLabel}
      </button>
    </div>
  );
}

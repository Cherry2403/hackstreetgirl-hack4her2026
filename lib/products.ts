import { readFileSync } from "node:fs";
import { join } from "node:path";
import { translate, type Lang, type TranslationKey } from "./i18n/translate";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A product as it lives in the CSV, with a few derived/presentational fields. */
export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  unitsSold: number;
  revenueUsd: number;
  priceFrom: number; // EUR
  priceTo: number; // EUR
  warehouseName: string;
  warehouseCode: string;
  warehouseGln: string;
  warehouseAddress: string;
  sameDay: boolean;
  nextDay: boolean;
  normalDelivery: boolean;
  countryOfOrigin: string;
  co2Kg: number | null;
  packaging: string;
  repairability: number | null; // 1-5
  lifespanYears: number | null;
  recyclablePct: number | null; // 0-100 (some rows store 0-1, normalised below)
  ecoLabel: string;
  carbonNeutral: boolean;

  // ---- derived presentational fields ----
  /** Sale price in EUR shown on cards (uses priceFrom). */
  price: number;
  /** Stable pseudo-random rating 1.0-5.0 derived from the id. */
  rating: number;
  /** Stable pseudo-random review count derived from the id. */
  reviewCount: number;
  /** Brand-ish label derived from the first word(s) of the name. */
  brand: string;
  /** A composite 0-100 sustainability score used for badges/sorting. */
  sustainabilityScore: number;
}

export interface ProductQuery {
  q?: string;
  category?: string;
  subcategory?: string;
  ecoLabel?: string;
  carbonNeutral?: boolean;
  sameDay?: boolean;
  warehouse?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}

export type SortKey =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "sustainability"
  | "popular";

export interface Facet {
  value: string;
  count: number;
}

export interface ProductFacets {
  categories: Facet[];
  subcategories: Facet[];
  ecoLabels: Facet[];
  warehouses: Facet[];
  priceMin: number;
  priceMax: number;
}

export interface SearchResult {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  facets: ProductFacets;
}

// ---------------------------------------------------------------------------
// CSV parsing (no external deps — handles quoted fields with commas)
// ---------------------------------------------------------------------------

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      // handle CRLF: skip the \n that follows a \r
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  // trailing field/row
  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.length > 1 || row[0] !== "") rows.push(row);
  }

  if (rows.length === 0) return [];
  // strip BOM from first header cell
  const header = rows[0].map((h) => h.replace(/^﻿/, "").trim());
  return rows.slice(1).map((cells) => {
    const obj: Record<string, string> = {};
    header.forEach((key, idx) => {
      obj[key] = (cells[idx] ?? "").trim();
    });
    return obj;
  });
}

// ---------------------------------------------------------------------------
// Field coercion helpers
// ---------------------------------------------------------------------------

function num(v: string): number | null {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function bool(v: string): boolean {
  return v.toUpperCase() === "TRUE";
}

/** Deterministic hash → used to derive stable ratings/review counts per product. */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function deriveRating(id: string): number {
  // Skew toward 3.5-5.0 like a real marketplace.
  const r = (hash(id + "rating") % 1000) / 1000; // 0..1
  return Math.round((3.3 + r * 1.7) * 10) / 10;
}

function deriveReviewCount(id: string, unitsSold: number): number {
  const base = (hash(id + "rev") % 200) + 1;
  // more popular products get more reviews
  return base + Math.floor(unitsSold / 5000);
}

function deriveBrand(name: string): string {
  // Use first 1-2 words, stripped of punctuation, as a brand-ish label.
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "Bol";
  const first = words[0].replace(/[^A-Za-z0-9-]/g, "");
  return first || "Bol";
}

function normaliseRecyclable(raw: number | null): number | null {
  if (raw == null) return null;
  // Some rows store a fraction (0.3) instead of a percent (30).
  return raw <= 1 ? Math.round(raw * 100) : Math.round(raw);
}

function deriveSustainabilityScore(p: {
  co2Kg: number | null;
  repairability: number | null;
  recyclablePct: number | null;
  lifespanYears: number | null;
  ecoLabel: string;
  carbonNeutral: boolean;
  packaging: string;
}): number {
  let score = 40; // neutral baseline

  if (p.carbonNeutral) score += 15;
  if (p.ecoLabel) score += 12;

  if (p.recyclablePct != null) score += (p.recyclablePct / 100) * 12;
  if (p.repairability != null) score += (p.repairability / 5) * 10;
  if (p.lifespanYears != null) score += Math.min(p.lifespanYears, 10) * 1;

  if (p.co2Kg != null) {
    // lower CO2 is better; ~0kg -> +10, ~75kg -> 0
    score += Math.max(0, 10 - p.co2Kg / 7.5);
  }

  const pkg = p.packaging.toLowerCase();
  if (pkg.includes("biodegradable") || pkg.includes("no packaging")) score += 6;
  else if (pkg.includes("recyclable") || pkg.includes("minimal")) score += 4;
  else if (pkg.includes("foam") || pkg === "plastic") score -= 4;

  return Math.max(0, Math.min(100, Math.round(score)));
}

// ---------------------------------------------------------------------------
// Loading & caching
// ---------------------------------------------------------------------------

let cache: Product[] | null = null;

export function getAllProducts(): Product[] {
  if (cache) return cache;

  const csvPath = join(process.cwd(), "data", "productData.csv");
  const raw = readFileSync(csvPath, "utf-8");
  const records = parseCsv(raw);

  cache = records
    .filter((r) => r["Product_ID"] && r["Product_Name"])
    .map((r): Product => {
      const id = r["Product_ID"];
      const unitsSold = num(r["Estimated_Total_Units_Sold_in_2025"]) ?? 0;
      const priceFrom = num(r["Price_From_EUR"]) ?? 0;
      const priceTo = num(r["Price_To_EUR"]) ?? priceFrom;
      const co2Kg = num(r["CO2_Footprint_kg"]);
      const repairability = num(r["Repairability_Score"]);
      const lifespanYears = num(r["Estimated_Lifespan_Years"]);
      const recyclablePct = normaliseRecyclable(num(r["Material_Recyclable_Pct"]));
      const ecoLabel = r["Eco_Label"] ?? "";
      const carbonNeutral = bool(r["Carbon_Neutral_Certified"]);
      const packaging = r["Packaging_Type"] ?? "";

      return {
        id,
        name: r["Product_Name"],
        category: r["Category"] ?? "",
        subcategory: r["Subcategory"] ?? "",
        unitsSold,
        revenueUsd: num(r["Estimated_Revenue_in_2025_USD"]) ?? 0,
        priceFrom,
        priceTo,
        warehouseName: r["WarehouseName"] ?? "",
        warehouseCode: r["WarehouseCode"] ?? "",
        warehouseGln: r["WarehouseGLN"] ?? "",
        warehouseAddress: r["WarehouseAddress"] ?? "",
        sameDay: bool(r["IsSameDayAvailable"]),
        nextDay: bool(r["IsNextDayAvailable"]),
        normalDelivery: bool(r["IsNormalDeliveryAvailable"]),
        countryOfOrigin: r["Country_Of_Origin"] ?? "",
        co2Kg,
        packaging,
        repairability,
        lifespanYears,
        recyclablePct,
        ecoLabel,
        carbonNeutral,

        price: priceFrom,
        rating: deriveRating(id),
        reviewCount: deriveReviewCount(id, unitsSold),
        brand: deriveBrand(r["Product_Name"]),
        sustainabilityScore: deriveSustainabilityScore({
          co2Kg,
          repairability,
          recyclablePct,
          lifespanYears,
          ecoLabel,
          carbonNeutral,
          packaging,
        }),
      };
    });

  return cache;
}

// ---------------------------------------------------------------------------
// Lookups & queries
// ---------------------------------------------------------------------------

export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}

/** A compact "•"-separated spec line for result rows (bol style). */
export function productSpecLine(p: Product, lang: Lang = "nl"): string {
  const tr = (k: TranslationKey) => translate(lang, k);
  const parts: string[] = [p.subcategory];
  if (p.countryOfOrigin) parts.push(`${tr("row.origin")}: ${p.countryOfOrigin}`);
  if (p.lifespanYears != null)
    parts.push(`${tr("row.lifespan")}: ${p.lifespanYears} ${tr("row.lifespanUnit")}`);
  if (p.repairability != null)
    parts.push(`${tr("row.repairable")}: ${p.repairability}/5`);
  if (p.co2Kg != null) parts.push(`CO₂: ${p.co2Kg} kg`);
  return parts.filter(Boolean).join(" • ");
}

/** A one-line marketing blurb for result rows. */
export function productBlurb(p: Product, lang: Lang = "nl"): string {
  const tr = (k: TranslationKey) => translate(lang, k);
  const eco = p.carbonNeutral
    ? tr("row.blurbCarbonNeutral")
    : p.ecoLabel
      ? `${tr("row.blurbEcoLabel")} ${p.ecoLabel} ${tr("row.blurbEcoLabelSuffix")}`
      : tr("row.blurbConscious");
  return `${p.name} ${tr("row.blurbConnector")} ${p.brand} — ${eco}. ${tr("row.blurbReturns")}`;
}

/** True for products good enough to earn a "Good Choice" eco badge. */
export function isGoodChoice(p: Product): boolean {
  return p.sustainabilityScore >= 65;
}

export function getProductsByIds(ids: string[]): Product[] {
  const map = new Map(getAllProducts().map((p) => [p.id, p]));
  return ids.map((id) => map.get(id)).filter((p): p is Product => Boolean(p));
}

/** Products related to a given one (same subcategory, then same category). */
export function getRelatedProducts(product: Product, limit = 8): Product[] {
  const all = getAllProducts().filter((p) => p.id !== product.id);
  const sameSub = all.filter((p) => p.subcategory === product.subcategory);
  const sameCat = all.filter(
    (p) => p.category === product.category && p.subcategory !== product.subcategory,
  );
  return [...sameSub, ...sameCat].slice(0, limit);
}

/** Deterministic-ish sample (seeded by string) for stable home-page rails. */
export function sampleProducts(seed: string, limit = 8): Product[] {
  const all = getAllProducts();
  const start = hash(seed) % all.length;
  const step = 7;
  const out: Product[] = [];
  for (let i = 0; out.length < limit && i < all.length; i++) {
    out.push(all[(start + i * step) % all.length]);
  }
  return out;
}

export function getCategories(): Facet[] {
  return facetCount(getAllProducts(), (p) => p.category);
}

function facetCount<T>(items: T[], pick: (t: T) => string): Facet[] {
  const counts = new Map<string, number>();
  for (const it of items) {
    const v = pick(it);
    if (!v) continue;
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

function matches(p: Product, q: ProductQuery): boolean {
  if (q.q) {
    const needle = q.q.toLowerCase();
    const hay = `${p.name} ${p.category} ${p.subcategory} ${p.brand}`.toLowerCase();
    if (!hay.includes(needle)) return false;
  }
  if (q.category && p.category !== q.category) return false;
  if (q.subcategory && p.subcategory !== q.subcategory) return false;
  if (q.ecoLabel && p.ecoLabel !== q.ecoLabel) return false;
  if (q.carbonNeutral && !p.carbonNeutral) return false;
  if (q.sameDay && !p.sameDay) return false;
  if (q.warehouse && p.warehouseName !== q.warehouse) return false;
  if (q.minPrice != null && p.price < q.minPrice) return false;
  if (q.maxPrice != null && p.price > q.maxPrice) return false;
  return true;
}

function sortProducts(items: Product[], sort: SortKey, q?: ProductQuery): Product[] {
  const arr = [...items];
  switch (sort) {
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "rating":
      return arr.sort((a, b) => b.rating - a.rating);
    case "sustainability":
      return arr.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
    case "popular":
      return arr.sort((a, b) => b.unitsSold - a.unitsSold);
    case "relevance":
    default: {
      // crude relevance: name-start matches first, then popularity
      const needle = q?.q?.toLowerCase();
      if (!needle) return arr.sort((a, b) => b.unitsSold - a.unitsSold);
      return arr.sort((a, b) => {
        const as = a.name.toLowerCase().startsWith(needle) ? 1 : 0;
        const bs = b.name.toLowerCase().startsWith(needle) ? 1 : 0;
        if (as !== bs) return bs - as;
        return b.unitsSold - a.unitsSold;
      });
    }
  }
}

export function searchProducts(query: ProductQuery): SearchResult {
  const all = getAllProducts();

  // Facets are computed over the result set ignoring the facet's own dimension
  // would be ideal, but for a hackathon base we compute facets over the
  // query-without-pagination result (still filtered) for the sidebar counts.
  const filtered = all.filter((p) => matches(p, query));

  const sorted = sortProducts(filtered, query.sort ?? "relevance", query);

  const pageSize = query.pageSize ?? 24;
  const page = Math.max(1, query.page ?? 1);
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const start = (page - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize);

  // Facets: compute over everything matching the text query + category context
  // so users can still see other categories/labels available.
  const facetBase = all.filter((p) => {
    // ignore eco/warehouse/price when building those facets so counts stay useful;
    // keep the text query + category to scope sensibly.
    if (query.q) {
      const needle = query.q.toLowerCase();
      const hay = `${p.name} ${p.category} ${p.subcategory} ${p.brand}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });

  const prices = facetBase.map((p) => p.price);
  const facets: ProductFacets = {
    categories: facetCount(facetBase, (p) => p.category),
    subcategories: facetCount(
      query.category ? facetBase.filter((p) => p.category === query.category) : facetBase,
      (p) => p.subcategory,
    ).slice(0, 20),
    ecoLabels: facetCount(facetBase, (p) => p.ecoLabel),
    warehouses: facetCount(facetBase, (p) => p.warehouseName),
    priceMin: prices.length ? Math.floor(Math.min(...prices)) : 0,
    priceMax: prices.length ? Math.ceil(Math.max(...prices)) : 0,
  };

  return { items, total: sorted.length, page, pageSize, pageCount, facets };
}

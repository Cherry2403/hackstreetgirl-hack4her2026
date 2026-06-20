import { NextRequest } from "next/server";
import { searchProducts, type ProductQuery, type SortKey } from "@/lib/products";
import type { SustainabilityGrade } from "@/lib/scoring";

const VALID_SORTS: SortKey[] = [
  "relevance",
  "price-asc",
  "price-desc",
  "rating",
  "sustainability",
  "lifespan",
  "value",
  "combined",
  "popular",
];

function numParam(v: string | null): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const sortRaw = sp.get("sort") as SortKey | null;
  const query: ProductQuery = {
    q: sp.get("q") ?? undefined,
    category: sp.get("category") ?? undefined,
    subcategory: sp.get("subcategory") ?? undefined,
    ecoLabel: sp.get("ecoLabel") ?? undefined,
    warehouse: sp.get("warehouse") ?? undefined,
    carbonNeutral: sp.get("carbonNeutral") === "true" ? true : undefined,
    sameDay: sp.get("sameDay") === "true" ? true : undefined,
    minPrice: numParam(sp.get("minPrice")),
    maxPrice: numParam(sp.get("maxPrice")),
    grade: (sp.get("grade") || undefined) as SustainabilityGrade | undefined,
    minScore: numParam(sp.get("minScore")),
    minLifespan: numParam(sp.get("minLifespan")),
    valuePerYear: sp.get("valuePerYear") === "best" ? "best" : undefined,
    sort: sortRaw && VALID_SORTS.includes(sortRaw) ? sortRaw : undefined,
    page: numParam(sp.get("page")),
    pageSize: numParam(sp.get("pageSize")),
  };

  const result = searchProducts(query);
  return Response.json(result);
}

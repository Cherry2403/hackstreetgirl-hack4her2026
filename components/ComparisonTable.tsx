import type { Product } from "@/lib/products";

interface ComparisonRow {
  label: string;
  values: string[];
}

export default function ComparisonTable({ products }: { products: Product[] }) {
  const gridCols = `minmax(150px,1fr) repeat(${products.length}, minmax(0,1fr))`;
  const rows = buildRows(products);

  return (
    <section className="mt-8 overflow-x-auto">
      <div className="min-w-[680px] rounded-lg border border-bol-border bg-white">
        <div className="border-b border-bol-border bg-bol-gray px-4 py-3">
          <h2 className="text-lg font-bold text-bol-ink">Main comparison</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Normal shopping details first: price, delivery, reviews, and product specs.
          </p>
        </div>

        <div className="divide-y divide-bol-border">
          {rows.map((row, index) => (
            <div
              key={row.label}
              className={`grid gap-3 px-4 py-3 text-sm ${
                index % 2 === 0 ? "bg-white" : "bg-bol-gray/60"
              }`}
              style={{ gridTemplateColumns: gridCols }}
            >
              <span className="font-medium text-zinc-600">{row.label}</span>
              {row.values.map((value, valueIndex) => (
                <span key={`${row.label}-${valueIndex}`} className="font-semibold text-bol-ink">
                  {value}
                </span>
              ))}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function buildRows(products: Product[]): ComparisonRow[] {
  const rows = [
    { label: "Category", values: products.map((p) => p.category || "–") },
    { label: "Subcategory", values: products.map((p) => p.subcategory || "–") },
    { label: "Price", values: products.map((p) => euro(p.price)) },
    {
      label: "Rating",
      values: products.map((p) => `${p.rating.toFixed(1)} (${p.reviewCount} reviews)`),
    },
    { label: "Delivery", values: products.map(deliveryLabel) },
    { label: "Available today", values: products.map((p) => yesNo(p.sameDay)) },
    { label: "Available tomorrow", values: products.map((p) => yesNo(p.nextDay)) },
    { label: "Brand", values: products.map((p) => p.brand || "–") },
    {
      label: "Lifespan",
      values: products.map((p) => (p.lifespanYears != null ? `${p.lifespanYears} years` : "–")),
    },
    {
      label: "Repairability",
      values: products.map((p) =>
        p.repairability != null ? `${p.repairability}/${p.repairability <= 5 ? 5 : 10}` : "–",
      ),
    },
    { label: "Packaging", values: products.map((p) => p.packaging || "–") },
    {
      label: "Recyclability",
      values: products.map((p) => (p.recyclablePct != null ? `${p.recyclablePct}%` : "–")),
    },
    {
      label: "CO₂ footprint",
      values: products.map((p) => (p.co2Kg != null ? `${p.co2Kg} kg` : "–")),
    },
    { label: "Eco-label", values: products.map((p) => p.ecoLabel || "–") },
  ];

  return rows.filter((row) => row.values.some((value) => value !== "–"));
}

function deliveryLabel(product: Product): string {
  if (product.sameDay) return "Today";
  if (product.nextDay) return "Tomorrow";
  if (product.normalDelivery) return "2-3 business days";
  return "Check product page";
}

function yesNo(value: boolean): string {
  return value ? "Yes" : "No";
}

function euro(value: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

import type { Product } from "@/lib/products";
import ProductTimeMachine from "@/components/ProductTimeMachine";

export default function ComparisonTimeline({ products }: { products: Product[] }) {
  const [a, b] = products;
  if (!a || !b) return null;

  const better = a.sustainabilityScore >= b.sustainabilityScore ? a : b;
  const other = better.id === a.id ? b : a;
  const reasons = [
    better.lifespanYears != null &&
    other.lifespanYears != null &&
    better.lifespanYears > other.lifespanYears
      ? "it is expected to last longer"
      : null,
    better.repairability != null &&
    other.repairability != null &&
    better.repairability > other.repairability
      ? "it has higher repairability"
      : null,
    better.co2Kg != null && other.co2Kg != null && better.co2Kg < other.co2Kg
      ? "it has a lower CO2 footprint"
      : null,
  ].filter(Boolean);

  return (
    <section className="mt-10 rounded-xl border border-bol-green/30 bg-bol-green/5 p-5">
      <p className="text-sm font-bold text-bol-green">Compare Futures</p>
      <h2 className="mt-1 text-xl font-bold text-bol-ink">Product time machine side by side</h2>
      <p className="mt-2 text-sm text-zinc-700">
        {better.name} is the better long-term choice because{" "}
        {reasons.length ? reasons.join(" and ") : "it has the stronger sustainability score in this demo model"}.
      </p>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {[a, b].map((product) => (
          <div key={product.id} className="rounded-xl bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="line-clamp-2 font-bold text-bol-ink">{product.name}</h3>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-sm font-black ${
                  product.id === better.id
                    ? "bg-bol-green text-white"
                    : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {product.sustainabilityScore}
              </span>
            </div>
            <ProductTimeMachine product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

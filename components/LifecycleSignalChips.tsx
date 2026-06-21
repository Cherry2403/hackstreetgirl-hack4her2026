import type { Product } from "@/lib/products";
import { lifecycleSignalChips } from "@/lib/productJourney";

export default function LifecycleSignalChips({ product }: { product: Product }) {
  return (
    <div className="flex flex-wrap gap-2">
      {lifecycleSignalChips(product).map((chip) => (
        <span
          key={chip.label}
          className="rounded-full border border-bol-green/25 bg-bol-green/5 px-3 py-1 text-xs text-bol-ink"
        >
          <span className="font-semibold text-bol-green">{chip.label}:</span>{" "}
          {chip.value}
        </span>
      ))}
    </div>
  );
}

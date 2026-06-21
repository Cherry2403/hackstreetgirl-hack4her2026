import type { Product } from "@/lib/products";
import ProductJourneyCompare from "@/components/ProductJourneyCompare";

export default function ComparisonTimeline({ products }: { products: Product[] }) {
  return <ProductJourneyCompare products={products} />;
}

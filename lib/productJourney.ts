import type { Product } from "@/lib/products";

export interface LifecycleChip {
  label: string;
  value: string;
}

export interface JourneySignal {
  productId: string;
  text: string;
}

const dash = "–";

export function lifecycleSignalChips(product: Product): LifecycleChip[] {
  return [
    {
      label: "Lifespan",
      value: product.lifespanYears != null ? `${product.lifespanYears} years` : dash,
    },
    {
      label: "Repairability",
      value:
        product.repairability != null
          ? `${product.repairability}/${product.repairability <= 5 ? 5 : 10}`
          : dash,
    },
    {
      label: "Packaging",
      value: product.packaging || dash,
    },
    {
      label: "Recyclability",
      value: product.recyclablePct != null ? `${product.recyclablePct}%` : dash,
    },
    {
      label: "Data confidence",
      value: `${product.sustainabilityConfidence}%`,
    },
  ];
}

export function lifecycleDataCount(product: Product): number {
  return [
    product.co2Kg,
    product.lifespanYears,
    product.repairability,
    product.recyclablePct,
    product.packaging || null,
    product.ecoLabel || null,
    product.countryOfOrigin || null,
  ].filter((value) => value != null && value !== "").length;
}

export function neutralJourneySignals(products: Product[]): JourneySignal[] {
  const [a, b] = products;
  if (!a || !b) return [];

  const signals: JourneySignal[] = [];
  addLifespanSignal(signals, a, b);
  addRepairSignal(signals, a, b);
  addDataSignal(signals, a, b);
  addEndOfLifeSignal(signals, a, b);

  return signals.slice(0, 4);
}

function addLifespanSignal(signals: JourneySignal[], a: Product, b: Product) {
  if (a.lifespanYears == null || b.lifespanYears == null || a.lifespanYears === b.lifespanYears)
    return;
  signals.push({
    productId: a.lifespanYears > b.lifespanYears ? a.id : b.id,
    text: "Longer use estimate",
  });
}

function addRepairSignal(signals: JourneySignal[], a: Product, b: Product) {
  if (a.repairability == null || b.repairability == null || a.repairability === b.repairability)
    return;
  signals.push({
    productId: a.repairability > b.repairability ? a.id : b.id,
    text: "Clearer repair path",
  });
}

function addDataSignal(signals: JourneySignal[], a: Product, b: Product) {
  const aCount = lifecycleDataCount(a);
  const bCount = lifecycleDataCount(b);
  if (aCount === bCount) return;
  signals.push({
    productId: aCount > bCount ? a.id : b.id,
    text: "More lifecycle data",
  });
}

function addEndOfLifeSignal(signals: JourneySignal[], a: Product, b: Product) {
  const aHas = a.recyclablePct != null || Boolean(a.packaging);
  const bHas = b.recyclablePct != null || Boolean(b.packaging);
  if (aHas === bHas) return;
  signals.push({
    productId: aHas ? b.id : a.id,
    text: "Less end-of-life data",
  });
}

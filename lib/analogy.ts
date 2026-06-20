import type { Product } from "./products";

export interface ImpactAnalogy {
  title: string;
  text: string;
  deltaKg: number;
}

function round(value: number, digits = 1): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function analogyFromCo2Delta(deltaKg: number): ImpactAnalogy {
  const abs = Math.abs(deltaKg);
  const drivingKm = round(abs / 0.17);
  const phoneMonths = round(abs / 0.0018 / 30);
  const coffeeCups = Math.round(abs / 0.28);

  if (abs < 0.5) {
    return {
      title: "Estimated impact",
      text: "The CO2 difference is small enough that product lifespan and repairability may matter more.",
      deltaKg,
    };
  }

  if (drivingKm >= 8) {
    return {
      title: "Driving comparison",
      text: `The CO2 difference is roughly equivalent to ${drivingKm} km of average car driving.`,
      deltaKg,
    };
  }

  if (phoneMonths >= 1) {
    return {
      title: "Phone charging comparison",
      text: `The CO2 difference is similar to about ${phoneMonths} months of charging a phone.`,
      deltaKg,
    };
  }

  return {
    title: "Coffee comparison",
    text: `The CO2 difference is roughly equivalent to ${coffeeCups} cups of coffee.`,
    deltaKg,
  };
}

export function analogyForProduct(product: Product, categoryAverageScore: number): ImpactAnalogy {
  const scoreDelta = product.sustainabilityScore - categoryAverageScore;
  const replacementYears = product.lifespanYears == null ? null : Math.max(0, product.lifespanYears - 2);

  if (product.co2Kg != null) {
    const categoryAverageCo2 = Math.max(1, product.co2Kg * (categoryAverageScore / Math.max(1, product.sustainabilityScore)));
    return analogyFromCo2Delta(categoryAverageCo2 - product.co2Kg);
  }

  if (replacementYears != null && replacementYears >= 1) {
    return {
      title: "Replacement cycle",
      text: `The expected lifespan may avoid roughly ${round(replacementYears, 0)} replacement cycle${replacementYears === 1 ? "" : "s"} compared with a short-lived option.`,
      deltaKg: 0,
    };
  }

  return {
    title: "Category comparison",
    text:
      scoreDelta >= 0
        ? `This product scores ${Math.round(scoreDelta)} points above its category average.`
        : `This product scores ${Math.abs(Math.round(scoreDelta))} points below its category average.`,
    deltaKg: 0,
  };
}

export function analogyBetweenProducts(a: Product, b: Product): ImpactAnalogy {
  if (a.co2Kg != null && b.co2Kg != null) {
    return analogyFromCo2Delta(a.co2Kg - b.co2Kg);
  }

  const better = a.sustainabilityScore >= b.sustainabilityScore ? a : b;
  const other = better.id === a.id ? b : a;
  return {
    title: "Score comparison",
    text: `${better.name} scores ${better.sustainabilityScore - other.sustainabilityScore} sustainability points higher in this demo model.`,
    deltaKg: 0,
  };
}

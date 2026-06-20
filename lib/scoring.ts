export type SustainabilityGrade = "A" | "B" | "C" | "D" | "E";

export type ScoreComponent =
  | "co2"
  | "lifespan"
  | "repairability"
  | "recyclability"
  | "packaging"
  | "certification"
  | "delivery";

export interface SustainabilityScoreInput {
  category: string;
  co2Kg: number | null;
  lifespanYears: number | null;
  repairability: number | null;
  recyclablePct: number | null;
  packaging: string;
  ecoLabel: string;
  carbonNeutral: boolean;
  sameDay: boolean;
  nextDay: boolean;
  normalDelivery: boolean;
}

export interface ScoreBreakdownItem {
  key: ScoreComponent;
  label: string;
  score: number;
  weight: number;
  weightedScore: number;
  explanation: string;
}

export interface SustainabilityScoreResult {
  score: number;
  grade: SustainabilityGrade;
  confidence: number;
  missingFields: string[];
  strengths: string[];
  warnings: string[];
  calculationBreakdown: ScoreBreakdownItem[];
  isSustainable: boolean;
}

type Weights = Record<ScoreComponent, number>;

const DEFAULT_WEIGHTS: Weights = {
  co2: 0.3,
  lifespan: 0.2,
  repairability: 0.15,
  recyclability: 0.15,
  packaging: 0.1,
  certification: 0.05,
  delivery: 0.05,
};

const CATEGORY_WEIGHTS: Record<string, Weights> = {
  Electronics: {
    co2: 0.25,
    lifespan: 0.25,
    repairability: 0.2,
    recyclability: 0.15,
    packaging: 0.1,
    certification: 0.03,
    delivery: 0.02,
  },
  Fitness: {
    co2: 0.25,
    lifespan: 0.25,
    repairability: 0.2,
    recyclability: 0.15,
    packaging: 0.1,
    certification: 0.03,
    delivery: 0.02,
  },
  "Home & Garden": {
    co2: 0.25,
    lifespan: 0.25,
    repairability: 0.2,
    recyclability: 0.15,
    packaging: 0.1,
    certification: 0.03,
    delivery: 0.02,
  },
  Fashion: {
    co2: 0.25,
    lifespan: 0.2,
    repairability: 0.05,
    recyclability: 0.25,
    packaging: 0.15,
    certification: 0.07,
    delivery: 0.03,
  },
  Baby: {
    co2: 0.25,
    lifespan: 0.2,
    repairability: 0.05,
    recyclability: 0.25,
    packaging: 0.15,
    certification: 0.07,
    delivery: 0.03,
  },
  "Beauty & Skincare": {
    co2: 0.3,
    lifespan: 0.05,
    repairability: 0,
    recyclability: 0.2,
    packaging: 0.25,
    certification: 0.15,
    delivery: 0.05,
  },
  "Food & Beverage": {
    co2: 0.3,
    lifespan: 0.05,
    repairability: 0,
    recyclability: 0.2,
    packaging: 0.25,
    certification: 0.15,
    delivery: 0.05,
  },
  "Digital Goods": {
    co2: 0.45,
    lifespan: 0.1,
    repairability: 0,
    recyclability: 0.05,
    packaging: 0.05,
    certification: 0.2,
    delivery: 0.15,
  },
};

const labels: Record<ScoreComponent, string> = {
  co2: "CO2 footprint",
  lifespan: "Expected lifespan",
  repairability: "Repairability",
  recyclability: "Recyclable material",
  packaging: "Packaging",
  certification: "Certification",
  delivery: "Delivery",
};

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

function gradeFor(score: number): SustainabilityGrade {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "E";
}

function co2Benchmark(category: string): number {
  if (category === "Digital Goods") return 12;
  if (category === "Food & Beverage" || category === "Beauty & Skincare") return 8;
  if (category === "Fashion" || category === "Baby") return 25;
  if (category === "Electronics" || category === "Fitness" || category === "Home & Garden")
    return 75;
  return 40;
}

function lifespanBenchmark(category: string): number {
  if (category === "Food & Beverage" || category === "Beauty & Skincare") return 1;
  if (category === "Fashion" || category === "Baby") return 4;
  if (category === "Digital Goods") return 5;
  return 10;
}

export function repairabilityPercent(repairability: number | null): number | null {
  if (repairability == null) return null;
  const denominator = repairability <= 5 ? 5 : 10;
  return clamp((repairability / denominator) * 100);
}

export function packagingScore(packaging: string): number | null {
  const value = packaging.trim().toLowerCase();
  if (!value) return null;
  if (value.includes("no packaging") || value.includes("none")) return 100;
  if (value.includes("biodegradable") || value.includes("compost")) return 92;
  if (value.includes("minimal")) return 84;
  if (value.includes("recyclable") || value.includes("cardboard") || value.includes("paper"))
    return 78;
  if (value.includes("glass")) return 68;
  if (value.includes("plastic")) return 42;
  if (value.includes("foam")) return 24;
  return 55;
}

function deliveryScore(input: SustainabilityScoreInput): number | null {
  if (input.normalDelivery) return 88;
  if (input.nextDay) return 68;
  if (input.sameDay) return 52;
  return null;
}

function certificationScore(input: SustainabilityScoreInput): number | null {
  if (!input.ecoLabel && !input.carbonNeutral) return null;
  if (input.ecoLabel && input.carbonNeutral) return 100;
  if (input.carbonNeutral) return 84;
  return 76;
}

function pushInsight(
  strengths: string[],
  warnings: string[],
  key: ScoreComponent,
  score: number,
): void {
  if (score >= 78) strengths.push(`This product scores well for ${labels[key].toLowerCase()}.`);
  if (score < 45) warnings.push(`${labels[key]} is a weak point for this product.`);
}

export function calculateSustainabilityScore(
  input: SustainabilityScoreInput,
): SustainabilityScoreResult {
  const weights = CATEGORY_WEIGHTS[input.category] ?? DEFAULT_WEIGHTS;
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  const missingFields: string[] = [];
  const strengths: string[] = [];
  const warnings: string[] = [];
  const breakdown: ScoreBreakdownItem[] = [];

  const add = (key: ScoreComponent, value: number | null, explanation: string) => {
    const weight = weights[key];
    if (weight <= 0) return;
    if (value == null || !Number.isFinite(value)) {
      missingFields.push(labels[key]);
      return;
    }
    const score = Math.round(clamp(value));
    pushInsight(strengths, warnings, key, score);
    breakdown.push({
      key,
      label: labels[key],
      score,
      weight,
      weightedScore: score * weight,
      explanation,
    });
  };

  const co2Max = co2Benchmark(input.category);
  add(
    "co2",
    input.co2Kg == null ? null : 100 - (input.co2Kg / co2Max) * 100,
    `Lower CO2 is better for ${input.category || "this category"}.`,
  );

  const lifespanMax = lifespanBenchmark(input.category);
  add(
    "lifespan",
    input.lifespanYears == null ? null : (input.lifespanYears / lifespanMax) * 100,
    "Longer expected use improves the score.",
  );

  add(
    "repairability",
    repairabilityPercent(input.repairability),
    "Repairable products can stay useful longer.",
  );
  add(
    "recyclability",
    input.recyclablePct,
    "Higher recyclable material percentage is better.",
  );
  add("packaging", packagingScore(input.packaging), "Lower-impact packaging improves the score.");
  add("certification", certificationScore(input), "Eco labels and carbon-neutral claims add trust.");
  add("delivery", deliveryScore(input), "Slower delivery is treated as slightly greener.");

  const availableWeight = breakdown.reduce((sum, item) => sum + item.weight, 0);
  const weightedScore = breakdown.reduce((sum, item) => sum + item.weightedScore, 0);
  const score = availableWeight > 0 ? Math.round(weightedScore / availableWeight) : 0;
  const confidence = Math.round((availableWeight / totalWeight) * 100);

  if (missingFields.length > 0) {
    warnings.push(`Some data is missing, so confidence is ${confidence}%.`);
  }

  return {
    score,
    grade: gradeFor(score),
    confidence,
    missingFields,
    strengths: [...new Set(strengths)].slice(0, 5),
    warnings: [...new Set(warnings)].slice(0, 5),
    calculationBreakdown: breakdown,
    isSustainable: score >= 75,
  };
}

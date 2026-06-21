export type SustainabilityGrade = "A" | "B" | "C" | "D" | "E";

export type ScoreComponent =
  | "co2"
  | "packaging"
  | "recyclable"
  | "repairability"
  | "lifespan"
  | "eco_label"
  | "carbon_neutral"
  | "warehouse"
  | "country";

export interface SustainabilityScoreInput {
  co2Kg: number | null;
  packaging: string;
  recyclablePct: number | null;
  repairability: number | null;
  lifespanYears: number | null;
  ecoLabel: string;
  carbonNeutral: boolean | null;
  warehouseName: string;
  countryOfOrigin: string;
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

const WEIGHTS: Record<ScoreComponent, number> = {
  co2: 0.35,
  packaging: 0.15,
  recyclable: 0.10,
  repairability: 0.10,
  lifespan: 0.10,
  eco_label: 0.05,
  carbon_neutral: 0.05,
  warehouse: 0.05,
  country: 0.05,
};

const ALPHA = 0.3;

const COMPONENT_LABELS: Record<ScoreComponent, string> = {
  co2: "CO2 footprint",
  packaging: "Packaging",
  recyclable: "Recyclable material",
  repairability: "Repairability",
  lifespan: "Expected lifespan",
  eco_label: "Eco label",
  carbon_neutral: "Carbon neutral",
  warehouse: "Warehouse",
  country: "Country of origin",
};

const PACKAGING_SCORES: Record<string, number> = {
  "Digital - No Packaging": 1.0,
  "Biodegradable": 0.9,
  "Recyclable Cardboard": 0.85,
  "Minimal Packaging": 0.75,
  "Mixed Plastic+Cardboard": 0.55,
  "Plastic": 0.40,
  "Foam + Plastic": 0.25,
};

const ECO_LABEL_SCORES: Record<string, number> = {
  "Cradle to Cradle": 1.0,
  "EU Ecolabel": 0.9,
  "Energy Star": 0.8,
  "FSC Certified": 0.7,
  "Fair Trade": 0.6,
};

function gradeFor(score: number): SustainabilityGrade {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "E";
}

function normalize(key: ScoreComponent, input: SustainabilityScoreInput): number | null {
  switch (key) {
    case "co2":
      return input.co2Kg == null ? null : Math.max(0, 1 - input.co2Kg / 100);
    case "packaging": {
      const v = PACKAGING_SCORES[input.packaging.trim()];
      return v ?? null;
    }
    case "recyclable":
      return input.recyclablePct == null ? null : input.recyclablePct / 100;
    case "repairability":
      return input.repairability == null ? null : Math.min(input.repairability / 9, 1);
    case "lifespan":
      return input.lifespanYears == null ? null : Math.min(input.lifespanYears / 10, 1);
    case "eco_label": {
      const v = ECO_LABEL_SCORES[input.ecoLabel.trim()];
      return v ?? null;
    }
    case "carbon_neutral":
      return input.carbonNeutral == null ? null : input.carbonNeutral ? 1.0 : 0.0;
    case "warehouse":
      return input.warehouseName
        ? input.warehouseName.toLowerCase().includes("perfect") ? 1.0 : 0.5
        : null;
    case "country":
      return input.countryOfOrigin
        ? ["netherlands", "belgium"].includes(input.countryOfOrigin.toLowerCase()) ? 1.0 : 0.5
        : null;
  }
}

const EXPLANATIONS: Record<ScoreComponent, string> = {
  co2: "Lower CO2 footprint is better.",
  packaging: "Less-impact packaging improves the score.",
  recyclable: "Higher recyclable material percentage is better.",
  repairability: "Repairable products can stay useful longer.",
  lifespan: "Longer expected use improves the score.",
  eco_label: "Recognised eco labels add trust.",
  carbon_neutral: "Carbon-neutral certification is rewarded.",
  warehouse: "Products from the Perfect warehouse score higher.",
  country: "Products from the Netherlands or Belgium score higher.",
};

function pushInsight(
  strengths: string[],
  warnings: string[],
  label: string,
  score: number,
): void {
  if (score >= 78) strengths.push(`This product scores well for ${label.toLowerCase()}.`);
  if (score < 45) warnings.push(`${label} is a weak point for this product.`);
}

export function calculateSustainabilityScore(
  input: SustainabilityScoreInput,
): SustainabilityScoreResult {
  const missingFields: string[] = [];
  const strengths: string[] = [];
  const warnings: string[] = [];
  const breakdown: ScoreBreakdownItem[] = [];

  let availableWeightSum = 0;
  let missingWeightSum = 0;
  let availableScore = 0;

  for (const key of Object.keys(WEIGHTS) as ScoreComponent[]) {
    const weight = WEIGHTS[key];
    const raw = normalize(key, input);

    if (raw == null) {
      missingWeightSum += weight;
      missingFields.push(COMPONENT_LABELS[key]);
      continue;
    }

    const score = Math.round(Math.max(0, Math.min(1, raw)) * 100);
    availableScore += raw * weight;
    availableWeightSum += weight;

    pushInsight(strengths, warnings, COMPONENT_LABELS[key], score);
    breakdown.push({
      key,
      label: COMPONENT_LABELS[key],
      score,
      weight,
      weightedScore: score * weight,
      explanation: EXPLANATIONS[key],
    });
  }

  const totalWeight = availableWeightSum + missingWeightSum;
  const scoreObserved = availableWeightSum > 0 ? availableScore / availableWeightSum : 0;
  const missingRatio = totalWeight > 0 ? missingWeightSum / totalWeight : 0;
  const scoreFinal = scoreObserved * (1 - ALPHA * missingRatio);
  const score = Math.round(scoreFinal * 100);
  const confidence = Math.round((availableWeightSum / totalWeight) * 100);

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

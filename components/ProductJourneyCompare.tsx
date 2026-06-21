"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";

type JourneyStepId = "production" | "delivery" | "circularity";

interface JourneyStep {
  id: JourneyStepId;
  title: string;
  era: string;
  shopperQuestion: string;
}

interface JourneyRow {
  label: string;
  values: string[];
}

const STEPS: JourneyStep[] = [
  {
    id: "production",
    title: "Production",
    era: "The past",
    shopperQuestion: "How was this item born?",
  },
  {
    id: "delivery",
    title: "Delivery",
    era: "The present",
    shopperQuestion: "What gets it to my door?",
  },
  {
    id: "circularity",
    title: "Lifetime value",
    era: "The future",
    shopperQuestion: "How long can I own it?",
  },
];

const STEP_STYLES: Record<JourneyStepId, string> = {
  production: "bg-amber-50 text-amber-700",
  delivery: "bg-blue-50 text-bol-blue",
  circularity: "bg-green-50 text-bol-green",
};

export default function ProductJourneyCompare({
  products,
  embedded = false,
}: {
  products: Product[];
  embedded?: boolean;
}) {
  const visibleProducts = products.slice(0, 4);
  const [activeStep, setActiveStep] = useState<JourneyStepId>("production");
  const step = STEPS.find((item) => item.id === activeStep) ?? STEPS[0];
  const gridCols = `minmax(150px,1fr) repeat(${visibleProducts.length}, minmax(0,1fr))`;
  const rows = journeyRows(visibleProducts, step.id);

  if (visibleProducts.length < 2) return null;

  const content = (
    <div className={embedded ? "p-4" : "p-5"}>
      <div className="grid gap-2 sm:grid-cols-3">
        {STEPS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveStep(item.id)}
            className={`rounded-xl border p-3 text-left transition ${
              activeStep === item.id
                ? "border-bol-blue bg-bol-blue text-white"
                : "border-bol-border bg-white text-bol-ink hover:border-bol-blue"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  activeStep === item.id
                    ? "bg-white text-bol-blue"
                    : STEP_STYLES[item.id]
                }`}
              >
                <StepIcon step={item.id} className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-black">{item.title}</span>
                <span
                  className={`block text-xs ${
                    activeStep === item.id ? "text-white/75" : "text-zinc-500"
                  }`}
                >
                  {item.era}
                </span>
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[680px] rounded-xl border border-bol-border bg-white">
          {rows.length > 0 ? (
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
                    <span
                      key={`${row.label}-${valueIndex}`}
                      className="font-semibold text-bol-ink"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-sm font-semibold text-amber-800">
              No data for this lens
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <section
      id="product-journeys"
      className="mt-10 overflow-hidden rounded-xl border border-bol-border bg-white"
    >
      <div className="flex flex-col gap-3 border-b border-bol-border bg-bol-gray px-5 py-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-bol-green">
            Optional future impact
          </p>
          <h2 className="mt-1 text-xl font-bold text-bol-ink">
            Product journeys after checkout
          </h2>
        </div>
        <p className="max-w-md text-sm text-zinc-600">
          Pick a lifecycle lens and compare the same moment across products.
        </p>
      </div>

      {content}
    </section>
  );
}

function journeyRows(products: Product[], step: JourneyStepId): JourneyRow[] {
  if (step === "production") {
    return compactRows([
      ["CO₂ footprint", products.map((p) => (p.co2Kg != null ? `${p.co2Kg} kg` : "–"))],
      ["Origin", products.map((p) => p.countryOfOrigin || "–")],
      ["Packaging", products.map((p) => p.packaging || "–")],
      ["Carbon neutral", products.map((p) => (p.carbonNeutral ? "Certified" : "–"))],
      ["Origin label", products.map((p) => originLabel(p.ecoLabel) ?? "–")],
    ]);
  }

  if (step === "delivery") {
    return compactRows([
      ["Standard", products.map((p) => availabilityMark(p.normalDelivery))],
      ["Next day", products.map((p) => availabilityMark(p.nextDay))],
      ["Same day", products.map((p) => availabilityMark(p.sameDay))],
    ]);
  }

  return compactRows([
    ["Lifespan", products.map((p) => (p.lifespanYears != null ? `${p.lifespanYears} years` : "–"))],
    ["Price range", products.map(priceRange)],
    [
      "Repairability",
      products.map((p) =>
        p.repairability != null ? `${p.repairability}/${p.repairability <= 5 ? 5 : 10}` : "–",
      ),
    ],
    ["Recyclable", products.map((p) => (p.recyclablePct != null ? `${p.recyclablePct}%` : "–"))],
    ["Future label", products.map((p) => futureLabel(p.ecoLabel) ?? "–")],
  ]);
}

function compactRows(rows: Array<[string, string[]]>): JourneyRow[] {
  return rows.map(([label, values]) => ({ label, values })).filter((row) => row.values.some((value) => value !== "–"));
}

function availabilityMark(isAvailable: boolean): string {
  return isAvailable ? "✓" : "×";
}

function originLabel(label: string): string | null {
  if (!label) return null;
  return ["EU Ecolabel", "FSC Certified", "Fair Trade"].includes(label) ? label : null;
}

function futureLabel(label: string): string | null {
  if (!label) return null;
  return ["Energy Star", "Cradle to Cradle"].includes(label) ? label : null;
}

function priceRange(product: Product): string {
  if (product.priceFrom === product.priceTo) return euro(product.priceFrom);
  return `${euro(product.priceFrom)} - ${euro(product.priceTo)}`;
}

function euro(value: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function StepIcon({ step, className = "" }: { step: JourneyStepId; className?: string }) {
  if (step === "production") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
        <path d="M4 14h16v5H4zM6 14V9l4 3V9l4 3V7h4v7" />
      </svg>
    );
  }

  if (step === "delivery") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
        <path d="M3 7h11v10H3zM14 11h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M7 7a7 7 0 0 1 11 3M17 7h2V5M17 17a7 7 0 0 1-11-3M7 17H5v2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8v4l3 2" strokeLinecap="round" />
    </svg>
  );
}

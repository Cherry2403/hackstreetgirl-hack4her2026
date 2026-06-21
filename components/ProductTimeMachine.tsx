"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";

type JourneyStepId = "production" | "delivery" | "circularity";

interface JourneyStep {
  id: JourneyStepId;
  title: string;
  era: string;
  question: string;
}

interface JourneyFact {
  label: string;
  value: string;
  tone?: "positive" | "negative";
}

const STEPS: JourneyStep[] = [
  {
    id: "production",
    title: "Production",
    era: "The past",
    question: "How was this item born?",
  },
  {
    id: "delivery",
    title: "Delivery",
    era: "The present",
    question: "What gets it to my door?",
  },
  {
    id: "circularity",
    title: "Lifetime value",
    era: "The future",
    question: "How long can I own it?",
  },
];

const STEP_STYLES: Record<JourneyStepId, string> = {
  production: "bg-amber-50 text-amber-700",
  delivery: "bg-blue-50 text-bol-blue",
  circularity: "bg-green-50 text-bol-green",
};

export default function ProductTimeMachine({ product }: { product: Product }) {
  const [activeStep, setActiveStep] = useState<JourneyStepId>("production");
  const step = STEPS.find((item) => item.id === activeStep) ?? STEPS[0];
  const facts = journeyFacts(product, step.id);

  return (
    <div>
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

      <div className="mt-3 rounded-xl border border-bol-border bg-bol-gray/60 p-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              STEP_STYLES[step.id]
            }`}
          >
            <StepIcon step={step.id} className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              {step.era}
            </p>
            <h4 className="text-base font-black text-bol-ink">{step.question}</h4>
          </div>
        </div>

        {facts.length > 0 ? (
          <dl className="mt-4 divide-y divide-bol-border overflow-hidden rounded-lg border border-bol-border bg-white">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="grid grid-cols-[1fr_auto] gap-3 px-3 py-2.5 text-sm"
              >
                <dt className="text-zinc-600">{fact.label}</dt>
                <dd className={factValueClassName(fact)}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
            No data for this part yet.
          </p>
        )}
      </div>
    </div>
  );
}

function journeyFacts(product: Product, step: JourneyStepId): JourneyFact[] {
  if (step === "production") {
    return compactFacts([
      product.co2Kg != null
        ? { label: "CO₂ footprint", value: `${product.co2Kg} kg` }
        : null,
      product.countryOfOrigin
        ? { label: "Origin", value: product.countryOfOrigin }
        : null,
      product.packaging ? { label: "Packaging", value: product.packaging } : null,
      {
        label: "Carbon neutral",
        value: product.carbonNeutral ? "✓" : "×",
        tone: product.carbonNeutral ? "positive" : "negative",
      },
      originLabel(product.ecoLabel)
        ? { label: "Origin label", value: product.ecoLabel }
        : null,
    ]);
  }

  if (step === "delivery") {
    return [
      {
        label: "Standard",
        value: product.normalDelivery ? "✓" : "×",
        tone: product.normalDelivery ? "positive" : "negative",
      },
      {
        label: "Next day",
        value: product.nextDay ? "✓" : "×",
        tone: product.nextDay ? "positive" : "negative",
      },
      {
        label: "Same day",
        value: product.sameDay ? "✓" : "×",
        tone: product.sameDay ? "positive" : "negative",
      },
    ];
  }

  return compactFacts([
    product.lifespanYears != null
      ? { label: "Lifespan", value: `${product.lifespanYears} years` }
      : null,
    product.repairability != null
      ? {
          label: "Repairability",
          value: `${product.repairability}/${product.repairability <= 5 ? 5 : 10}`,
        }
      : null,
    product.recyclablePct != null
      ? { label: "Recyclable", value: `${product.recyclablePct}%` }
      : null,
    futureLabel(product.ecoLabel)
      ? { label: "Future label", value: product.ecoLabel }
      : null,
  ]);
}

function compactFacts(facts: Array<JourneyFact | null>): JourneyFact[] {
  return facts.filter((fact): fact is JourneyFact => fact != null);
}

function factValueClassName(fact: JourneyFact): string {
  if (fact.tone === "positive") return "text-lg font-black text-green-600";
  if (fact.tone === "negative") return "text-lg font-black text-rose-500";
  return "text-right font-bold text-bol-ink";
}

function originLabel(label: string): boolean {
  return ["EU Ecolabel", "FSC Certified", "Fair Trade"].includes(label);
}

function futureLabel(label: string): boolean {
  return ["Energy Star", "Cradle to Cradle"].includes(label);
}

function StepIcon({
  step,
  className = "",
}: {
  step: JourneyStepId;
  className?: string;
}) {
  if (step === "production") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className={className}
      >
        <path d="M4 14h16v5H4zM6 14V9l4 3V9l4 3V7h4v7" />
      </svg>
    );
  }

  if (step === "delivery") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className={className}
      >
        <path d="M3 7h11v10H3zM14 11h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
    >
      <path
        d="M7 7a7 7 0 0 1 11 3M17 7h2V5M17 17a7 7 0 0 1-11-3M7 17H5v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 8v4l3 2" strokeLinecap="round" />
    </svg>
  );
}

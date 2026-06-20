import type { Product } from "@/lib/products";
import { packagingScore } from "@/lib/scoring";

interface TimelineStep {
  label: string;
  title: string;
  text: string;
  icon: string;
}

function years(product: Product): string {
  if (product.lifespanYears == null) return "Later";
  return `Year ${Math.max(1, Math.round(product.lifespanYears))}`;
}

function durableTimeline(product: Product): TimelineStep[] {
  const end =
    product.recyclablePct != null && product.recyclablePct >= 65
      ? "Recycle or reuse"
      : product.recyclablePct != null && product.recyclablePct >= 35
        ? "Partial recycling"
        : "Higher landfill risk";
  return [
    { label: "Today", title: "Purchased", text: "The product starts its useful life.", icon: "🛒" },
    {
      label: years(product),
      title: "Expected use",
      text: product.lifespanYears
        ? `Estimated to stay useful for about ${product.lifespanYears} years.`
        : "Lifespan data is missing, so this future is less certain.",
      icon: "📅",
    },
    ...(product.repairability != null && product.repairability >= 3
      ? [
          {
            label: "Mid-life",
            title: "Repair moment",
            text: "Repairability suggests one issue could be fixed instead of replaced.",
            icon: "🛠️",
          },
        ]
      : []),
    { label: "End", title: end, text: futureOutcome(product), icon: "♻️" },
  ];
}

function timelineFor(product: Product): TimelineStep[] {
  if (["Electronics", "Fitness", "Home & Garden"].includes(product.category)) {
    return durableTimeline(product);
  }
  if (product.category === "Fashion") {
    return [
      { label: "Today", title: "Bought", text: "A new item enters the wardrobe.", icon: "👕" },
      {
        label: years(product),
        title: "Worn over time",
        text: product.lifespanYears ? `Expected use is about ${product.lifespanYears} years.` : "Use period is estimated from sparse data.",
        icon: "📅",
      },
      {
        label: "Next owner",
        title: product.recyclablePct != null && product.recyclablePct > 60 ? "Donate, resell or recycle" : "Donate or resell",
        text: "A durable item has a better chance of a second life.",
        icon: "🔁",
      },
    ];
  }
  if (product.category === "Baby") {
    return [
      { label: "Today", title: "Used until outgrown", text: "Baby products often have a short first-owner window.", icon: "🍼" },
      { label: "Next", title: "Passed on", text: "Durable products are easier to reuse by another family.", icon: "🤝" },
      { label: "End", title: "Recycle if possible", text: futureOutcome(product), icon: "♻️" },
    ];
  }
  if (product.category === "Beauty & Skincare" || product.category === "Food & Beverage") {
    const pkgScore = packagingScore(product.packaging) ?? 0;
    return [
      { label: "Today", title: "Bought", text: "The biggest future question is packaging waste.", icon: "🛒" },
      { label: "Soon", title: "Used or consumed", text: "The product itself has a short use phase.", icon: "✨" },
      {
        label: "After use",
        title: pkgScore >= 70 ? "Packaging recycled" : "Packaging impact remains",
        text: futureOutcome(product),
        icon: "♻️",
      },
    ];
  }
  if (product.category === "Digital Goods") {
    return [
      { label: "Today", title: "Downloaded", text: "No physical package is needed.", icon: "⬇️" },
      { label: "Ongoing", title: "Used over time", text: "The future impact mainly comes from digital energy use.", icon: "💾" },
      {
        label: "Later",
        title: product.co2Kg != null && product.co2Kg > 8 ? "Watch digital footprint" : "Low packaging impact",
        text: futureOutcome(product),
        icon: "⚡",
      },
    ];
  }
  return durableTimeline(product);
}

function futureOutcome(product: Product): string {
  if (product.recyclablePct != null && product.recyclablePct >= 70) {
    return "Future outcome: strong recycling potential if local facilities accept the material.";
  }
  if (product.lifespanYears != null && product.lifespanYears >= 5) {
    return "Future outcome: longer use can reduce replacement pressure.";
  }
  if (product.carbonNeutral || product.ecoLabel) {
    return "Future outcome: certification gives a clearer sustainability signal.";
  }
  return "Future outcome: some data is missing, so the end-of-life picture is less certain.";
}

export default function ProductTimeMachine({ product }: { product: Product }) {
  const steps = timelineFor(product);

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => (
          <div key={`${step.label}-${step.title}`} className="relative rounded-lg border border-bol-border bg-white p-3">
            {index < steps.length - 1 && (
              <div className="absolute left-8 top-7 hidden h-0.5 w-[calc(100%+0.75rem)] bg-bol-green/30 md:block" />
            )}
            <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-bol-green text-lg text-white">
              {step.icon}
            </div>
            <p className="mt-3 text-xs font-bold uppercase text-bol-green">{step.label}</p>
            <h4 className="mt-1 text-sm font-bold text-bol-ink">{step.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600">{step.text}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-lg bg-bol-green/10 px-3 py-2 text-sm font-medium text-bol-green">
        {futureOutcome(product)}
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";

const STAGE_COLORS = [
  "bg-sky-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-bol-blue",
  "bg-bol-green",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-zinc-600",
];

export default function ProductJourneyCompare({ products }: { products: Product[] }) {
  const visibleProducts = products.slice(0, 2);
  const maxStages = Math.max(...visibleProducts.map((product) => product.lifecycle.length), 0);
  const [stageIndex, setStageIndex] = useState(0);

  if (visibleProducts.length < 2 || maxStages === 0) return null;

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
          Pick a step to compare what may happen after purchase.
        </p>
      </div>

      <div className="p-5">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: maxStages }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setStageIndex(index)}
              className={`flex min-w-24 items-center gap-2 rounded-full border px-3 py-2 text-left text-xs font-bold transition ${
                stageIndex === index
                  ? "border-bol-blue bg-bol-blue text-white"
                  : "border-bol-border bg-white text-bol-blue hover:border-bol-blue"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                  stageIndex === index
                    ? "bg-white text-bol-blue"
                    : `${STAGE_COLORS[index % STAGE_COLORS.length]} text-white`
                }`}
              >
                {index + 1}
              </span>
              <span>{stageLabel(visibleProducts, index)}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {visibleProducts.map((product) => (
            <JourneyProductPanel
              key={product.id}
              product={product}
              stageIndex={stageIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function JourneyProductPanel({
  product,
  stageIndex,
}: {
  product: Product;
  stageIndex: number;
}) {
  const stage = product.lifecycle[stageIndex];

  return (
    <article className="rounded-lg border border-bol-border bg-white p-4">
      <h3 className="line-clamp-2 text-base font-bold text-bol-ink">{product.name}</h3>

      <div className="mt-3 rounded-xl border border-bol-border bg-bol-gray/60 p-4">
        {stage ? (
          <>
            <p className="text-xs font-bold uppercase tracking-wide text-bol-green">
              Step {stageIndex + 1} · {stage.label}
            </p>
            <p className="mt-2 text-xl font-black leading-tight text-bol-ink">
              {stage.title}
            </p>
          </>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
              Step {stageIndex + 1}
            </p>
            <p className="mt-2 text-xl font-black leading-tight text-bol-ink">
              No data for this step
            </p>
          </>
        )}
      </div>
    </article>
  );
}

function stageLabel(products: Product[], index: number): string {
  return products.find((product) => product.lifecycle[index])?.lifecycle[index]?.label ?? `Step ${index + 1}`;
}

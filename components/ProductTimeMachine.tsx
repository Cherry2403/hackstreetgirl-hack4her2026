import type { Product } from "@/lib/products";

/**
 * Product lifecycle stepper ("Time Machine"). Stages come straight from the
 * product's `lifecycle` (CSV `Lifecycle_Stages` column) so they are specific
 * per product and differ in comparison. Titles only — no icons, no blurbs.
 */
export default function ProductTimeMachine({ product }: { product: Product }) {
  const steps = product.lifecycle;
  if (steps.length === 0) return null;

  return (
    <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
      {steps.map((step, index) => (
        <li
          key={`${step.label}-${index}`}
          className="relative flex-1 rounded-lg border border-bol-border bg-white p-3 sm:rounded-none sm:border-l-0 sm:first:rounded-l-lg sm:first:border-l sm:last:rounded-r-lg"
        >
          {/* step number */}
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bol-green/10 text-xs font-bold text-bol-green">
            {index + 1}
          </span>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-bol-green">
            {step.label}
          </p>
          <p className="mt-0.5 text-sm font-semibold leading-tight text-bol-ink">
            {step.title}
          </p>
        </li>
      ))}
    </ol>
  );
}

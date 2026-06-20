import type { Product } from "@/lib/products";
import { LeafIcon } from "@/components/SustainabilityBadge";
import { getT } from "@/lib/i18n/server";

function Metric({
  label,
  value,
  hint,
  good,
}: {
  label: string;
  value: string;
  hint?: string;
  good?: boolean;
}) {
  return (
    <div className="rounded-lg border border-bol-border bg-white p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p
        className={`text-lg font-bold ${good ? "text-bol-green" : "text-bol-ink"}`}
      >
        {value}
      </p>
      {hint && <p className="text-[11px] text-zinc-400">{hint}</p>}
    </div>
  );
}

/** The hackathon's hero feature: a clear sustainability overview per product. */
export default async function SustainabilityPanel({
  product,
}: {
  product: Product;
}) {
  const { t } = await getT();
  const score = product.sustainabilityScore;
  const scoreLabel =
    score >= 70 ? t("sus.excellent") : score >= 50 ? t("sus.average") : t("sus.limited");
  const unknown = t("sus.unknown");

  return (
    <section className="rounded-xl border border-bol-green/30 bg-bol-green/5 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full bg-bol-green text-white">
          <LeafIcon className="h-5 w-5" />
          <span className="text-sm font-bold leading-none">{score}</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-bol-ink">
            {t("sus.title")}: {scoreLabel}
          </h2>
          <p className="text-sm text-zinc-600">
            Score {score}/100 {t("sus.scoreBasis")}
          </p>
        </div>
      </div>

      {/* progress bar */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-bol-green"
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric
          label={t("sus.co2")}
          value={product.co2Kg != null ? `${product.co2Kg} kg` : unknown}
          good={product.co2Kg != null && product.co2Kg < 10}
          hint={t("sus.co2Hint")}
        />
        <Metric
          label={t("sus.recyclable")}
          value={
            product.recyclablePct != null ? `${product.recyclablePct}%` : unknown
          }
          good={product.recyclablePct != null && product.recyclablePct >= 60}
        />
        <Metric
          label={t("sus.repairability")}
          value={
            product.repairability != null ? `${product.repairability}/5` : unknown
          }
          good={product.repairability != null && product.repairability >= 4}
        />
        <Metric
          label={t("sus.lifespan")}
          value={
            product.lifespanYears != null
              ? `${product.lifespanYears} ${t("row.lifespanUnit")}`
              : unknown
          }
          good={product.lifespanYears != null && product.lifespanYears >= 5}
        />
      </div>

      {(product.ecoLabel || product.carbonNeutral) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {product.ecoLabel && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-medium text-bol-green ring-1 ring-bol-green/30">
              <LeafIcon className="h-4 w-4" /> {product.ecoLabel}
            </span>
          )}
          {product.carbonNeutral && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-medium text-bol-green ring-1 ring-bol-green/30">
              <LeafIcon className="h-4 w-4" /> {t("sus.carbonNeutralCert")}
            </span>
          )}
        </div>
      )}
    </section>
  );
}

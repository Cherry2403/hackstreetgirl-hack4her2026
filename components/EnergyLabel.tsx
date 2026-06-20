import type { Product } from "@/lib/products";
import { getT } from "@/lib/i18n/server";

const GRADE_COLORS: Record<string, string> = {
  A: "#00a651",
  B: "#4cb847",
  C: "#c3d600",
  D: "#fff200",
  E: "#fcb814",
  F: "#f37021",
  G: "#ed1c24",
};

/** Derive an EU-energy-label grade A-G from the sustainability score. */
function gradeFor(score: number): string {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  if (score >= 40) return "E";
  if (score >= 30) return "F";
  return "G";
}

/** bol-style EU energy-label arrow badge ("A" through "G"). */
export default async function EnergyLabel({ product }: { product: Product }) {
  const { t } = await getT();
  const grade = gradeFor(product.sustainabilityScore);
  const color = GRADE_COLORS[grade];

  return (
    <span className="inline-flex items-center gap-1.5" title="Energielabel">
      <span className="flex items-center overflow-hidden rounded-sm">
        <span className="bg-[#1a1a1a] px-1 py-0.5 text-[9px] font-bold leading-none text-white">
          A<span className="align-super text-[6px]">+++</span>
        </span>
        <span
          className="relative px-1.5 py-0.5 text-[11px] font-bold leading-none text-white"
          style={{
            backgroundColor: color,
            clipPath: "polygon(0 0, 75% 0, 100% 50%, 75% 100%, 0 100%)",
            paddingRight: "0.5rem",
          }}
        >
          {grade}
        </span>
      </span>
      <span className="text-xs text-bol-link hover:underline">
        {t("energy.infoSheet")}
      </span>
    </span>
  );
}

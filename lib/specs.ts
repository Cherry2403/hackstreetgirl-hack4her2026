import type { Product } from "./products";
import { translate, type Lang } from "./i18n/translate";

export interface SpecRow {
  label: string;
  value: string;
}

export interface SpecGroup {
  title: string;
  rows: SpecRow[];
}

const dash = "–";

/** Build bol-style grouped product specifications from a product. */
export function buildSpecGroups(p: Product, lang: Lang = "nl"): SpecGroup[] {
  const t = (k: Parameters<typeof translate>[1]) => translate(lang, k);
  const yesNo = (v: boolean) => (v ? t("common.yes") : t("common.no"));
  const localeStr = lang === "nl" ? "nl-NL" : "en-GB";

  return [
    {
      title: t("spec.general"),
      rows: [
        { label: t("spec.brand"), value: p.brand },
        { label: t("spec.category"), value: p.category || dash },
        { label: t("spec.subcategory"), value: p.subcategory || dash },
        { label: t("spec.productId"), value: p.id },
      ],
    },
    {
      title: t("spec.sustainability"),
      rows: [
        {
          label: t("spec.sustainabilityScore"),
          value: `${p.sustainabilityScore} / 100`,
        },
        {
          label: t("spec.co2"),
          value: p.co2Kg != null ? `${p.co2Kg} kg` : dash,
        },
        { label: t("spec.ecoLabel"), value: p.ecoLabel || dash },
        { label: t("spec.carbonNeutralCert"), value: yesNo(p.carbonNeutral) },
        { label: t("spec.packaging"), value: p.packaging || dash },
        {
          label: t("spec.repairScore"),
          value: p.repairability != null ? `${p.repairability} / 5` : dash,
        },
        {
          label: t("spec.recyclableMaterial"),
          value: p.recyclablePct != null ? `${p.recyclablePct}%` : dash,
        },
        {
          label: t("spec.estLifespan"),
          value:
            p.lifespanYears != null
              ? `${p.lifespanYears} ${t("spec.year")}`
              : dash,
        },
        { label: t("spec.countryOrigin"), value: p.countryOfOrigin || dash },
      ],
    },
    {
      title: t("spec.deliveryStock"),
      rows: [
        { label: t("spec.availToday"), value: yesNo(p.sameDay) },
        { label: t("spec.availTomorrow"), value: yesNo(p.nextDay) },
        { label: t("spec.standardDelivery"), value: yesNo(p.normalDelivery) },
        { label: t("spec.warehouse"), value: p.warehouseName || dash },
        { label: t("spec.warehouseAddress"), value: p.warehouseAddress || dash },
        { label: t("spec.gln"), value: p.warehouseGln || dash },
      ],
    },
    {
      title: t("spec.priceSales"),
      rows: [
        {
          label: t("spec.priceFrom"),
          value: `€ ${p.priceFrom.toFixed(2).replace(".", ",")}`,
        },
        {
          label: t("spec.priceTo"),
          value: `€ ${p.priceTo.toFixed(2).replace(".", ",")}`,
        },
        {
          label: t("spec.soldIn2025"),
          value: p.unitsSold.toLocaleString(localeStr),
        },
      ],
    },
  ];
}

/** Flatten all spec rows into a single label→value map (for compare table). */
export function buildSpecMap(p: Product, lang: Lang = "nl"): Map<string, string> {
  const map = new Map<string, string>();
  for (const group of buildSpecGroups(p, lang)) {
    for (const row of group.rows) {
      map.set(row.label, row.value);
    }
  }
  return map;
}

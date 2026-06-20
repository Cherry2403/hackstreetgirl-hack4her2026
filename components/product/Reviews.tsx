import type { Product } from "@/lib/products";
import StarRating from "@/components/StarRating";
import { getT } from "@/lib/i18n/server";

const SNIPPETS = [
  {
    title: { nl: "Echt een aanrader", en: "Really recommended" },
    body: {
      nl: "Snelle levering en precies zoals omschreven. Fijn dat de duurzaamheid hier inzichtelijk is.",
      en: "Fast delivery and exactly as described. Nice that sustainability is made transparent here.",
    },
    author: "Sanne",
    place: "Utrecht",
    age: { nl: "30-39 jaar", en: "age 30-39" },
  },
  {
    title: { nl: "Goede kwaliteit", en: "Good quality" },
    body: {
      nl: "Doet wat het moet doen. Verpakking was netjes en milieuvriendelijk. Tevreden mee.",
      en: "Does what it should. Packaging was neat and eco-friendly. Happy with it.",
    },
    author: "Pieter",
    place: "Rotterdam",
    age: { nl: "50-59 jaar", en: "age 50-59" },
  },
  {
    title: { nl: "Prima product", en: "Decent product" },
    body: {
      nl: "Voor de prijs een goede keuze. Had iets meer verwacht qua materiaal maar verder oké.",
      en: "Good value for the price. Expected a bit more from the material but otherwise fine.",
    },
    author: "Yossi",
    place: "Nijmegen",
    age: { nl: "60-69 jaar", en: "age 60-69" },
  },
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Deterministic review section derived from the product's rating/id. */
export default async function Reviews({ product }: { product: Product }) {
  const { t, lang } = await getT();
  const shown = Math.min(3, Math.max(1, hash(product.id) % 4));
  const reviews = Array.from({ length: shown }, (_, i) => {
    const s = SNIPPETS[(hash(product.id) + i) % SNIPPETS.length];
    const stars = Math.max(
      1,
      Math.min(5, Math.round(product.rating) + (i % 2 === 0 ? 0 : -1)),
    );
    return { ...s, stars };
  });

  // star distribution
  const dist = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: stars === Math.round(product.rating) ? Math.ceil(product.reviewCount * 0.5) : Math.floor(product.reviewCount * 0.12),
  }));
  const maxCount = Math.max(...dist.map((d) => d.count), 1);

  return (
    <section id="reviews">
      <h2 className="mb-4 text-xl font-bold">{t("reviews.title")}</h2>
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Summary */}
        <div className="w-full md:w-64 md:shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold">
              {product.rating.toFixed(1).replace(".", ",")}
            </span>
            <div>
              <StarRating rating={product.rating} size="md" showCount={false} />
              <p className="text-xs text-zinc-500">
                {product.reviewCount} {t("product.reviews")}
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            {dist.map((d) => (
              <div key={d.stars} className="flex items-center gap-2 text-xs">
                <span className="w-3">{d.stars}</span>
                <div className="h-2 flex-1 overflow-hidden rounded bg-bol-gray">
                  <div
                    className="h-full bg-bol-yellow-dark"
                    style={{ width: `${(d.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-zinc-400">{d.count}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-md border border-bol-blue py-2 text-sm font-medium text-bol-blue hover:bg-bol-blue/5">
            {t("reviews.writeReview")}
          </button>
        </div>

        {/* Individual reviews */}
        <div className="flex-1 space-y-4">
          {reviews.map((r, i) => (
            <article key={i} className="border-b border-bol-border pb-4 last:border-0">
              <div className="flex items-center gap-2">
                <StarRating rating={r.stars} showCount={false} />
                <h3 className="text-sm font-bold">{r.title[lang]}</h3>
              </div>
              <p className="mt-1 text-sm text-zinc-700">{r.body[lang]}</p>
              <p className="mt-1 text-xs text-zinc-400">
                {r.author} · {r.place} · {r.age[lang]} · {t("reviews.boughtThis")}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

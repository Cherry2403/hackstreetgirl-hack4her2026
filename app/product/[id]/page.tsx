import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductById,
  getRelatedProducts,
} from "@/lib/products";
import { buildSpecGroups } from "@/lib/specs";
import Gallery from "@/components/product/Gallery";
import BuyBox from "@/components/product/BuyBox";
import SpecTable from "@/components/product/SpecTable";
import SustainabilityPanel from "@/components/product/SustainabilityPanel";
import Reviews from "@/components/product/Reviews";
import ProductRail from "@/components/ProductRail";
import StarRating from "@/components/StarRating";
import { SustainabilityTags } from "@/components/SustainabilityBadge";
import AddToCompareButton from "@/components/compare/AddToCompareButton";
import { getT } from "@/lib/i18n/server";
import {
  translate,
  translateFormat,
  type Lang,
} from "@/lib/i18n/translate";

export async function generateMetadata(props: PageProps<"/product/[id]">) {
  const { id } = await props.params;
  const product = getProductById(id);
  return {
    title: product ? `${product.name} | bol` : "Product not found | bol",
  };
}

export default async function ProductPage(props: PageProps<"/product/[id]">) {
  const { id } = await props.params;
  const product = getProductById(id);
  if (!product) notFound();

  const { t, lang } = await getT();
  const related = getRelatedProducts(product, 10);
  const alsoViewed = getRelatedProducts(product, 8).slice().reverse();
  const specGroups = buildSpecGroups(product, lang);
  const description = buildDescription(product, lang);

  return (
    <div className="mx-auto max-w-7xl px-4 py-4">
      {/* Breadcrumb */}
      <nav className="mb-3 text-xs text-zinc-500">
        <Link href="/" className="hover:underline">
          {t("common.home")}
        </Link>
        <span className="mx-1">/</span>
        <Link
          href={`/search?category=${encodeURIComponent(product.category)}`}
          className="hover:underline"
        >
          {product.category}
        </Link>
        <span className="mx-1">/</span>
        <span className="text-zinc-700">{product.subcategory}</span>
      </nav>

      {/* Top: gallery + info + buy box */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6 md:grid-cols-2">
          <Gallery id={product.id} name={product.name} />

          <div>
            <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {t("common.brand")}:{" "}
              <Link
                href={`/search?q=${encodeURIComponent(product.brand)}`}
                className="text-bol-link hover:underline"
              >
                {product.brand}
              </Link>
            </p>

            <a href="#reviews" className="mt-2 inline-flex items-center gap-2">
              <StarRating rating={product.rating} size="md" showCount={false} />
              <span className="text-sm text-bol-link hover:underline">
                {product.rating.toFixed(1).replace(".", ",")} ·{" "}
                {t("product.viewReviews")} {product.reviewCount}{" "}
                {t("product.reviews")}
              </span>
            </a>

            <div className="mt-3">
              <SustainabilityTags product={product} />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-zinc-700">
              {description.intro}
            </p>

            <div className="mt-4">
              <AddToCompareButton
                item={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  rating: product.rating,
                  reviewCount: product.reviewCount,
                }}
              />
            </div>
          </div>
        </div>

        {/* Buy column */}
        <div className="lg:row-span-2">
          <BuyBox product={product} />
        </div>
      </div>

      {/* Sustainability panel */}
      <div className="mt-8">
        <SustainabilityPanel product={product} />
      </div>

      {/* Description */}
      <section className="mt-8 max-w-3xl">
        <h2 className="mb-3 text-xl font-bold">{t("product.description")}</h2>
        <div className="space-y-3 text-sm leading-relaxed text-zinc-700">
          {description.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Specs */}
      <section className="mt-8 max-w-3xl">
        <h2 className="mb-4 text-xl font-bold">{t("product.specifications")}</h2>
        <SpecTable groups={specGroups} />
      </section>

      {/* Reviews */}
      <div className="mt-10 max-w-3xl">
        <Reviews product={product} />
      </div>

      {/* Related rails */}
      <div className="mt-10">
        <ProductRail
          title={t("product.alsoViewed")}
          products={related}
          seeAllHref={`/search?category=${encodeURIComponent(product.category)}`}
        />
        <ProductRail title={t("product.boughtTogether")} products={alsoViewed} />
      </div>
    </div>
  );
}

function buildDescription(
  product: {
    name: string;
    brand: string;
    category: string;
    subcategory: string;
    packaging: string;
    countryOfOrigin: string;
    ecoLabel: string;
    carbonNeutral: boolean;
  },
  lang: Lang,
): { intro: string; paragraphs: string[] } {
  const origin = product.countryOfOrigin
    ? translateFormat(lang, "desc.producedIn", { country: product.countryOfOrigin })
    : "";
  const eco = product.carbonNeutral
    ? translate(lang, "desc.ecoCarbonNeutral")
    : product.ecoLabel
      ? translateFormat(lang, "desc.ecoLabel", { label: product.ecoLabel })
      : "";
  const pkg = product.packaging
    ? translateFormat(lang, "desc.packaging", { packaging: product.packaging })
    : "";

  return {
    intro: translateFormat(lang, "desc.intro", {
      name: product.name,
      subcategory: product.subcategory.toLowerCase(),
      brand: product.brand,
    }),
    paragraphs: [
      translateFormat(lang, "desc.para1", {
        name: product.name,
        category: product.category,
        origin,
        eco,
      }),
      translateFormat(lang, "desc.para2", { packaging: pkg }),
      translate(lang, "desc.para3"),
    ],
  };
}

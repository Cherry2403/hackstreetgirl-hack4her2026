<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project conventions
- **Styling:** Tailwind-first (Tailwind v4). Use plain CSS only when Tailwind genuinely can't express it. Keep `globals.css` minimal.
- **Data:** Frontend-only. No real backend. Source of truth is `data/productData.csv` (1000 rows). API route handlers read the CSV, then filter / paginate / randomize.
- **Next.js v16 notes:** `params` & `searchParams` are `Promise`s (await them). Route handlers live in `app/api/**/route.ts`. Use `PageProps<'/route'>` typed helpers.

## CSV schema (data/productData.csv)
Product_ID, Product_Name, Category, Subcategory, Estimated_Total_Units_Sold_in_2025,
Estimated_Revenue_in_2025_USD, Price_From_EUR, Price_To_EUR, WarehouseName,
WarehouseCode, WarehouseGLN, WarehouseAddress, IsSameDayAvailable, IsNextDayAvailable,
IsNormalDeliveryAvailable, Country_Of_Origin, CO2_Footprint_kg, Packaging_Type,
Repairability_Score, Estimated_Lifespan_Years, Material_Recyclable_Pct, Eco_Label,
Carbon_Neutral_Certified

- 10 categories (Fitness, Beauty & Skincare, Baby, Digital Goods, Electronics, Home & Garden, Pet, Fashion, Eco-Friendly, Food & Beverage)
- 48 subcategories, 5 warehouses, eco labels (Energy Star, EU Ecolabel, FSC Certified, Cradle to Cradle, Fair Trade)
- Many fields are sparse/blank — UI must degrade gracefully (sustainability data is the hackathon angle).

# Build plan — bol.com frontend clone

## Phase 1 — Data layer & API  ✅
- [x] `lib/products.ts`: parse CSV (cached), types, derived fields (price, image seed, rating, slug), helpers (search/filter/sort/paginate, byId, related, facets).
- [x] `app/api/products/route.ts`: GET search results — query `q`, `category`, `sort`, `page`, filters → JSON + total + facets.
- [x] `app/api/products/[id]/route.ts`: GET single product.

## Phase 2 — Shared layout & chrome  ✅
- [x] bol-style top header (logo, search bar, account/cart links) + slim category nav bar.
- [x] Footer. Wire into root layout. bol brand styling (blue #0000a4 / yellow accents) via Tailwind theme.
- [x] Reusable `ProductCard`, `StarRating`, `Price`, `SustainabilityBadge` components.

## Phase 3 — Home page  ✅
- [x] Hero / category tiles + a few product rails ("Anderen bekeken ook", deals) sourced from API.

## Phase 4 — Search results page (`/zoeken`)  ✅
- [x] Left filter sidebar (category, price, eco/sustainability, delivery, warehouse) from facets.
- [x] Result grid/list with sort dropdown, result count, pagination. Reads `searchParams`.

## Phase 5 — Product detail page (`/product/[id]`)  ✅
- [x] Gallery, title/brand/rating, price box + buy column, specs table, description, sustainability panel, reviews, "compare" link, related rails.

## Phase 6 — Compare page (`/vergelijk`)  ✅
- [x] Side-by-side spec comparison of 2+ products (ids via query), "show only differences" toggle.

## Phase 7 — Polish  ✅
- [x] Loading states, empty states, responsive, dark-mode cleanup, verify build + dev run.

## Phase 8 — Fidelity pass (match real bol.com)  ✅
- [x] Header: utility bar (free shipping / delivery / returns / Select), white `logo.png` (CSS invert), pill search bar, Login + heart + cart.
- [x] Search results: bol-style list rows (image left, info middle, price/buy right), "Good Choice" eco badge, energy label, per-row "Compare with other articles" checkbox.
- [x] Compare selection: `CompareContext` (localStorage-backed, max 4) + floating "Compare articles (n/4)" tray with thumbnails, remove, and Compare button → `/compare?ids=`.
- [x] Compare page restyled closer to bol.

## Phase 9 — English rename + i18n  ✅
- [x] Routes/folders renamed to English: `/zoeken`→`/search`, `/vergelijk`→`/compare`.
- [x] All code identifiers + UI strings in English; hardcoded copy moved to a dictionary.
- [x] **i18n**: `lib/i18n/` (dictionary, `translate`/`translateFormat`, server `getLang`/`getT`) + `components/i18n/` (`LanguageProvider`, `LanguageSwitcher`).
  - Default language = **Dutch (nl)**; switchable to English (en).
  - Language stored in the `bol_lang` cookie → readable in server components, so pages re-render in the chosen language. Switcher writes the cookie + `router.refresh()`. NL/EN toggle lives in the header utility bar.
  - Server components: `const { t, lang } = await getT()`. Client components: `const { t } = useLanguage()`.
  - Note: reading the cookie opts all pages into dynamic rendering (fine for a demo).
- [x] Header search bar background set to white.

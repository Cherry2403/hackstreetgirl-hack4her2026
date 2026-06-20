// UI string dictionary. Dutch (nl) is the default/original language; English (en)
// is the secondary. Add a key here and use it via the `useLanguage()` hook's `t()`.

export type Lang = "nl" | "en";

export const LANGS: Lang[] = ["nl", "en"];

export const dictionary = {
  // ---- Header / utility bar ----
  "util.freeShipping": { nl: "Gratis verzending vanaf 25", en: "Free shipping from 25" },
  "util.delivery": {
    nl: "Vandaag, 's avonds of in het weekend bezorgd*",
    en: "Delivered today, evening or weekend*",
  },
  "util.freeReturns": { nl: "Gratis retourneren", en: "Free returns" },
  "util.selectBenefits": { nl: "Ontdek nu de 4 voordelen", en: "Discover the 4 benefits now" },
  "header.searchPlaceholder": {
    nl: "Waar ben je naar op zoek?",
    en: "What are you looking for?",
  },
  "header.search": { nl: "Zoeken", en: "Search" },
  "header.login": { nl: "Inloggen", en: "Login" },
  "header.wishlist": { nl: "Verlanglijst", en: "Wishlist" },
  "header.cart": { nl: "Winkelwagen", en: "Cart" },
  "header.allCategories": { nl: "Alle categorieën", en: "All categories" },
  "common.free": { nl: "Gratis", en: "Free" },

  // ---- Home ----
  "home.badge": { nl: "Nieuw: duurzaamheidsscores", en: "New: sustainability scores" },
  "home.heroTitle": { nl: "Winkel slim. Kies duurzaam.", en: "Shop smart. Choose sustainable." },
  "home.heroSub": {
    nl: "Vergelijk producten op prijs én op duurzaamheid — CO₂-voetafdruk, repareerbaarheid en eco-labels in één oogopslag.",
    en: "Compare products on price and sustainability — CO₂ footprint, repairability and eco-labels at a glance.",
  },
  "home.heroCta": { nl: "Ontdek duurzame producten", en: "Discover sustainable products" },
  "home.shopByCategory": { nl: "Shop per categorie", en: "Shop by category" },
  "home.products": { nl: "producten", en: "products" },
  "home.railSustainable": { nl: "🌿 Meest duurzame keuzes", en: "🌿 Most sustainable choices" },
  "home.railPopular": { nl: "Populair op bol", en: "Popular on bol" },
  "home.railDeals": { nl: "Deals van de dag", en: "Deals of the day" },
  "home.railAlsoViewed": { nl: "Anderen bekeken ook", en: "Others also viewed" },

  // ---- Rails / cards ----
  "rail.seeAll": { nl: "Bekijk de hele lijst", en: "View the full list" },
  "card.today": { nl: "Vandaag in huis", en: "Delivered today" },
  "card.tomorrow": { nl: "Morgen in huis", en: "Delivered tomorrow" },
  "card.inStock": { nl: "Op voorraad", en: "In stock" },
  "card.sponsored": { nl: "Gesponsord", en: "Sponsored" },
  "badge.goodChoice": { nl: "Goede keuze", en: "Good Choice" },
  "badge.carbonNeutral": { nl: "CO₂-neutraal", en: "Carbon neutral" },
  "badge.recyclable": { nl: "recyclebaar", en: "recyclable" },
  "badge.biodegradable": { nl: "Biologisch afbreekbaar", en: "Biodegradable" },
  "energy.infoSheet": { nl: "Productinformatieblad", en: "Product information sheet" },
  "score.tooltip": { nl: "Duurzaamheidsscore", en: "Sustainability score" },

  // ---- Result-row spec line + blurb ----
  "row.origin": { nl: "Herkomst", en: "Origin" },
  "row.lifespan": { nl: "Levensduur", en: "Lifespan" },
  "row.lifespanUnit": { nl: "jr", en: "yr" },
  "row.repairable": { nl: "Repareerbaar", en: "Repairable" },
  "row.blurbCarbonNeutral": {
    nl: "CO₂-neutraal geproduceerd",
    en: "carbon-neutrally produced",
  },
  "row.blurbEcoLabel": { nl: "voorzien van het", en: "carries the" },
  "row.blurbEcoLabelSuffix": { nl: "keurmerk", en: "quality mark" },
  "row.blurbConscious": { nl: "een bewuste keuze", en: "a conscious choice" },
  "row.blurbConnector": { nl: "van", en: "by" },
  "row.blurbReturns": {
    nl: "Met 30 dagen bedenktijd en gratis retourneren.",
    en: "With 30-day right of return and free returns.",
  },

  // ---- Breadcrumb / common ----
  "common.home": { nl: "Home", en: "Home" },
  "common.brand": { nl: "Merk", en: "Brand" },
  "common.soldBy": { nl: "Verkoop door", en: "Sold by" },
  "common.results": { nl: "resultaten", en: "results" },
  "common.addToCart": { nl: "In winkelwagen", en: "Add to cart" },
  "common.added": { nl: "✓ Toegevoegd", en: "✓ Added" },

  // ---- Search page ----
  "search.allProducts": { nl: "Alle producten", en: "All products" },
  "search.resultsFor": { nl: "Zoekresultaten voor", en: "Search results for" },
  "search.sort": { nl: "Sorteren:", en: "Sort by:" },
  "search.compareRow": {
    nl: "Vergelijk met andere artikelen",
    en: "Compare with other articles",
  },
  "search.emptyTitle": { nl: "Geen resultaten gevonden", en: "No results found" },
  "search.emptyWithQuery": {
    nl: "We konden niets vinden voor",
    en: "We couldn't find anything for",
  },
  "search.emptyHint": {
    nl: "Probeer een andere zoekterm of pas je filters aan.",
    en: "Try a different search term or adjust your filters.",
  },
  "search.emptyNoQuery": {
    nl: "Pas je filters aan om producten te zien.",
    en: "Adjust your filters to see products.",
  },
  "search.viewAll": { nl: "Bekijk alle producten", en: "View all products" },

  // ---- Sort options ----
  "sort.relevance": { nl: "Aanbevolen", en: "Recommended" },
  "sort.popular": { nl: "Populariteit", en: "Popularity" },
  "sort.priceAsc": { nl: "Prijs laag - hoog", en: "Price low - high" },
  "sort.priceDesc": { nl: "Prijs hoog - laag", en: "Price high - low" },
  "sort.rating": { nl: "Beoordeling", en: "Rating" },
  "sort.sustainability": { nl: "Duurzaamheid", en: "Sustainability" },
  "sort.lifespan": { nl: "Levensduur", en: "Lifespan" },
  "sort.value": { nl: "Prijs per levensjaar", en: "Price per year of use" },
  "sort.combined": {
    nl: "Prijs, levering & duurzaamheid",
    en: "Price, delivery & sustainability",
  },

  // ---- Filters ----
  "filter.clearAll": { nl: "Wis alle filters", en: "Clear all filters" },
  "filter.category": { nl: "Categorie", en: "Category" },
  "filter.subcategory": { nl: "Subcategorie", en: "Subcategory" },
  "filter.price": { nl: "Prijs", en: "Price" },
  "filter.apply": { nl: "Toepassen", en: "Apply" },
  "filter.sustainability": { nl: "Duurzaamheid 🌿", en: "Sustainability 🌿" },
  "filter.carbonNeutral": {
    nl: "CO₂-neutraal gecertificeerd",
    en: "Carbon neutral certified",
  },
  "filter.delivery": { nl: "Levering", en: "Delivery" },
  "filter.deliveredToday": { nl: "Vandaag bezorgd", en: "Delivered today" },
  "filter.warehouse": { nl: "Magazijn", en: "Warehouse" },

  // ---- Pagination ----
  "page.prev": { nl: "‹ Vorige", en: "‹ Previous" },
  "page.next": { nl: "Volgende ›", en: "Next ›" },

  // ---- Product detail ----
  "product.viewReviews": { nl: "Bekijk", en: "View" },
  "product.reviews": { nl: "reviews", en: "reviews" },
  "product.description": { nl: "Productbeschrijving", en: "Product description" },
  "product.specifications": { nl: "Productspecificaties", en: "Product specifications" },
  "product.alsoViewed": { nl: "Anderen bekeken ook", en: "Others also viewed" },
  "product.boughtTogether": { nl: "Vaak samen gekocht", en: "Frequently bought together" },
  "product.compareLink": {
    nl: "Vergelijk met andere artikelen",
    en: "Compare with other articles",
  },
  "product.addedToCompare": {
    nl: "Toegevoegd om te vergelijken",
    en: "Added to comparison",
  },
  "product.productNotFound": { nl: "Product niet gevonden", en: "Product not found" },

  // ---- Product description (templated; {placeholders} filled in code) ----
  "desc.intro": {
    nl: "De {name} is een {subcategory} van {brand}, perfect voor wie kwaliteit en duurzaamheid combineert.",
    en: "The {name} is a {subcategory} by {brand}, perfect for anyone who combines quality with sustainability.",
  },
  "desc.producedIn": { nl: "Geproduceerd in {country}.", en: "Produced in {country}." },
  "desc.ecoCarbonNeutral": {
    nl: "Dit product is CO₂-neutraal gecertificeerd en past in een bewuste levensstijl.",
    en: "This product is carbon neutral certified and fits a conscious lifestyle.",
  },
  "desc.ecoLabel": {
    nl: "Voorzien van het {label} keurmerk voor een verantwoorde keuze.",
    en: "Carries the {label} quality mark for a responsible choice.",
  },
  "desc.packaging": {
    nl: 'De verpakking is van het type "{packaging}".',
    en: 'The packaging is of type "{packaging}".',
  },
  "desc.para1": {
    nl: "Ontdek de {name} — onderdeel van onze {category}-collectie. {origin} {eco}",
    en: "Discover the {name} — part of our {category} collection. {origin} {eco}",
  },
  "desc.para2": {
    nl: "Bij bol vind je niet alleen de prijs, maar ook inzicht in de duurzaamheid van dit product. {packaging} Zo maak je een bewustere keuze.",
    en: "At bol you'll find not just the price, but also insight into this product's sustainability. {packaging} That way you make a more conscious choice.",
  },
  "desc.para3": {
    nl: "Bestel nu met 30 dagen bedenktijd en gratis retourneren. Voor 23:59 besteld kan vandaag of morgen al in huis zijn.",
    en: "Order now with a 30-day right of return and free returns. Order before 23:59 for delivery as soon as today or tomorrow.",
  },

  // ---- Buy box ----
  "buy.deliveryToday": {
    nl: "Voor 23:59 besteld, vandaag in huis",
    en: "Order before 23:59, delivered today",
  },
  "buy.deliveryTomorrow": {
    nl: "Voor 23:59 besteld, morgen in huis",
    en: "Order before 23:59, delivered tomorrow",
  },
  "buy.deliveryStandard": {
    nl: "Levertijd 2-3 werkdagen",
    en: "Delivery time 2-3 business days",
  },
  "buy.returns": {
    nl: "30 dagen bedenktijd en gratis retourneren",
    en: "30-day right of return and free returns",
  },
  "buy.shippingIncluded": { nl: "Inclusief verzendkosten", en: "Shipping included" },
  "buy.quantity": { nl: "Aantal", en: "Quantity" },
  "buy.wishlist": { nl: "Op verlanglijst", en: "Add to wishlist" },

  // ---- Reviews ----
  "reviews.title": { nl: "Reviews", en: "Reviews" },
  "reviews.writeReview": { nl: "Schrijf review", en: "Write a review" },
  "reviews.boughtThis": { nl: "Heeft dit artikel gekocht", en: "Purchased this item" },

  // ---- Sustainability panel ----
  "sus.title": { nl: "Duurzaamheid", en: "Sustainability" },
  "sus.excellent": { nl: "Uitstekend", en: "Excellent" },
  "sus.average": { nl: "Gemiddeld", en: "Average" },
  "sus.limited": { nl: "Beperkt", en: "Limited" },
  "sus.scoreBasis": {
    nl: "op basis van CO₂, materialen, repareerbaarheid en levensduur.",
    en: "based on CO₂, materials, repairability and lifespan.",
  },
  "sus.co2": { nl: "CO₂-voetafdruk", en: "CO₂ footprint" },
  "sus.co2Hint": { nl: "bij productie", en: "at production" },
  "sus.recyclable": { nl: "Recyclebaar", en: "Recyclable" },
  "sus.repairability": { nl: "Repareerbaarheid", en: "Repairability" },
  "sus.lifespan": { nl: "Levensduur", en: "Lifespan" },
  "sus.unknown": { nl: "Onbekend", en: "Unknown" },
  "sus.carbonNeutralCert": {
    nl: "CO₂-neutraal gecertificeerd",
    en: "Carbon neutral certified",
  },

  // ---- Compare tray + page ----
  "compare.tray": { nl: "Vergelijk artikelen", en: "Compare articles" },
  "compare.roomFor": { nl: "Er is plaats voor nog", en: "There is room for" },
  "compare.article": { nl: "artikel", en: "article" },
  "compare.articles": { nl: "artikelen", en: "articles" },
  "compare.cta": { nl: "Vergelijk", en: "Compare" },
  "compare.clearList": { nl: "Lijst wissen", en: "Clear list" },
  "compare.remove": { nl: "Verwijderen", en: "Remove" },
  "compare.max": {
    nl: "Je kunt maximaal 4 artikelen vergelijken",
    en: "You can compare a maximum of 4 articles",
  },
  "compare.pageTitle": { nl: "Producten vergelijken", en: "Compare products" },
  "compare.breadcrumb": { nl: "Vergelijken", en: "Compare" },
  "compare.onlyDiff": { nl: "Toon alleen verschillen", en: "Show only differences" },
  "compare.viewProduct": { nl: "Bekijk product", en: "View product" },
  "compare.addMore": { nl: "Voeg toe aan de vergelijking", en: "Add to the comparison" },
  "compare.add": { nl: "Vergelijk", en: "Compare" },
  "compare.emptyTitle": { nl: "Niets om te vergelijken", en: "Nothing to compare" },
  "compare.emptyHint": {
    nl: 'Voeg producten toe via de knop "Vergelijk" op een productpagina.',
    en: 'Add products via the "Compare" button on a product page.',
  },
  "compare.viewProducts": { nl: "Bekijk producten", en: "View products" },
  "compare.selected": { nl: "product geselecteerd", en: "product selected" },
  "compare.sideBySide": { nl: "producten naast elkaar", en: "products side by side" },
  "compare.addOnePrompt": {
    nl: "voeg er hieronder één toe om te vergelijken.",
    en: "add one below to compare.",
  },
  "compare.valueTitle": { nl: "Prijs per levensjaar", en: "Price per year of use" },
  "compare.valueSubtitle": {
    nl: "Lagere kosten per verwacht levensjaar betekenen betere langetermijnwaarde.",
    en: "Lower cost per expected year of use means better long-term value.",
  },
  "compare.bestValue": { nl: "Beste waarde", en: "Best value" },
  "compare.valueUnavailable": {
    nl: "Levensduur ontbreekt, dus waarde per jaar is onbekend.",
    en: "Lifespan is missing, so value per year is unknown.",
  },
  "compare.priceLabel": { nl: "Prijs", en: "Price" },
  "compare.lifespanLabel": { nl: "Levensduur", en: "Lifespan" },

  // ---- Spec groups ----
  "spec.general": { nl: "Algemeen", en: "General" },
  "spec.sustainability": { nl: "Duurzaamheid", en: "Sustainability" },
  "spec.deliveryStock": { nl: "Levering & voorraad", en: "Delivery & stock" },
  "spec.priceSales": { nl: "Prijs & verkoop", en: "Price & sales" },
  "common.yes": { nl: "Ja", en: "Yes" },
  "common.no": { nl: "Nee", en: "No" },

  // ---- Spec row labels ----
  "spec.brand": { nl: "Merk", en: "Brand" },
  "spec.category": { nl: "Categorie", en: "Category" },
  "spec.subcategory": { nl: "Subcategorie", en: "Subcategory" },
  "spec.productId": { nl: "Product-ID", en: "Product ID" },
  "spec.sustainabilityScore": { nl: "Duurzaamheidsscore", en: "Sustainability score" },
  "spec.co2": { nl: "CO₂-voetafdruk", en: "CO₂ footprint" },
  "spec.ecoLabel": { nl: "Eco-label", en: "Eco-label" },
  "spec.carbonNeutralCert": {
    nl: "CO₂-neutraal gecertificeerd",
    en: "Carbon neutral certified",
  },
  "spec.packaging": { nl: "Verpakking", en: "Packaging" },
  "spec.repairScore": { nl: "Repareerbaarheidsscore", en: "Repairability score" },
  "spec.recyclableMaterial": { nl: "Recyclebaar materiaal", en: "Recyclable material" },
  "spec.estLifespan": { nl: "Geschatte levensduur", en: "Estimated lifespan" },
  "spec.year": { nl: "jaar", en: "years" },
  "spec.countryOrigin": { nl: "Land van herkomst", en: "Country of origin" },
  "spec.availToday": { nl: "Vandaag leverbaar", en: "Available today" },
  "spec.availTomorrow": { nl: "Morgen leverbaar", en: "Available tomorrow" },
  "spec.standardDelivery": { nl: "Standaard levering", en: "Standard delivery" },
  "spec.warehouse": { nl: "Magazijn", en: "Warehouse" },
  "spec.warehouseAddress": { nl: "Magazijnadres", en: "Warehouse address" },
  "spec.gln": { nl: "GLN", en: "GLN" },
  "spec.priceFrom": { nl: "Prijs vanaf", en: "Price from" },
  "spec.priceTo": { nl: "Prijs tot", en: "Price to" },
  "spec.pricePerLifeYear": {
    nl: "Prijs per levensjaar",
    en: "Price per year of use",
  },
  "spec.soldIn2025": { nl: "Verkocht in 2025", en: "Sold in 2025" },

  // ---- Footer ----
  "footer.serviceContact": { nl: "Service & contact", en: "Service & contact" },
  "footer.customerService": { nl: "Klantenservice", en: "Customer service" },
  "footer.orderingPaying": { nl: "Bestellen & betalen", en: "Ordering & paying" },
  "footer.deliveryOptions": { nl: "Bezorgopties", en: "Delivery options" },
  "footer.returns": { nl: "Retourneren", en: "Returns" },
  "footer.atBol": { nl: "Bij bol", en: "At bol" },
  "footer.aboutBol": { nl: "Over bol", en: "About bol" },
  "footer.careers": { nl: "Werken bij bol", en: "Careers at bol" },
  "footer.sustainability": { nl: "Duurzaamheid", en: "Sustainability" },
  "footer.press": { nl: "Pers & nieuws", en: "Press & news" },
  "footer.sellViaBol": { nl: "Verkopen via bol", en: "Sell via bol" },
  "footer.sellBusiness": { nl: "Zakelijk verkopen", en: "Business selling" },
  "footer.partner": { nl: "Partnerprogramma", en: "Partner program" },
  "footer.advertise": { nl: "Adverteren", en: "Advertise" },
  "footer.affiliate": { nl: "Affiliate", en: "Affiliate" },
  "footer.shopSustainably": { nl: "Duurzaam winkelen", en: "Shop sustainably" },
  "footer.shopSustainablyText": {
    nl: "Filter op duurzaamheidsscore, CO₂-voetafdruk en eco-labels om bewustere keuzes te maken.",
    en: "Filter by sustainability score, CO₂ footprint and eco-labels to make more conscious choices.",
  },
  "footer.viewMostSustainable": {
    nl: "Bekijk de meest duurzame producten →",
    en: "View the most sustainable products →",
  },
  "footer.disclaimer": {
    nl: "bol clone · Hackathon demo · Niet de echte bol.com",
    en: "bol clone · Hackathon demo · Not the real bol.com",
  },

  // ---- Language switcher ----
  "lang.label": { nl: "Taal", en: "Language" },
  "lang.dutch": { nl: "Nederlands", en: "Dutch" },
  "lang.english": { nl: "Engels", en: "English" },

  // ---- 404 ----
  "notFound.title": { nl: "Pagina niet gevonden", en: "Page not found" },
  "notFound.text": {
    nl: "Deze pagina of dit product bestaat niet (meer). Misschien is het uitverkocht of verplaatst.",
    en: "This page or product no longer exists. It may be sold out or moved.",
  },
  "notFound.home": { nl: "Terug naar home", en: "Back to home" },
} as const;

export type TranslationKey = keyof typeof dictionary;

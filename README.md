# HackStreetGirl

HackStreetGirl is a sustainability-focused extension of the bol.com shopping experience developed during **Hack4Her 2026**. The project encourages environmentally conscious shopping by providing sustainability insights, greener alternatives, and gamified rewards that make sustainable purchasing more engaging and transparent.

---

## Implemented Features

### 🏠 Home Page
- Added a **"Winkel slim. Kies duurzaam"** section at the top of the homepage.
- Added an **"Ontdek duurzame producten"** button that redirects users to a page containing products labeled **"Goede keuze"** and **"Lokaal product"**.
- Added a **"🌿 Meest duurzame keuzes"** section above the **"Populair op bol"** section.
- Added sustainability indicators for highly sustainable products:
    - Sustainability Score (0–100), shown only when the score is **70 or higher**.
    - Sustainability Grade (A–E), shown only for **Grade A** and **Grade B** products.
    - A **"🌿 Future-friendly pick"** label displayed beneath the product price.

---

### 🛍️ Product List
Added sustainability-related filtering and sorting options.

#### Filters:

**Sustainability**
- Grade
- Minimum Lifespan
- Best Price/Lifespan Value
- Eco label:
    - Carbon Neutral Certified
    - Energy Star
    - EU Ecolabel
    - Fair Trade
    - Cradle to Cradle
    - FSC Certified

**Warehouse**
- BFC Site 1
- BFC Site 2
- BFC XL
- BFC XL 2
- Ingram Micro

#### Sorting Options:
Added sorting options based on:
- Sustainability
- Lifespan
- Price per year of lifespan
- Price, delivery, and sustainability

---

### 📦 Product Page
- Added the Sustainability Score and Sustainability Grade for eligible products.
- Added a **Greener Alternatives** section recommending more sustainable products.
- Added a **Duurzaamheid** subsection within **Productspecificaties**, including:
    - Sustainability Score
    - CO₂ Footprint
    - Eco-label
    - Carbon Neutral Certification
    - Packaging
    - Repairability Score
    - Recyclable Material
    - Estimated Lifespan
    - Country of Origin
- Made the **Sustainability Score** clickable to display detailed sustainability information, including:
    - CO2 footprint
    - Recyclability score
    - Carbon neutrality score
    - Warehouse score
    - Country of origin score
    - Confidence score
    - Sustainability per euro
    - Impact analogy
    - Product lifecycle, containing:
        - **Production Information**
            - CO₂ footprint
            - Country of origin
            - Carbon neutrality
        - **Delivery options**
            - Standard
            - Next day
            - Same day
        - **Lifetime value**
            - Recyclability score
- Made the **Confidence Score** clickable to explain how the Sustainability Score is calculated. The popup includes:
    - The complete scoring formula:

    <!-- ```
    Score =
    (Σ component × weight ÷ Σ active weights)
    × (1 − 0.3 × missing ratio)
    ``` -->

    $$
    Score =
    \left(\frac{\sum(component \times weight)}
    {\sum(active\_weights)}\right)
    \times (1 - 0.3 \times missing\_ratio)
    $$

    - The weighting of each sustainability component:
        - CO₂ Footprint (35%)
        - Packaging (15%)
        - Recyclable Material (10%)
        - Repairability (10%)
        - Lifespan (10%)
        - Eco-label (5%)
        - Carbon Neutrality (5%)
        - Warehouse (5%)
        - Distance (5%)

    - Sustainability grade thresholds:
        - Grade A: ≥ 85
        - Grade B: ≥ 70
        - Grade C: ≥ 55
        - Grade D: ≥ 40
        - Grade E: < 40

    - A **pie chart** visualizing the contribution of each sustainability component to the final score.

---

### ⚖️ Comparison Page
- Added a **Sustainability Scores** section displaying:
    - Score
    - Confidence
    - Value
    - Carbon neutral, 
- Highlights the most sustainable product in **green**.
- Added a **Sustainability Journey** section showing the complete product lifecycle for each compared product.

---

### 🛒 Checkout
- Added a **"Nieuw dier verdiend"** popup that appears after completing a sustainable purchase.
- Rewards users with a new endangered animal to collect.
- Displays fun facts about the unlocked animal to encourage continued sustainable shopping.

---

### 👤 Profile
- Added a **"Mijn dierencollectie"** section where users can view all endangered animals they have unlocked.
- Added a **"Toon in header"** button, allowing users to display their favorite collected animal in the application header.

---

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Node.js
- npm

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Then open:

```
http://localhost:3000
```

in your browser.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

---

## Learn More

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

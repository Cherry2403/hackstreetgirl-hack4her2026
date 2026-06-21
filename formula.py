import csv


# -----------------------------
# Core scoring function
# -----------------------------
def sustainability_score_and_confidence(features, weights, alpha=0.3):
    available_score = 0.0
    available_weight_sum = 0.0
    missing_weight_sum = 0.0

    for feature, weight in weights.items():
        value = features.get(feature)

        if value is None:
            missing_weight_sum += weight
            continue

        available_score += value * weight
        available_weight_sum += weight

    if available_weight_sum == 0:
        return 0, 0

    # Score based on available data
    score_observed = available_score / available_weight_sum

    total_weight = available_weight_sum + missing_weight_sum

    # Missing penalty
    missing_ratio = missing_weight_sum / total_weight
    score_final = score_observed * (1 - alpha * missing_ratio)

    sustainability_score = score_final * 100

    # Confidence = how complete the data is
    confidence_score = (available_weight_sum / total_weight) * 100

    return round(sustainability_score, 2), round(confidence_score, 2)


# -----------------------------
# Helpers for normalization
# -----------------------------
def safe_float(x):
    try:
        if x is None or x == "":
            return None
        return float(x)
    except:
        return None


def packaging_score(x):
    mapping = {
        "Digital - No Packaging": 1.0,
        "Biodegradable": 0.9,
        "Recyclable Cardboard": 0.85,
        "Minimal Packaging": 0.75,
        "Mixed Plastic+Cardboard": 0.55,
        "Plastic": 0.40,
        "Foam + Plastic": 0.25
    }
    return mapping.get(x)


def eco_label_score(x):
    mapping = {
        "Cradle to Cradle": 1.0,
        "EU Ecolabel": 0.9,
        "Energy Star": 0.8,
        "FSC Certified": 0.7,
        "Fair Trade": 0.6
    }
    return mapping.get(x)


def warehouse_score(name):
    if not name:
        return None
    name = name.lower()
    return 1.0 if "perfect" in name else 0.5


def country_score(country):
    if not country:
        return None
    country = country.lower()
    return 1.0 if country in ["netherlands", "belgium"] else 0.5


# -----------------------------
# Weights
# -----------------------------
weights = {
    "co2": 0.35,
    "packaging": 0.15,
    "recyclable": 0.10,
    "repairability": 0.10,
    "lifespan": 0.10,
    "eco_label": 0.05,
    "carbon_neutral": 0.05,
    "warehouse": 0.05,
    "country": 0.05
}


# -----------------------------
# File path
# -----------------------------
file_path = r"C:\Users\naana\Downloads\hackathon-2026\bol_products_with_logistics.csv"


# -----------------------------
# Read CSV and compute scores
# -----------------------------
results = []

with open(file_path, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)

    for row in reader:

        # ---- normalize raw fields ----
        co2 = safe_float(row.get("CO2_Footprint_kg"))
        if co2 is not None:
            co2 = max(0, 1 - (co2 / 100))  # crude normalization

        repairability = safe_float(row.get("Repairability_Score"))
        if repairability is not None:
            repairability /= 9

        lifespan = safe_float(row.get("Estimated_Lifespan_Years"))
        if lifespan is not None:
            lifespan = min(lifespan / 10, 1)

        recyclable = safe_float(row.get("Material_Recyclable_Pct"))
        if recyclable is not None:
            recyclable /= 100

        carbon_neutral = row.get("Carbon_Neutral_Certified")
        if carbon_neutral:
            carbon_neutral = 1.0 if carbon_neutral.strip().lower() == "true" else 0.0
        else:
            carbon_neutral = None

        # ---- feature dict ----
        features = {
            "co2": co2,
            "packaging": packaging_score(row.get("Packaging_Type")),
            "recyclable": recyclable,
            "repairability": repairability,
            "lifespan": lifespan,
            "eco_label": eco_label_score(row.get("Eco_Label")),
            "carbon_neutral": carbon_neutral,
            "warehouse": warehouse_score(row.get("WarehouseName")),
            "country": country_score(row.get("Country_Of_Origin"))
        }

        score, confidence = sustainability_score_and_confidence(
            features,
            weights,
            alpha=0.3
        )

        results.append({
            "product": row.get("WarehouseName"),
            "score": score,
            "confidence": confidence
        })


# -----------------------------
# Output
# -----------------------------
for r in results[:20]:
    print(
        f"{r['product']} | "
        f"Sustainability: {r['score']}/100 | "
        f"Confidence: {r['confidence']}/100"
    )
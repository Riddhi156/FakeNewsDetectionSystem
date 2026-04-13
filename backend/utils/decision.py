"""
decision.py
-----------
Decision Logic for Fake News Verification.

Rules (NO labeled data, NO supervised ML):
  - similarity > 0.85  →  Real
  - 0.60–0.85          →  Suspicious
  - < 0.60             →  Fake

Confidence Score = max_similarity × source_reliability
"""


# Source reliability weights (pre-defined by domain expertise)
RELIABILITY_WEIGHTS = {
    "TOI":     0.9,
    "HT":      0.85,
    "Tribune": 0.8,
}

# Thresholds for classification
THRESHOLD_REAL       = 0.85
THRESHOLD_SUSPICIOUS = 0.60


def classify(similarity_score: float) -> str:
    """
    Classify news as Real, Suspicious, or Fake based on similarity.

    Args:
        similarity_score: Max cosine similarity (0.0 to 1.0)

    Returns:
        'Real' | 'Suspicious' | 'Fake'
    """
    if similarity_score >= THRESHOLD_REAL:
        return "Real"
    elif similarity_score >= THRESHOLD_SUSPICIOUS:
        return "Suspicious"
    else:
        return "Fake"


def compute_confidence(similarity_score: float, source: str) -> float:
    """
    Compute confidence score using similarity × source reliability.

    Args:
        similarity_score: Max cosine similarity of the best match.
        source:           Source name (TOI / HT / Tribune).

    Returns:
        Confidence score in range [0.0, 1.0]
    """
    reliability = RELIABILITY_WEIGHTS.get(source, 0.75)
    confidence  = similarity_score * reliability
    return float(round(min(confidence, 1.0), 4))


def make_verdict(top_matches: list[dict]) -> dict:
    """
    Generate final verdict from top matched articles.

    Args:
        top_matches: List of dicts from similarity.compute_top_matches()

    Returns:
        Dict with: prediction, confidence, top_similarity, matched_articles
    """
    if not top_matches:
        return {
            "prediction":      "Fake",
            "confidence":      0.0,
            "top_similarity":  0.0,
            "matched_articles": [],
            "message":         "No similar articles found in trusted sources."
        }

    # Best match drives the verdict
    best        = top_matches[0]
    top_sim     = best["similarity_score"]
    prediction  = classify(top_sim)
    confidence  = compute_confidence(top_sim, best.get("source", ""))

    # Format matched articles for frontend
    matched = []
    for article in top_matches:
        matched.append({
            "source":           article.get("source", "Unknown"),
            "headline":         article.get("headline", ""),
            "description":      article.get("description", ""),
            "url":              article.get("url", "#"),
            "similarity_score": article.get("similarity_score", 0.0),
            "reliability":      RELIABILITY_WEIGHTS.get(article.get("source", ""), 0.75)
        })

    return {
        "prediction":       prediction,
        "confidence":       confidence,
        "top_similarity":   top_sim,
        "matched_articles": matched,
        "message":          f"Compared against {len(matched)} trusted article(s)."
    }

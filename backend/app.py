"""
app.py
------
Flask REST API for the Fake News Verification System.

Endpoints:
  POST /predict      — Verify news against trusted + real-time articles
  GET  /             — Health check
  GET  /refresh      — Manually refresh real-time news cache
  GET  /stats        — Get article count stats (CSV + real-time)

No labeled dataset. No supervised ML.
Uses Sentence Transformers + Cosine Similarity on trusted CSV + live news articles.
"""

import os
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# ── Import our custom utilities ────────────────────────────────────────────────
from utils.similarity    import compute_top_matches
from utils.decision      import make_verdict
from utils.news_fetcher  import get_cached_articles, refresh_cache, start_background_refresh

# ── Flask App Setup ────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)  # Allow all origins so the HTML frontend can call the API

# ── Load CSV Dataset at Startup ────────────────────────────────────────────────
CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "trusted_news.csv")

print(f"[INFO] Loading trusted news CSV from: {CSV_PATH}")
try:
    df = pd.read_csv(CSV_PATH)
    # Drop rows with missing headlines or descriptions
    df.dropna(subset=["headline", "description"], inplace=True)
    CSV_ARTICLES = df.to_dict(orient="records")
    print(f"[INFO] Loaded {len(CSV_ARTICLES)} trusted articles from CSV.")
except Exception as e:
    print(f"[ERROR] Failed to load CSV: {e}")
    CSV_ARTICLES = []


def get_all_articles() -> list[dict]:
    """Merge CSV articles with real-time cached articles."""
    realtime = get_cached_articles()
    combined = CSV_ARTICLES + realtime
    return combined


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.route("/", methods=["GET"])
def health_check():
    """Simple health check endpoint."""
    realtime = get_cached_articles()
    return jsonify({
        "status":              "running",
        "csv_articles":        len(CSV_ARTICLES),
        "realtime_articles":   len(realtime),
        "total_articles":      len(CSV_ARTICLES) + len(realtime),
        "message":             "Fake News Verification API is live (CSV + Real-time news)."
    })


@app.route("/predict", methods=["POST"])
def predict():
    """
    Main prediction endpoint.

    Request JSON:
        { "news": "text of the news article to verify" }

    Response JSON:
        {
            "prediction":       "Real" | "Suspicious" | "Fake",
            "confidence":       0.0–1.0,
            "top_similarity":   0.0–1.0,
            "matched_articles": [ { source, headline, description, url, similarity_score } ],
            "message":          "...",
            "data_sources":     { "csv": N, "realtime": N, "total": N }
        }
    """
    # ── Validate request ──────────────────────────────────────────────────────
    data = request.get_json(silent=True)
    if not data or "news" not in data:
        return jsonify({"error": "Request body must contain a 'news' field."}), 400

    user_news = str(data["news"]).strip()
    if len(user_news) < 10:
        return jsonify({"error": "News text is too short. Please provide at least 10 characters."}), 400

    # ── Get combined articles (CSV + real-time) ───────────────────────────────
    all_articles = get_all_articles()

    if not all_articles:
        return jsonify({"error": "No news articles loaded. Check server logs."}), 500

    # ── Compute similarity & build verdict ────────────────────────────────────
    try:
        top_matches = compute_top_matches(user_news, all_articles, top_k=5)
        verdict     = make_verdict(top_matches)

        # Add data source info to response
        realtime_count = len(get_cached_articles())
        verdict["data_sources"] = {
            "csv":      len(CSV_ARTICLES),
            "realtime": realtime_count,
            "total":    len(CSV_ARTICLES) + realtime_count
        }

        return jsonify(verdict), 200

    except Exception as e:
        print(f"[ERROR] Prediction failed: {e}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@app.route("/refresh", methods=["GET"])
def refresh_news():
    """Manually trigger a refresh of real-time news cache."""
    try:
        count = refresh_cache()
        return jsonify({
            "status":  "refreshed",
            "realtime_articles": count,
            "total_articles":    len(CSV_ARTICLES) + count,
            "message": f"Successfully fetched {count} real-time articles."
        }), 200
    except Exception as e:
        return jsonify({"error": f"Refresh failed: {str(e)}"}), 500


@app.route("/stats", methods=["GET"])
def stats():
    """Get article count statistics."""
    realtime = get_cached_articles()
    return jsonify({
        "csv_articles":      len(CSV_ARTICLES),
        "realtime_articles": len(realtime),
        "total_articles":    len(CSV_ARTICLES) + len(realtime),
        "realtime_sources":  list(set(a.get("source", "Unknown") for a in realtime))
    })


# ── Run ────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # Start background news refresh thread
    start_background_refresh()
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)

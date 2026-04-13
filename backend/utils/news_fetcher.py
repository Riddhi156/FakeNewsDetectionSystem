"""
news_fetcher.py
---------------
Real-time news fetcher for the Fake News Verification System.

Sources:
  1. Google News RSS  — Free, no API key required (default)
  2. NewsAPI.org       — Free tier, 100 req/day (optional, needs API key)

Fetched articles are cached in memory and auto-refreshed periodically.
"""

import os
import time
import threading
import requests
import feedparser
from datetime import datetime


# ── Configuration ──────────────────────────────────────────────────────────────

# Optional: set your NewsAPI key here or via environment variable
NEWSAPI_KEY = os.environ.get("NEWSAPI_KEY", "")

# Google News RSS topics to fetch (India-focused)
GOOGLE_NEWS_TOPICS = [
    "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en",                          # Top stories India
    "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pKVGlnQVAB?hl=en-IN&gl=IN&ceid=IN:en",  # Business
    "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pKVGlnQVAB?hl=en-IN&gl=IN&ceid=IN:en",  # Technology
    "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pKVGlnQVAB?hl=en-IN&gl=IN&ceid=IN:en",  # Science
    "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pKVGlnQVAB?hl=en-IN&gl=IN&ceid=IN:en",  # Sports
    "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNR1ptTnpFU0FtVnVHZ0pKVGlnQVAB?hl=en-IN&gl=IN&ceid=IN:en",  # Health
]

# NewsAPI categories to fetch
NEWSAPI_CATEGORIES = ["general", "business", "technology", "science", "sports", "health"]

# Cache settings
REFRESH_INTERVAL = 1800  # 30 minutes in seconds
MAX_ARTICLES_PER_SOURCE = 50

# ── In-memory cache ───────────────────────────────────────────────────────────
_cached_articles = []
_last_refresh = 0
_refresh_lock = threading.Lock()


def _parse_google_news_source(title: str) -> str:
    """Extract source name from Google News title (format: 'Headline - Source')."""
    if " - " in title:
        return title.rsplit(" - ", 1)[-1].strip()
    return "Google News"


def fetch_google_news() -> list[dict]:
    """
    Fetch latest news articles from Google News RSS feeds.
    No API key required — completely free.

    Returns:
        List of article dicts with keys: source, headline, description, url, reliability
    """
    articles = []
    seen_headlines = set()

    for rss_url in GOOGLE_NEWS_TOPICS:
        try:
            feed = feedparser.parse(rss_url)
            for entry in feed.entries[:MAX_ARTICLES_PER_SOURCE]:
                headline = entry.get("title", "").strip()

                # Deduplicate by headline
                if not headline or headline in seen_headlines:
                    continue
                seen_headlines.add(headline)

                source = _parse_google_news_source(headline)
                # Clean headline: remove " - Source" suffix
                clean_headline = headline.rsplit(" - ", 1)[0].strip() if " - " in headline else headline

                description = entry.get("summary", "").strip()
                # Google News RSS summaries often contain HTML — strip tags
                if "<" in description:
                    import re
                    description = re.sub(r"<[^>]+>", "", description).strip()

                # If description is empty or same as headline, use headline
                if not description or description == clean_headline:
                    description = clean_headline

                url = entry.get("link", "#")

                articles.append({
                    "source":      source,
                    "headline":    clean_headline,
                    "description": description,
                    "url":         url,
                    "reliability": 0.75  # Default for aggregated sources
                })
        except Exception as e:
            print(f"[WARN] Failed to fetch Google News RSS: {e}")
            continue

    print(f"[INFO] Fetched {len(articles)} articles from Google News RSS.")
    return articles


def fetch_newsapi() -> list[dict]:
    """
    Fetch latest news from NewsAPI.org (requires free API key).
    Free tier: 100 requests/day, developer use only.

    Sign up at: https://newsapi.org/register

    Returns:
        List of article dicts with keys: source, headline, description, url, reliability
    """
    if not NEWSAPI_KEY:
        return []

    articles = []
    seen_headlines = set()

    # Reliability mapping for known NewsAPI sources
    source_reliability = {
        "the times of india":   0.90,
        "hindustan times":      0.85,
        "ndtv":                 0.85,
        "the hindu":            0.90,
        "india today":          0.85,
        "bbc news":             0.95,
        "reuters":              0.95,
        "the guardian":         0.90,
        "al jazeera english":   0.85,
        "cnn":                  0.85,
        "associated press":     0.95,
    }

    for category in NEWSAPI_CATEGORIES:
        try:
            url = "https://newsapi.org/v2/top-headlines"
            params = {
                "country":  "in",
                "category": category,
                "pageSize": MAX_ARTICLES_PER_SOURCE,
                "apiKey":   NEWSAPI_KEY
            }
            resp = requests.get(url, params=params, timeout=10)
            resp.raise_for_status()
            data = resp.json()

            for item in data.get("articles", []):
                headline = (item.get("title") or "").strip()
                if not headline or headline in seen_headlines or headline == "[Removed]":
                    continue
                seen_headlines.add(headline)

                source_name = (item.get("source", {}).get("name") or "NewsAPI").strip()
                description = (item.get("description") or headline).strip()
                article_url = item.get("url") or "#"
                reliability = source_reliability.get(source_name.lower(), 0.80)

                articles.append({
                    "source":      source_name,
                    "headline":    headline,
                    "description": description,
                    "url":         article_url,
                    "reliability": reliability
                })
        except Exception as e:
            print(f"[WARN] NewsAPI fetch failed for '{category}': {e}")
            continue

    print(f"[INFO] Fetched {len(articles)} articles from NewsAPI.")
    return articles


def fetch_all_realtime() -> list[dict]:
    """
    Fetch articles from all real-time sources.

    Returns:
        Combined list of article dicts from Google News + NewsAPI.
    """
    articles = []

    # 1. Google News RSS (always available, no key needed)
    articles.extend(fetch_google_news())

    # 2. NewsAPI (only if key is configured)
    if NEWSAPI_KEY:
        articles.extend(fetch_newsapi())

    return articles


def get_cached_articles() -> list[dict]:
    """
    Get cached real-time articles. Triggers refresh if cache is stale.

    Returns:
        List of cached article dicts.
    """
    global _cached_articles, _last_refresh

    now = time.time()
    if now - _last_refresh > REFRESH_INTERVAL:
        refresh_cache()

    return _cached_articles


def refresh_cache() -> int:
    """
    Refresh the in-memory article cache from all real-time sources.

    Returns:
        Number of articles fetched.
    """
    global _cached_articles, _last_refresh

    with _refresh_lock:
        print(f"[INFO] Refreshing real-time news cache at {datetime.now().strftime('%H:%M:%S')}...")
        articles = fetch_all_realtime()
        _cached_articles = articles
        _last_refresh = time.time()
        print(f"[INFO] Cache refreshed: {len(articles)} real-time articles loaded.")
        return len(articles)


def start_background_refresh():
    """
    Start a daemon thread that refreshes the news cache periodically.
    Called once at app startup.
    """
    def _refresh_loop():
        while True:
            try:
                refresh_cache()
            except Exception as e:
                print(f"[ERROR] Background refresh failed: {e}")
            time.sleep(REFRESH_INTERVAL)

    thread = threading.Thread(target=_refresh_loop, daemon=True, name="news-refresh")
    thread.start()
    print(f"[INFO] Background news refresh started (every {REFRESH_INTERVAL // 60} minutes).")

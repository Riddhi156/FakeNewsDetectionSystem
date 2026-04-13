"""
similarity.py
-------------
NLP Similarity Engine using Sentence Transformers.

Model: all-MiniLM-L6-v2 (lightweight BERT-based model)
Method: Cosine Similarity between embeddings
No supervised training or labeled data is used.
"""

import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# ─── Load model once at module level (cached after first download ~90MB) ──────
print("[INFO] Loading Sentence Transformer model: all-MiniLM-L6-v2 ...")
model = SentenceTransformer("all-MiniLM-L6-v2")
print("[INFO] Model loaded successfully.")


def encode_texts(texts: list[str]) -> np.ndarray:
    """
    Encode a list of strings into dense vector embeddings.

    Args:
        texts: List of strings to encode.

    Returns:
        numpy array of shape (len(texts), 384)
    """
    return model.encode(texts, convert_to_numpy=True, show_progress_bar=False)


def compute_top_matches(user_input: str, articles: list[dict], top_k: int = 3) -> list[dict]:
    """
    Compute cosine similarity between user input and all CSV articles.
    Returns the top-k most similar articles.

    Args:
        user_input:  The news text submitted by the user.
        articles:    List of article dicts from CSV (keys: headline, description, source, url, reliability).
        top_k:       Number of top matches to return (default 3).

    Returns:
        List of dicts, each containing the article fields + 'similarity_score'.
    """
    if not articles:
        return []

    # Combine headline + description for richer comparison
    article_texts = [
        f"{a['headline']}. {a['description']}" for a in articles
    ]

    # Encode user input and all articles
    user_embedding  = encode_texts([user_input])          # shape: (1, 384)
    article_embeddings = encode_texts(article_texts)      # shape: (N, 384)

    # Cosine similarity between user input and each article
    scores = cosine_similarity(user_embedding, article_embeddings)[0]  # shape: (N,)

    # Attach scores to articles and sort descending
    scored = []
    for i, article in enumerate(articles):
        scored.append({
            **article,
            "similarity_score": float(round(scores[i], 4))
        })

    scored.sort(key=lambda x: x["similarity_score"], reverse=True)

    return scored[:top_k]

import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer

class FeatureEngineer:
    def __init__(self, max_features=5000, ngram_range=(1, 2)):
        self.tfidf_vectorizer = TfidfVectorizer(max_features=max_features, ngram_range=ngram_range)
        self.count_vectorizer = CountVectorizer(max_features=max_features, ngram_range=ngram_range)

    def fit_transform_tfidf(self, text_series):
        """Fit and transform training text data using TF-IDF."""
        return self.tfidf_vectorizer.fit_transform(text_series)

    def transform_tfidf(self, text_series):
        """Transform text data using pre-fitted TF-IDF."""
        return self.tfidf_vectorizer.transform(text_series)

    def fit_transform_count(self, text_series):
        """Fit and transform training text data using CountVectorizer."""
        return self.count_vectorizer.fit_transform(text_series)
        
    def transform_count(self, text_series):
        """Transform text data using pre-fitted CountVectorizer."""
        return self.count_vectorizer.transform(text_series)

    def save_vectorizer(self, filepath):
        """Save the fitted TF-IDF vectorizer to disk."""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'wb') as f:
            pickle.dump(self.tfidf_vectorizer, f)
        print(f"Vectorizer saved to {filepath}")

    @classmethod
    def load_vectorizer(cls, filepath):
        """Load a fitted vectorizer from disk."""
        with open(filepath, 'rb') as f:
            vectorizer = pickle.load(f)
        fe = cls()
        fe.tfidf_vectorizer = vectorizer
        return fe

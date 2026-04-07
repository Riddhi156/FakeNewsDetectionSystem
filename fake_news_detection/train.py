"""
====================================================
  VERITAS EDITORIAL -- Fake News Detection Pipeline
  Full Training Script
====================================================
  Steps:
    1. Load & merge Fake.csv + True.csv
    2. Clean & preprocess text (NLTK)
    3. Feature engineering (TF-IDF)
    4. Train Logistic Regression model
    5. Evaluate (Confusion Matrix + ROC Curve)
    6. Save model + vectorizer to /models/
    7. Save cleaned dataset to /data/processed/
====================================================
"""

import os
import sys
import pandas as pd
import joblib
import time

# ── Make sure src/ is importable ──────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from src.data_loader         import load_and_merge_data
from src.preprocessor        import TextPreprocessor
from src.feature_engineering import FeatureEngineer
from src.evaluator           import ModelEvaluator

from sklearn.linear_model    import LogisticRegression
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score

# ── Paths ──────────────────────────────────────────────────────────────────────
RAW_DIR       = os.path.join(BASE_DIR, 'data', 'raw')
PROCESSED_DIR = os.path.join(BASE_DIR, 'data', 'processed')
MODELS_DIR    = os.path.join(BASE_DIR, 'models')
PLOTS_DIR     = os.path.join(MODELS_DIR, 'plots')

os.makedirs(PROCESSED_DIR, exist_ok=True)
os.makedirs(MODELS_DIR,    exist_ok=True)
os.makedirs(PLOTS_DIR,     exist_ok=True)

FAKE_CSV        = os.path.join(RAW_DIR, 'Fake.csv')
TRUE_CSV        = os.path.join(RAW_DIR, 'True.csv')
MODEL_PATH      = os.path.join(MODELS_DIR, 'logistic_model.pkl')
VECTORIZER_PATH = os.path.join(MODELS_DIR, 'vectorizer.pkl')
CLEANED_CSV     = os.path.join(PROCESSED_DIR, 'cleaned_data.csv')

# ─────────────────────────────────────────────────────────────────────────────
def separator(title):
    print("\n" + "=" * 55)
    print("  " + title)
    print("=" * 55)

# ─────────────────────────────────────────────────────────────────────────────
def main():
    start_total = time.time()

    # ── STEP 1: Load Data ─────────────────────────────────────────────────────
    separator("STEP 1 -- Loading Raw Data")
    df = load_and_merge_data(FAKE_CSV, TRUE_CSV)

    if df is None:
        print("[ERROR] Could not load data. Make sure Fake.csv and True.csv exist in data/raw/")
        sys.exit(1)

    print("\n[OK] Shape of raw dataset : {}".format(df.shape))
    print("     Columns available    : {}".format(list(df.columns)))
    print("\n     Label distribution:")
    print(df['label'].value_counts().rename({0: 'Fake (0)', 1: 'Real (1)'}).to_string())

    # ── STEP 2: Data Cleaning ─────────────────────────────────────────────────
    separator("STEP 2 -- Cleaning & Preprocessing Text")

    # Drop rows where 'text' column is missing
    before = len(df)
    df.dropna(subset=['text'], inplace=True)
    after = len(df)
    print("     Rows dropped (null text)   : {}".format(before - after))

    # Drop duplicates
    before = len(df)
    df.drop_duplicates(subset=['text'], inplace=True)
    after = len(df)
    print("     Rows dropped (duplicates)  : {}".format(before - after))

    # Apply text preprocessing
    preprocessor = TextPreprocessor()
    print("\n     Cleaning {} articles (this may take 1-3 minutes)...".format(len(df)))
    t0 = time.time()
    df['clean_text'] = df['text'].astype(str).apply(preprocessor.clean_text)
    t1 = time.time()

    # Drop rows where clean_text ended up empty
    df = df[df['clean_text'].str.strip() != '']
    print("     [OK] Text cleaning done in {:.1f}s".format(t1 - t0))
    print("     Final dataset size    : {} rows".format(len(df)))

    # Save cleaned dataset
    df[['text', 'clean_text', 'label']].to_csv(CLEANED_CSV, index=False)
    print("     [SAVED] Cleaned data --> {}".format(CLEANED_CSV))

    # ── STEP 3: Feature Engineering (TF-IDF) ─────────────────────────────────
    separator("STEP 3 -- Feature Engineering (TF-IDF Vectorization)")

    fe = FeatureEngineer(max_features=10000, ngram_range=(1, 2))
    X  = fe.fit_transform_tfidf(df['clean_text'])
    y  = df['label']

    fe.save_vectorizer(VECTORIZER_PATH)
    print("     TF-IDF matrix shape  : {}".format(X.shape))
    print("     [SAVED] Vectorizer   --> {}".format(VECTORIZER_PATH))

    # ── STEP 4: Train / Test Split ────────────────────────────────────────────
    separator("STEP 4 -- Train / Test Split (80/20, stratified)")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print("     Training samples : {}".format(X_train.shape[0]))
    print("     Testing  samples : {}".format(X_test.shape[0]))

    # ── STEP 5: Train Logistic Regression ────────────────────────────────────
    separator("STEP 5 -- Training Logistic Regression Model")

    lr_model = LogisticRegression(solver='lbfgs', max_iter=1000, C=1.0, random_state=42)
    t0 = time.time()
    lr_model.fit(X_train, y_train)
    t1 = time.time()
    print("     [OK] Training complete in {:.1f}s".format(t1 - t0))

    # ── STEP 6: Evaluate ──────────────────────────────────────────────────────
    separator("STEP 6 -- Model Evaluation")

    evaluator = ModelEvaluator(output_dir=PLOTS_DIR)
    y_pred = lr_model.predict(X_test)
    y_prob = lr_model.predict_proba(X_test)[:, 1]
    evaluator.evaluate_classification(y_test, y_pred, y_prob, "Logistic Regression")
    print("     [OK] Plots saved --> {}".format(PLOTS_DIR))

    # ── STEP 7: Cross-validation comparison ───────────────────────────────────
    separator("STEP 7 -- Cross-Validation on Full Dataset")

    from sklearn.naive_bayes import MultinomialNB
    from sklearn.svm         import LinearSVC
    from sklearn.ensemble    import RandomForestClassifier

    compare_models = {
        "Naive Bayes"   : MultinomialNB(),
        "Linear SVC"    : LinearSVC(random_state=42, max_iter=1000),
        "Random Forest" : RandomForestClassifier(n_estimators=50, random_state=42, n_jobs=-1),
    }
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    print("\n     {:<20} {:>12}  {:>8}".format("Model", "CV Accuracy", "Std Dev"))
    print("     " + "-" * 44)
    for name, model in compare_models.items():
        scores = cross_val_score(model, X, y, cv=cv, scoring='accuracy')
        print("     {:<20} {:.4f}       +/- {:.4f}".format(name, scores.mean(), scores.std()))

    # ── STEP 8: Save Final Model ──────────────────────────────────────────────
    separator("STEP 8 -- Saving Trained Model")

    joblib.dump(lr_model, MODEL_PATH)
    print("     [SAVED] Model --> {}".format(MODEL_PATH))

    elapsed = time.time() - start_total
    separator("PIPELINE COMPLETE  ({:.1f}s total)".format(elapsed))
    print("""
     Files saved:
       Cleaned data  : data/processed/cleaned_data.csv
       Vectorizer    : models/vectorizer.pkl
       Model         : models/logistic_model.pkl
       Plots         : models/plots/

     Next step -- start the backend:
       cd backend
       python app.py
    """)

# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    main()

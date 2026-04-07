import joblib
import os
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import LinearSVC
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score, GridSearchCV
from .data_loader import load_and_merge_data
from .preprocessor import TextPreprocessor
from .feature_engineering import FeatureEngineer
from .evaluator import ModelEvaluator

def train_and_evaluate(dummy_mode=False):
    base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    data_dir = os.path.join(base_dir, 'data', 'raw')
    models_dir = os.path.join(base_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    print("Step 1: Load Data")
    df = load_and_merge_data(
        os.path.join(data_dir, 'Fake.csv'),
        os.path.join(data_dir, 'True.csv')
    )
    
    if df is None:
        if dummy_mode:
            print("Using dummy data for testing...")
            from .dummy_data import generate_dummy_data
            generate_dummy_data(data_dir)
            df = load_and_merge_data(
                os.path.join(data_dir, 'Fake.csv'),
                os.path.join(data_dir, 'True.csv')
            )
        else:
            print("Data not found. Aborting training.")
            return

    print("\nStep 2: Preprocessing Text")
    preprocessor = TextPreprocessor()
    df['clean_text'] = df['text'].astype(str).apply(preprocessor.clean_text)

    print("\nStep 3: Feature Engineering (TF-IDF)")
    fe = FeatureEngineer()
    X = fe.fit_transform_tfidf(df['clean_text'])
    y = df['label']
    
    # Save the vectorizer
    fe.save_vectorizer(os.path.join(models_dir, 'vectorizer.pkl'))

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("\nStep 4: Training Primary Model (Logistic Regression)")
    lr_model = LogisticRegression(solver='lbfgs', max_iter=1000, C=1.0)
    lr_model.fit(X_train, y_train)
    
    print("\nStep 5: Evaluation")
    evaluator = ModelEvaluator(output_dir=os.path.join(models_dir, 'plots'))
    y_pred = lr_model.predict(X_test)
    y_prob = lr_model.predict_proba(X_test)[:, 1]
    
    evaluator.evaluate_classification(y_test, y_pred, y_prob, "Logistic Regression")

    # Save best model
    model_path = os.path.join(models_dir, 'logistic_model.pkl')
    joblib.dump(lr_model, model_path)
    print(f"Model saved to {model_path}")
    
    print("\nStep 6: Comparing other models (Cross-validation)")
    models = {
        "Random Forest": RandomForestClassifier(n_estimators=50, random_state=42),
        "Linear SVC": LinearSVC(random_state=42),
        "Naive Bayes": MultinomialNB()
    }
    
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    for name, model in models.items():
        scores = cross_val_score(model, X, y, cv=cv, scoring='accuracy')
        print(f"{name} CV Accuracy: {scores.mean():.4f} (+/- {scores.std():.4f})")
    
    print("\nTraining complete.")

if __name__ == "__main__":
    train_and_evaluate(dummy_mode=True)

# Fake News Detection System

An end-to-end Machine Learning pipeline and web application for detecting Fake News, featuring both Supervised and Unsupervised analysis.

## Features
- **Supervised Models**: Logistic Regression, Random Forest, SVM, Naive Bayes
- **Unsupervised Models**: KMeans Clustering, PCA, t-SNE
- **Backend API**: FastAPI serving the `.pkl` models via REST endpoints.
- **Frontend App**: React + Vite application implementing the Veritas Editorial premium design system.

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Dataset
This project uses the Kaggle "Fake and Real News Dataset".
- Download the dataset from Kaggle.
- Place `Fake.csv` and `True.csv` inside `fake_news_detection/data/raw/`
- *Alternatively, running the training script without the data will automatically generate dummy data for testing.*

### 3. Model Training
Run the supervised model pipeline to preprocess text, extract TF-IDF features, train the Logistic Regression model, and evaluate multiple models.
```bash
cd fake_news_detection
python -m src.supervised_model
```
*(This will generate `vectorizer.pkl` and `logistic_model.pkl` in the `models/` directory)*

You can also run the unsupervised analysis:
```bash
python -m src.unsupervised_model
```

### 4. Start the Backend API
Start the FastAPI server on port 5000:
```bash
python backend/app.py
```

### 5. Start the Frontend
In a new terminal window, navigate to the frontend directory and start Vite:
```bash
cd fake_news_detection/frontend
npm run dev
```

Visit the provided localhost URL (usually `http://localhost:5173`) to open the Veritas Editorial UI!

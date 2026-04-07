import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans, DBSCAN
from sklearn.decomposition import PCA, TruncatedSVD
from sklearn.manifold import TSNE
from sklearn.metrics import silhouette_score
import os
from .data_loader import load_and_merge_data
from .preprocessor import TextPreprocessor
from .feature_engineering import FeatureEngineer

def perform_unsupervised_analysis():
    base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    data_dir = os.path.join(base_dir, 'data', 'raw')
    plots_dir = os.path.join(base_dir, 'models', 'plots')
    os.makedirs(plots_dir, exist_ok=True)
    
    print("Loading data for unsupervised analysis...")
    df = load_and_merge_data(
        os.path.join(data_dir, 'Fake.csv'),
        os.path.join(data_dir, 'True.csv')
    )
    if df is None:
        print("Data not found. Please run dummy data generator or add real data.")
        return
        
    print("Preprocessing text...")
    # Sample down for unsupervised learning to make t-SNE computationally feasible
    df_sample = df.sample(min(2000, len(df)), random_state=42).reset_index(drop=True)
    preprocessor = TextPreprocessor()
    df_sample['clean_text'] = df_sample['text'].astype(str).apply(preprocessor.clean_text)

    print("Vectorizing text (TF-IDF)...")
    fe = FeatureEngineer(max_features=2000)
    X = fe.fit_transform_tfidf(df_sample['clean_text'])
    
    # 1. KMeans Clustering
    print("Running KMeans...")
    kmeans = KMeans(n_clusters=2, random_state=42, n_init='auto')
    df_sample['cluster'] = kmeans.fit_predict(X)
    
    try:
        sil_score = silhouette_score(X, df_sample['cluster'])
        print(f"KMeans Silhouette Score: {sil_score:.4f}")
    except Exception as e:
        print(f"Could not compute silhouette score: {e}")

    # 2. Dimensionality Reduction (PCA / TruncatedSVD since X is sparse)
    print("Performing TruncatedSVD for 2D visualization...")
    svd = TruncatedSVD(n_components=2, random_state=42)
    X_2d_svd = svd.fit_transform(X)
    
    plt.figure(figsize=(8, 6))
    sns.scatterplot(x=X_2d_svd[:,0], y=X_2d_svd[:,1], hue=df_sample['cluster'], palette='viridis')
    plt.title('SVD - KMeans Clusters')
    plt.savefig(os.path.join(plots_dir, 'svd_clusters.png'))
    plt.close()

    # 3. t-SNE
    print("Performing t-SNE for 2D visualization...")
    tsne = TSNE(n_components=2, random_state=42, perplexity=30)
    X_2d_tsne = tsne.fit_transform(X_2d_svd)  # Running t-SNE on SVD results is faster
    
    plt.figure(figsize=(8, 6))
    # Plot real vs fake labels to see if natural clusters form
    sns.scatterplot(x=X_2d_tsne[:,0], y=X_2d_tsne[:,1], hue=df_sample['label'], palette=['red', 'blue'])
    plt.title('t-SNE - True Labels (0: Fake, 1: True)')
    plt.savefig(os.path.join(plots_dir, 'tsne_true_labels.png'))
    plt.close()

    print("Unsupervised analysis complete. Plots saved.")

if __name__ == "__main__":
    perform_unsupervised_analysis()

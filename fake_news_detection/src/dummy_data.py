import pandas as pd
import numpy as np
import os

def generate_dummy_data(output_dir):
    """
    Generate dummy Fake and True news datasets for testing the pipeline
    without downloading the full Kaggle dataset.
    """
    os.makedirs(output_dir, exist_ok=True)
    
    # 1. Generate Fake News
    fake_texts = [
        "The earth is actually flat, say new scientists.",
        "Aliens have landed in central park, government covering it up.",
        "Drinking bleach cures all known diseases, including the flu.",
        "Elections were completely rigged by a secret society.",
        "This weird trick will make you a millionaire overnight!"
    ] * 20 # 100 samples
    
    df_fake = pd.DataFrame({
        'title': [f"Fake Title {i}" for i in range(len(fake_texts))],
        'text': fake_texts,
        'subject': ['News'] * len(fake_texts),
        'date': ['January 1, 2024'] * len(fake_texts)
    })
    
    # 2. Generate True News
    true_texts = [
        "The stock market saw huge gains today following the tech earnings reports.",
        "The city council voted to approve the new infrastructure budget.",
        "Scientists discover a new species of frog in the Amazon rainforest.",
        "The local sports team won the championship game last night.",
        "The president announced a new policy regarding international trade."
    ] * 20 # 100 samples
    
    df_true = pd.DataFrame({
        'title': [f"True Title {i}" for i in range(len(true_texts))],
        'text': true_texts,
        'subject': ['politicsNews'] * len(true_texts),
        'date': ['January 1, 2024'] * len(true_texts)
    })
    
    df_fake.to_csv(os.path.join(output_dir, 'Fake.csv'), index=False)
    df_true.to_csv(os.path.join(output_dir, 'True.csv'), index=False)
    
    print(f"Generated {len(df_fake)} Fake and {len(df_true)} True mock articles in {output_dir}")

if __name__ == "__main__":
    generate_dummy_data(os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/raw')))

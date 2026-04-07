import pandas as pd
import os

def load_and_merge_data(fake_path, true_path):
    """
    Loads the True and Fake datasets, assigns binary labels,
    merges them, and shuffles the combined dataset.
    """
    print("Loading data...")
    try:
        df_fake = pd.read_csv(fake_path)
        df_true = pd.read_csv(true_path)
    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("Please ensure Fake.csv and True.csv are present in the provided paths.")
        return None

    # Add binary label: Fake = 0, Real = 1
    df_fake['label'] = 0
    df_true['label'] = 1

    # Merge
    print("Merging data...")
    df_merged = pd.concat([df_fake, df_true], ignore_index=True)

    # Shuffle
    print("Shuffling data...")
    df_shuffled = df_merged.sample(frac=1, random_state=42).reset_index(drop=True)
    
    print(f"Total records: {len(df_shuffled)}")
    print(f"Class distribution:\n{df_shuffled['label'].value_counts()}")
    
    return df_shuffled

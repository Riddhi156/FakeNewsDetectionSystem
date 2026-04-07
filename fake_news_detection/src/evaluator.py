import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix, roc_curve, auc
import os

class ModelEvaluator:
    def __init__(self, output_dir='models/plots'):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def evaluate_classification(self, y_true, y_pred, y_prob=None, model_name="Model"):
        """Prints classification report and plots confusion matrix and ROC curve."""
        print(f"\n--- Evaluation for {model_name} ---")
        
        # Classification report (Precision, Recall, F1)
        print(classification_report(y_true, y_pred, target_names=["Fake", "True"]))

        # Confusion Matrix
        cm = confusion_matrix(y_true, y_pred)
        plt.figure(figsize=(6, 4))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=["Fake", "True"], yticklabels=["Fake", "True"])
        plt.title(f'{model_name} - Confusion Matrix')
        plt.xlabel('Predicted Label')
        plt.ylabel('True Label')
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, f'{model_name.lower().replace(" ", "_")}_cm.png'))
        plt.close()

        # ROC Curve
        if y_prob is not None:
            fpr, tpr, _ = roc_curve(y_true, y_prob)
            roc_auc = auc(fpr, tpr)
            plt.figure(figsize=(6, 4))
            plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (area = {roc_auc:.2f})')
            plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
            plt.xlim([0.0, 1.0])
            plt.ylim([0.0, 1.05])
            plt.xlabel('False Positive Rate')
            plt.ylabel('True Positive Rate')
            plt.title(f'{model_name} - ROC Curve')
            plt.legend(loc="lower right")
            plt.tight_layout()
            plt.savefig(os.path.join(self.output_dir, f'{model_name.lower().replace(" ", "_")}_roc.png'))
            plt.close()
            print(f"ROC AUC Score: {roc_auc:.4f}")

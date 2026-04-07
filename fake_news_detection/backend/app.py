import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import sys

# Add src folder to path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.preprocessor import TextPreprocessor

app = FastAPI(title="Fake News Detection API")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and vectorizer
model = None
vectorizer = None
preprocessor = None

@app.on_event("startup")
def load_models():
    global model, vectorizer, preprocessor
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    models_dir = os.path.join(base_dir, 'models')
    
    try:
        model = joblib.load(os.path.join(models_dir, 'logistic_model.pkl'))
        vectorizer = joblib.load(os.path.join(models_dir, 'vectorizer.pkl')) # Requires sklearn TfidfVectorizer logic
        preprocessor = TextPreprocessor()
        print("Models loaded successfully.")
    except Exception as e:
        print(f"Warning: Could not load models. Exception: {e}")
        print("Ensure you have run the training script first.")

class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    label: str
    confidence: float

@app.get("/health")
def health_check():
    return {"status": "running", "models_loaded": model is not None}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if not model or not vectorizer or not preprocessor:
        raise HTTPException(status_code=503, detail="Models are not loaded.")
        
    if not req.text or len(req.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
        
    try:
        # Preprocess
        cleaned_text = preprocessor.clean_text(req.text)
        
        # Vectorize
        features = vectorizer.transform([cleaned_text])
        
        # Predict
        prediction = model.predict(features)[0] # 0 = Fake, 1 = Real
        probability = model.predict_proba(features)[0]
        
        confidence = float(probability[prediction])
        label = "REAL" if prediction == 1 else "FAKE"
        
        return PredictResponse(label=label, confidence=confidence)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)

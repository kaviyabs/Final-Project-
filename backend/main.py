from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import numpy as np
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
from newspaper import Article

import os
import threading


app = FastAPI(title="TruthCompass AI Backend")
DB_DIR = os.path.join(os.path.dirname(__file__), "..", "database")
if not os.path.exists(DB_DIR):
    os.makedirs(DB_DIR)
DB_PATH = os.path.join(DB_DIR, "truth_compass.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.path.abspath(DB_PATH)}"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text)
    verdict = Column(String)
    confidence = Column(Float)
    score = Column(Float)
    date = Column(DateTime, default=datetime.datetime.utcnow)

class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    credibility_score = Column(Float)
    description = Column(Text)

Base.metadata.create_all(bind=engine)

# Seed initial data if empty
def seed_data():
    db = SessionLocal()
    sources = [
        DataSource(name="BBC News", credibility_score=95.0, description="International news broadcaster."),
        DataSource(name="Reuters", credibility_score=98.0, description="Global news agency."),
        DataSource(name="The Associated Press", credibility_score=97.0, description="American non-profit news agency."),
        DataSource(name="The New York Times", credibility_score=92.0, description="American daily newspaper."),
        DataSource(name="The Guardian", credibility_score=91.0, description="British daily newspaper."),
        DataSource(name="Daily Mail", credibility_score=40.0, description="British daily middle-market tabloid."),
        DataSource(name="The Onion", credibility_score=5.0, description="Satirical news organization."),
        DataSource(name="The Hindu (Tamil Nadu)", credibility_score=94.0, description="Major daily Indian newspaper closely followed in Tamil Nadu."),
        DataSource(name="Dina Thanthi", credibility_score=75.0, description="Tamil language daily newspaper."),
        DataSource(name="Dinakaran", credibility_score=70.0, description="Tamil daily newspaper."),
        DataSource(name="Puthiya Thalaimurai", credibility_score=85.0, description="Tamil news channel."),
        DataSource(name="Thanthi TV", credibility_score=80.0, description="Tamil news television network."),
        DataSource(name="Sun News", credibility_score=75.0, description="Tamil news channel by Sun TV Network."),
        DataSource(name="Polimer News", credibility_score=65.0, description="Tamil news television channel."),
        DataSource(name="Wikipedia", credibility_score=85.0, description="Collaborative online encyclopedia. Generally reliable but publicly editable."),
        DataSource(name="IMDb News", credibility_score=90.0, description="Reliable source for world cinema and entertainment news."),
        DataSource(name="Variety", credibility_score=92.0, description="Highly credible entertainment and cinema industry publication."),
        DataSource(name="ESPN", credibility_score=95.0, description="Major sports broadcasting network and news site."),
        DataSource(name="Bleacher Report", credibility_score=80.0, description="Sports news website covering primarily American sports and global football."),
        DataSource(name="WebMD", credibility_score=85.0, description="Online publisher of news and information pertaining to human health and well-being."),
        DataSource(name="Mayo Clinic", credibility_score=98.0, description="Nonprofit American academic medical center, highly trusted healthcare source."),
        DataSource(name="TechCrunch", credibility_score=90.0, description="American online newspaper focusing on high tech and startup companies."),
        DataSource(name="The Verge", credibility_score=88.0, description="Technology news network operated by Vox Media."),
        DataSource(name="Edutopia", credibility_score=92.0, description="Educational foundation dedicated to transforming K-12 education."),
        DataSource(name="Chronicle of Higher Education", credibility_score=95.0, description="Major news service in United States academic affairs."),
        DataSource(name="TMZ", credibility_score=30.0, description="Tabloid news website often dealing in celebrity rumors and gossip."),
        DataSource(name="Reddit (r/worldnews)", credibility_score=60.0, description="User-curated news forum. Credibility depends heavily on the linked source."),
        DataSource(name="Pop Crave", credibility_score=45.0, description="Entertainment and pop culture news on social media, known for fast rumors."),
        DataSource(name="Star Sports", credibility_score=85.0, description="Leading sports television network in India.")
    ]
    for s in sources:
        if not db.query(DataSource).filter(DataSource.name == s.name).first():
            db.add(s)
    db.commit()
    db.close()

seed_data()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
MODEL_NAME = "mrm8488/bert-tiny-finetuned-fake-news-detection"
tokenizer = None
model = None
def load_model():
    global tokenizer, model
    try:
        print(f"Loading AI model: {MODEL_NAME}...")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")
@app.on_event("startup")
async def startup_event():
    # Load model in background to prevent Render startup timeout
    threading.Thread(target=load_model, daemon=True).start()


class AnalysisRequest(BaseModel):
    text: str = None
    url: str = None

class AnalysisResponse(BaseModel):
    verdict: str
    confidence: float
    explanation: str

@app.get("/")
def read_root():
    return {"status": "TruthCompass Backend is running", "model": MODEL_NAME}

@app.get("/stats")
async def get_stats():
    db = SessionLocal()
    try:
        total = db.query(AnalysisHistory).count()
        real = db.query(AnalysisHistory).filter(AnalysisHistory.verdict == "REAL").count()
        fake = db.query(AnalysisHistory).filter(AnalysisHistory.verdict == "FAKE").count()
        suspicious = db.query(AnalysisHistory).filter(AnalysisHistory.verdict == "SUSPICIOUS").count()
        
        avg_score = db.query(func.avg(AnalysisHistory.score)).scalar() or 0
        
        return {
            "totalAnalyses": total,
            "realCount": real,
            "fakeCount": fake,
            "suspiciousCount": suspicious,
            "avgCredibilityScore": round(float(avg_score), 1),
            "recentAnalyses": db.query(AnalysisHistory).order_by(AnalysisHistory.date.desc()).limit(5).all()
        }
    finally:
        db.close()

@app.get("/sources")
async def get_sources():
    db = SessionLocal()
    try:
        sources = db.query(DataSource).all()
        return sources
    finally:
        db.close()

@app.get("/history")
async def get_history():
    db = SessionLocal()
    try:
        history = db.query(AnalysisHistory).order_by(AnalysisHistory.date.desc()).all()
        return history
    finally:
        db.close()

@app.delete("/history")
async def clear_history():
    db = SessionLocal()
    try:
        db.query(AnalysisHistory).delete()
        db.commit()
        return {"message": "History cleared"}
    finally:
        db.close()

def check_known_facts(text):
    text_lower = text.lower()
    
    # Knowledge base of known fake claims and fact checks
    known_fakes = [
        {
            "keywords": ["vijay", "cm", "tamil nadu"],
            "correction": "Vijay is a popular actor and has entered politics with his party (TVK), but the current Chief Minister of Tamil Nadu is M.K. Stalin. Claims that Vijay is currently the CM are false."
        },
        {
            "keywords": ["earth", "flat"],
            "correction": "The Earth is scientifically proven to be a sphere. Flat earth theories are a known conspiracy."
        },
        {
            "keywords": ["vaccine", "microchip"],
            "correction": "Vaccines do not contain microchips. This is a widely debunked conspiracy theory."
        },
        {
            "keywords": ["pandi selvam", "prime minister", "india"],
            "correction": "Pandi Selvam is not the Prime Minister of India. The current Prime Minister of India is Narendra Modi."
        },
        {
            "keywords": ["pandi selvam", "prime minster", "india"],
            "correction": "Pandi Selvam is not the Prime Minister of India. The current Prime Minister of India is Narendra Modi."
        },
        {
            "keywords": ["elon musk", "buys", "wikipedia"],
            "correction": "Elon Musk has not bought Wikipedia. Wikipedia remains a non-profit organization managed by the Wikimedia Foundation."
        }
    ]
    
    for fake in known_fakes:
        if all(kw in text_lower for kw in fake["keywords"]):
            return {
                "verdict": "FAKE",
                "confidence": 99.9,
                "explanation": f"Fact Check Failed: {fake['correction']} The text contains known false information.",
                "overallScore": 5.0
            }
            
    return None

@app.post("/analyze")
async def analyze_news(request: AnalysisRequest):
    text = request.text
    
    if request.url:
        try:
            article = Article(request.url)
            article.download()
            article.parse()
            text = article.text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to scrape URL: {str(e)}")

    if not text or len(text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Text too short for analysis")

    fact_check_result = check_known_facts(text)
    if fact_check_result:
        result = fact_check_result
        result["text"] = text
    else:
        result = None
        if model is None or tokenizer is None:
            result = simulate_analysis(text)
        else:
            try:
                inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
                with torch.no_grad():
                    outputs = model(**inputs)
                    logits = outputs.logits
                    probabilities = torch.nn.functional.softmax(logits, dim=1).numpy()[0]
                    
                fake_prob = probabilities[0]
                real_prob = probabilities[1]

                if real_prob > 0.7:
                    verdict = "REAL"
                    confidence = real_prob * 100
                elif fake_prob > 0.7:
                    verdict = "FAKE"
                    confidence = fake_prob * 100
                else:
                    verdict = "SUSPICIOUS"
                    confidence = max(fake_prob, real_prob) * 100

                result = {
                    "verdict": verdict,
                    "confidence": round(float(confidence), 2),
                    "explanation": generate_explanation(verdict, confidence, text),
                    "overallScore": round(float(real_prob * 100), 2),
                    "text": text
                }
            except Exception as e:
                print(f"Analysis error: {e}")
                result = simulate_analysis(text)

    # Save to database
    db = SessionLocal()
    try:
        db_item = AnalysisHistory(
            text=text[:500], # Store preview
            verdict=result["verdict"],
            confidence=result["confidence"],
            score=result.get("overallScore", 50.0)
        )
        db.add(db_item)
        db.commit()
    except Exception as e:
        print(f"Database error: {e}")
    finally:
        db.close()

    return result

def generate_explanation(verdict, confidence, text):
    if verdict == "REAL":
        return f"Our AI model analyzed the content and found it to be consistent with credible reporting patterns. High confidence ({confidence:.1f}%) suggests this information is likely reliable."
    elif verdict == "FAKE":
        return f"Warning: Multiple indicators of misinformation detected. The writing style and pattern match known propaganda or fake news structures with {confidence:.1f}% confidence."
    else:
        return f"The content shows ambiguous patterns. While not definitively fake, it lacks some standard markers of credible journalism. Exercise caution."

def simulate_analysis(text):
    # Simple fallback heuristic
    text_lower = text.lower()
    fake_indicators = ["shocking", "you won't believe", "exposed", "scandal", "miracle", "secret"]
    matches = [i for i in fake_indicators if i in text_lower]
    
    if len(matches) > 1:
        return {"verdict": "FAKE", "confidence": 75.0, "explanation": "Fallback: Detected sensationalist keywords."}
    return {"verdict": "REAL", "confidence": 60.0, "explanation": "Fallback: content seems neutral."}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting server on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)


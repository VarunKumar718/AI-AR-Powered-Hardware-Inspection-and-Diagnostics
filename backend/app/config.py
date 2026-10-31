import os
from pathlib import Path
from typing import List
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseModel):
    app_name: str = "VisionGuard AI Core"
    app_version: str = "1.0.0"
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    
    # CORS
    cors_origins: List[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
        if origin.strip()
    ]
    
    # Model Weights
    models_dir: Path = Path(os.getenv("MODELS_DIR", str(BASE_DIR / "models")))
    component_model_path: Path = Path(os.getenv("COMPONENT_MODEL_PATH", str(BASE_DIR / "models" / "fine_best.pt")))
    pcb_seg_model_path: Path = Path(os.getenv("PCB_SEG_MODEL_PATH", str(BASE_DIR / "models" / "pcb-seg.pt")))
    
    # LLM Settings
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_api_base: str = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")
    anthropic_api_key: str = os.getenv("ANTHROPIC_API_KEY", "")
    enable_vision_fallback: bool = os.getenv("ENABLE_VISION_FALLBACK", "false").lower() == "true"
    
    # Rate Limiting & Limits
    max_image_size_mb: int = 20
    rate_limit_per_minute: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "120"))

settings = Settings()

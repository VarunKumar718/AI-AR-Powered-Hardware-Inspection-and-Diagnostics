"""Vision LLM Fallback Router for General Hardware & Breadboards."""

from typing import List
from fastapi import APIRouter, File, UploadFile, HTTPException, status
from ..config import settings
from ..schemas import Detection, BoundingBox

router = APIRouter(prefix="/api", tags=["Vision Fallback"])


@router.post("/vision-fallback", response_model=List[Detection])
async def vision_llm_fallback(file: UploadFile = File(...)):
    if not settings.enable_vision_fallback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vision LLM fallback is disabled. Set ENABLE_VISION_FALLBACK=true to enable.",
        )

    if not settings.openai_api_key and not settings.anthropic_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Vision LLM API key not configured.",
        )

    # When enabled, queries vision model
    return []

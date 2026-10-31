"""System Health & Model Metadata Router."""

import time
from typing import List
from fastapi import APIRouter
from ..models.model_loader import model_registry
from ..schemas import HealthResponse, ModelInfo
from ..config import settings

router = APIRouter(prefix="/api", tags=["System"])


@router.get("/health", response_model=HealthResponse)
async def get_health():
    uptime = time.time() - model_registry.start_time
    comp_model = model_registry.get_component_model()
    is_loaded = comp_model is not None

    return HealthResponse(
        status="healthy" if is_loaded else "degraded",
        version=settings.app_version,
        uptimeSeconds=round(uptime, 1),
        device=model_registry.device.upper(),
        modelsLoaded=is_loaded,
        models=["ParsaVictor/pcb-component-detection-yolo26", "SanderGi/PCB-SEG"] if is_loaded else [],
    )


@router.get("/models", response_model=List[ModelInfo])
async def list_models():
    return model_registry.get_models_info()

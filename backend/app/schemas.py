"""Pydantic schemas mirroring TypeScript contracts in visionguard/types/index.ts."""

from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field

Category = Literal[
    "microcontroller",
    "ic",
    "passive",
    "connector",
    "power",
    "header",
    "crystal",
    "led",
    "other",
]

DetectionSource = Literal["simulated", "model", "manual", "heuristic", "llm"]
DefectSeverity = Literal["critical", "high", "medium", "low", "info"]
DefectStatus = Literal["new", "confirmed", "false_positive", "needs_review"]


class BoundingBox(BaseModel):
    x: float = Field(..., ge=0.0, le=1.0, description="Normalized top-left x (0-1)")
    y: float = Field(..., ge=0.0, le=1.0, description="Normalized top-left y (0-1)")
    w: float = Field(..., ge=0.0, le=1.0, description="Normalized width (0-1)")
    h: float = Field(..., ge=0.0, le=1.0, description="Normalized height (0-1)")


class Detection(BaseModel):
    id: str
    designator: Optional[str] = None
    label: str
    category: Category
    confidence: float = Field(..., ge=0.0, le=1.0)
    bbox: BoundingBox
    componentId: str
    source: DetectionSource
    defectIds: Optional[List[str]] = None
    voltageRating: Optional[str] = None
    footprint: Optional[str] = None
    specsSummary: Optional[str] = None


class Defect(BaseModel):
    id: str
    type: str
    severity: DefectSeverity
    confidence: float = Field(..., ge=0.0, le=1.0)
    region: BoundingBox
    description: str
    suggestedCheck: str = ""
    recommendation: str = ""
    status: DefectStatus = "new"
    source: DetectionSource = "heuristic"
    affectedComponentId: Optional[str] = None
    affectedDesignator: Optional[str] = None


class InspectionResult(BaseModel):
    id: str
    boardName: str
    boardId: str
    timestamp: str
    imageRef: str
    detections: List[Detection]
    defects: List[Defect]
    healthScore: float = Field(..., ge=0.0, le=100.0)
    inferenceMs: float
    provenance: Literal["simulated", "model"]
    operatorNotes: Optional[str] = None


class Citation(BaseModel):
    componentId: Optional[str] = None
    defectId: Optional[str] = None
    pinName: Optional[str] = None
    referenceDoc: Optional[str] = None


class CodeSnippet(BaseModel):
    language: str
    code: str
    explanation: Optional[str] = None


class ChatMessage(BaseModel):
    id: str
    role: Literal["user", "assistant", "system"]
    content: str
    timestamp: Optional[str] = ""
    citations: Optional[List[Citation]] = None
    codeSnippet: Optional[CodeSnippet] = None


class AssistantContext(BaseModel):
    boardName: str
    detections: List[Detection] = []
    selectedId: Optional[str] = None
    defects: List[Defect] = []


class AssistantRequest(BaseModel):
    messages: List[ChatMessage]
    context: AssistantContext


class DetectResponse(BaseModel):
    detections: List[Detection]
    inferenceMs: float
    modelName: str
    modelVersion: str
    imageSize: Dict[str, int]
    count: int


class DefectsResponse(BaseModel):
    defects: List[Defect]
    inferenceMs: float
    method: Literal["model", "heuristic"]
    count: int


class ModelInfo(BaseModel):
    id: str
    name: str
    version: str
    task: str
    license: str
    classes: List[str]
    inputSize: int
    loaded: bool
    device: str
    lastInferenceMs: float


class HealthResponse(BaseModel):
    status: Literal["healthy", "degraded", "unhealthy"]
    version: str
    uptimeSeconds: float
    device: str
    modelsLoaded: bool
    models: List[str]

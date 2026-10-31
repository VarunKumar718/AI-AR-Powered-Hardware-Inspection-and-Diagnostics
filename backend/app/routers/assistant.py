"""Streaming AI Copilot Assistant Router."""

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from ..schemas import AssistantRequest
from ..services.assistant_service import stream_assistant_response

router = APIRouter(prefix="/api", tags=["Assistant"])


@router.post("/assistant")
async def chat_assistant(request: AssistantRequest):
    return StreamingResponse(
        stream_assistant_response(request.messages, request.context),
        media_type="text/event-stream",
    )

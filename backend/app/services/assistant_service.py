"""Hardware AI Assistant Service with SSE Streaming."""

import asyncio
import json
from typing import AsyncIterable, List, Dict, Any, Optional
import httpx
from ..config import settings
from ..schemas import ChatMessage, AssistantContext
from .knowledge_base import find_component_facts, get_knowledge_base


def build_system_prompt(context: AssistantContext) -> str:
    prompt = [
        "You are VisionGuard's Hardware Copilot, an expert electrical engineering assistant.",
        "Your task is to help engineers inspect circuit assemblies, debug faults, and safely rework defects.",
        f"Active Board: {context.boardName}",
        f"Detected Components on Canvas: {len(context.detections)} items.",
    ]
    
    if context.selectedId:
        matched = find_component_facts(context.selectedId)
        if matched:
            prompt.append(
                f"Selected Component Focus: {matched['name']} (MPN: {matched['mpn']}, Package: {matched['package']}, "
                f"Operating Voltage: {matched['operatingVoltage']}). Description: {matched['description']}"
            )

    if context.defects:
        prompt.append(f"Active Optical Defect Flags ({len(context.defects)}):")
        for df in context.defects[:4]:
            prompt.append(f"- {df.type} ({df.severity.upper()}): {df.description} Recommendation: {df.recommendation}")

    prompt.append(
        "Always ground your reasoning in authentic electronics specs (max 20mA per GPIO on AVR, 5V/3.3V logic boundaries). "
        "Provide direct, concise, and technically accurate instructions. If a short circuit is present, instruct immediate power-off."
    )
    return "\n".join(prompt)


def generate_local_hardware_reply(query: str, context: AssistantContext) -> str:
    """Intelligent circuit analysis rule engine using bundled knowledge base."""
    q = query.lower()
    
    # 1. Defect & Solder Bridge Questions
    if any(k in q for k in ["defect", "short", "bridge", "solder", "hazard", "rework", "fix"]):
        if context.defects:
            defect_summaries = []
            for d in context.defects[:3]:
                defect_summaries.append(
                    f"• **{d.type}** ({d.severity.upper()}):\n"
                    f"  - **Issue**: {d.description}\n"
                    f"  - **Action**: {d.recommendation}"
                )
            return (
                f"### ⚠️ Hardware Defect Analysis for {context.boardName}\n\n"
                f"VisionGuard has flagged **{len(context.defects)} active defect(s)** on this board:\n\n"
                + "\n\n".join(defect_summaries)
                + "\n\n**Rework Safety Protocol (IPC-A-610 Class 3):**\n"
                "1. Disconnect all DC and USB power rails immediately.\n"
                "2. Apply mildly activated rosin (RMA) liquid flux over the bridged pins.\n"
                "3. Lay clean copper desoldering braid (1.5mm) across the short and apply a 330°C iron tip for 2-3 seconds.\n"
                "4. Clean residue with 99.9% Isopropyl Alcohol (IPA) and verify with a multimeter continuity check before energizing."
            )
        else:
            return (
                f"### ✅ No Active Defects Flagged\n\n"
                f"The automated optical inspection on **{context.boardName}** did not detect any critical solder bridges, reversed polarities, or thermal discolorations matching IPC-A-610 criteria.\n\n"
                "If you suspect an intermittent connection, check power rails (5V, 3.3V, GND) with an oscilloscope or digital multimeter."
            )

    # 2. Specific Component Queries (ATmega328P, regulators, MCU)
    if any(k in q for k in ["atmega", "mcu", "microcontroller", "u1", "u2", "processor"]):
        return (
            "### 🔍 Microcontroller Specifications (ATmega328P)\n\n"
            "- **Architecture**: 8-Bit AVR RISC (Up to 20 MIPS throughput at 20MHz, 16MHz standard).\n"
            "- **Memory**: 32 KB In-System Self-Programmable Flash, 2 KB internal SRAM, 1 KB EEPROM.\n"
            "- **Operating Voltage**: 1.8V to 5.5V (Standard 5.0V system clock on Arduino Uno).\n"
            "- **I/O Current Ratings**:\n"
            "  - **Recommended Max**: 20 mA per GPIO pin.\n"
            "  - **Absolute Maximum Limit**: 40.0 mA (exceeding risks internal ESD diode breakdown).\n"
            "  - **Total VCC/GND Package Limit**: 200 mA.\n"
            "- **Timers**: 2x 8-bit Timer/Counters with PWM, 1x 16-bit Timer/Counter (Pins 3, 5, 6, 9, 10, 11)."
        )

    # 3. Voltage, Power, and Regulators
    if any(k in q for k in ["voltage", "power", "regulator", "5v", "3.3v", "vin", "barrel"]):
        return (
            "### ⚡ Power Distribution Subsystem\n\n"
            "- **DC Barrel Jack Input**: 7V - 12V DC recommended (Center positive 2.1mm, diode protected by D1).\n"
            "- **Primary 5V Rail**: Driven by on-board LDO regulator (NCP1117ST50T3G or similar), rated up to 800mA.\n"
            "- **Secondary 3.3V Rail**: Driven by ultra-low dropout linear regulator (LP2985-33DBVR), rated up to 150mA.\n"
            "- **USB Input**: 5.0V regulated input protected by a 500mA resettable polyfuse (F1) preventing host port overcurrent."
        )

    # 4. Pinouts & GPIO bus
    if any(k in q for k in ["pin", "gpio", "i2c", "spi", "pwm", "analog", "header"]):
        return (
            "### 📌 Hardware Bus & Pinout Matrix\n\n"
            "- **SPI Bus**: Pin 10 (SS), Pin 11 (MOSI), Pin 12 (MISO), Pin 13 (SCK).\n"
            "- **I2C / TWI Bus**: Analog Pin A4 (SDA), Analog Pin A5 (SCL) with internal or external 4.7kΩ pullups.\n"
            "- **PWM Channels (490Hz / 980Hz)**: Pins 3, 5, 6, 9, 10, and 11.\n"
            "- **Analog Inputs**: A0 - A5 (10-bit successive approximation ADC, 0-5V default input range, 1024 discrete steps)."
        )

    # Default overview
    detected_count = len(context.detections)
    defects_count = len(context.defects)
    return (
        f"### 🤖 VisionGuard Hardware Copilot\n\n"
        f"Analyzing **{context.boardName}** with **{detected_count} detected components** and **{defects_count} flagged defect(s)**.\n\n"
        "I can help you with:\n"
        "- **Defect Diagnostics & Rework**: IPC-A-610 procedures for solder bridges, cold joints, and reversed electrolytic capacitors.\n"
        "- **Electrical Absolute Maximums**: Voltage thresholds, GPIO current caps (20mA), and regulator thermal dissipation.\n"
        "- **Bus Pinouts**: SPI, I2C, UART, and hardware PWM timer assignments.\n\n"
        "*Ask me about any specific component (e.g., 'What are the specs of U1?') or defect on the canvas!*"
    )


async def stream_assistant_response(
    messages: List[ChatMessage],
    context: AssistantContext
) -> AsyncIterable[str]:
    """
    Streams response from live LLM if configured, otherwise streams intelligent local hardware reasoning.
    """
    last_user_msg = messages[-1].content if messages else "Help with active board"
    
    # Check if OpenAI or Anthropic key is present
    has_cloud_key = bool(settings.openai_api_key or settings.anthropic_api_key)

    if has_cloud_key and settings.openai_api_key:
        try:
            system_prompt = build_system_prompt(context)
            formatted_messages = [{"role": "system", "content": system_prompt}]
            for msg in messages:
                formatted_messages.append({"role": msg.role, "content": msg.content})

            headers = {
                "Authorization": f"Bearer {settings.openai_api_key}",
                "Content-Type": "application/json",
            }
            payload = {
                "model": "gpt-4o-mini",
                "messages": formatted_messages,
                "temperature": 0.2,
                "stream": True,
            }
            url = f"{settings.openai_api_base.rstrip('/')}/chat/completions"

            async with httpx.AsyncClient(timeout=30.0) as client:
                async with client.stream("POST", url, headers=headers, json=payload) as response:
                    if response.status_code == 200:
                        async for line in response.aiter_lines():
                            if not line:
                                continue
                            if line.startswith("data: "):
                                data_str = line[6:].strip()
                                if data_str == "[DONE]":
                                    yield "data: [DONE]\n\n"
                                    return
                                try:
                                    parsed = json.loads(data_str)
                                    delta = parsed["choices"][0]["delta"].get("content", "")
                                    if delta:
                                        yield f"data: {json.dumps(delta)}\n\n"
                                except Exception:
                                    pass
                        return
        except Exception as e:
            # Fall through to local reasoning
            pass

    # Stream local hardware knowledge base reply token by token
    reply_text = generate_local_hardware_reply(last_user_msg, context)
    words = reply_text.split(" ")
    for i, word in enumerate(words):
        chunk = word + (" " if i < len(words) - 1 else "")
        yield f"data: {json.dumps(chunk)}\n\n"
        await asyncio.sleep(0.015)  # Realistic smooth token stream

    yield "data: [DONE]\n\n"

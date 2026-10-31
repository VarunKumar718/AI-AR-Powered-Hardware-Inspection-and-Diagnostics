'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Cpu,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Terminal,
  Code,
  Layers,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  HelpCircle,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import { useVisionStore } from '@/store/useVisionStore';
import { ChatMessage, Detection, Defect } from '@/types';
import { apiClient } from '@/lib/api/client';
import Link from 'next/link';

type AssistantMode = 'explain' | 'assemble' | 'troubleshoot';

const MODE_QUERIES: Record<AssistantMode, string[]> = {
  explain: [
    'Explain the ATmega328P clock generation and 16MHz crystal circuit.',
    'What is the maximum continuous current rating for digital GPIO pins?',
    'How does the dual 5.0V and 3.3V power regulator distribution work?',
    'Explain the role of the ATmega16U2 USB-to-UART bridge IC.',
  ],
  assemble: [
    'What is the recommended assembly sequence for soldering this board?',
    'Which orientation notch must the 28-pin DIP socket face before soldering?',
    'What soldering temperature and dwell time is recommended for SOT-223?',
    'How do I test the power rails before inserting the microcontroller chip?',
  ],
  troubleshoot: [
    '⚠️ How do I diagnose and clear the detected solder bridge short?',
    'Why is the power LED not turning on when DC barrel jack is connected?',
    'How do I verify crystal oscillation using an oscilloscope or logic probe?',
    'What causes avrdude "stk500_getsync(): not in sync" flash upload error?',
  ],
};

export default function AssistantPage() {
  const { activeBoard, activeDetections, activeDefects, selectedDetectionId, isModelConnected } = useVisionStore();

  const [activeMode, setActiveMode] = useState<AssistantMode>('troubleshoot');
  const [showContextViewer, setShowContextViewer] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your **VisionGuard Hardware Copilot**.\n\nI have ingested the active inspection context for **${activeBoard.name}** (${activeDetections.length} components identified, ${activeDefects.length} defect flags). Select an inquiry mode above (Explain, Assemble, Troubleshoot) or ask me any question about circuit diagnosis, IPC standards, or pinouts!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    const assistantMsgId = `asst-${Date.now()}`;
    const initialAssistantMessage: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, initialAssistantMessage]);

    const contextPayload = {
      boardName: activeBoard.name,
      detections: activeDetections,
      defects: activeDefects,
      selectedId: selectedDetectionId || undefined,
    };

    try {
      const res = await apiClient.postAssistantStream({
        messages: [...messages, userMessage].map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp || new Date().toISOString(),
        })),
        context: contextPayload,
      });

      if (!res.ok) {
        if (res.status === 503) {
          throw new Error('assistant_not_configured');
        }
        throw new Error(`Backend returned status ${res.status}`);
      }

      if (!res.body) {
        throw new Error('No streaming response body from backend.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':')) continue;
          if (trimmed.startsWith('data: ')) {
            const rawData = trimmed.slice(6);
            if (rawData === '[DONE]') break;
            try {
              const parsed = JSON.parse(rawData);
              const textChunk = typeof parsed === 'string' ? parsed : parsed.content || parsed.text || '';
              if (textChunk) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, content: msg.content + textChunk }
                      : msg
                  )
                );
              }
            } catch {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId
                    ? { ...msg, content: msg.content + rawData }
                    : msg
                )
              );
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('[VisionGuard Assistant Fallback]:', err);
      // Simulated response fallback labeled clearly
      let simulatedReply = '';
      if (err.message === 'assistant_not_configured' || !isModelConnected) {
        simulatedReply = `[Simulated response] Operating with VisionGuard Local Hardware Knowledge Base.\n\n` +
          `**Analysis for ${activeBoard.name}:**\n` +
          (textToSend.toLowerCase().includes('bridge') || textToSend.toLowerCase().includes('short')
            ? `• **Solder Bridge Remediation:** IPC-A-610 Class 3 requires zero bridging between adjacent pins. Use a digital multimeter in buzzer continuity mode between adjacent pads to verify low resistance (<1Ω). Apply rosin-core liquid flux (RMA type) and place pre-tinned copper desoldering wick (2.0mm) over the short. Apply a clean chisel tip at 330°C for 2 seconds to absorb excess alloy without overheating the pad substrate.`
            : textToSend.toLowerCase().includes('current') || textToSend.toLowerCase().includes('voltage')
            ? `• **Electrical Thresholds:** Absolute maximum DC current per GPIO pin is 40.0 mA, but the recommended safe continuous limit is 20.0 mA. Total current across all VCC/GND pins combined must not exceed 200 mA. Operating logic voltage is strictly 5.0V DC; applying 5V to the 3.3V rail will destroy connected low-dropout sensors.`
            : `• **Circuit Context:** Identified ${activeDetections.length} components on ${activeBoard.name}. Power enters via the 2.1mm DC barrel jack (7-12V DC) or USB Type-B port (5.0V), regulated down by NCP1117-5.0 and LP2985-3.3. Verify decoupling capacitors (100nF ceramic) are placed within 5mm of ATmega328P VCC pins.`);
      } else {
        simulatedReply = `[Simulated response] Backend connection notice: ${err.message}. Operating with local circuit heuristics.\n\n` +
          `For ${activeBoard.name}: Verify that all active defects (${activeDefects.length} flagged) have been cleared and checked with an insulation tester or DMM before powering on.`;
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, content: simulatedReply } : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] -mx-4 -my-6 md:-mx-8 md:-my-8 bg-bg-deepest text-text-primary select-none overflow-hidden">
      {/* 1. Header Toolbar */}
      <div className="h-14 bg-bg-base/90 backdrop-blur-md border-b border-border-subtle px-4 md:px-6 flex items-center justify-between gap-4 shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-brand-cyan shrink-0">
            <Bot className="w-4 h-4 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-sm text-text-primary tracking-wide">
                Hardware Copilot Assistant
              </h1>
              <span className={`inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                isModelConnected
                  ? 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300'
                  : 'border-amber-500/40 bg-amber-950/60 text-amber-300'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isModelConnected ? 'bg-cyan-400 animate-pulse' : 'bg-amber-400'}`} />
                {isModelConnected ? 'LIVE STREAM' : 'SIMULATED'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-text-muted truncate hidden sm:block">
              Context: {activeBoard.name} • {activeDetections.length} components • {activeDefects.length} defect flags
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Context Viewer Toggle Button */}
          <button
            onClick={() => setShowContextViewer(!showContextViewer)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium text-text-secondary hover:text-text-primary bg-bg-card hover:bg-bg-elevated border border-border-subtle transition-all"
            title="Inspect context payload transmitted to the neural assistant"
          >
            <Code className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="hidden sm:inline">Context Viewer</span>
            {showContextViewer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <Link
            href="/studio"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-brand-cyan bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Collapsible Context Viewer Drawer */}
      {showContextViewer && (
        <div className="bg-bg-base border-b border-cyan-500/30 p-4 shrink-0 max-h-56 overflow-y-auto font-mono text-xs text-text-secondary animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-border-subtle">
            <span className="font-semibold text-brand-cyan flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Active Hardware Grounding Context (Sent to POST /api/assistant)
            </span>
            <span className="text-[11px] text-text-muted">
              {activeDetections.length} bboxes • {activeDefects.length} defects
            </span>
          </div>
          <pre className="bg-bg-deepest p-3 rounded-xl border border-border-subtle text-[11px] leading-relaxed text-cyan-200 overflow-x-auto">
            {JSON.stringify(
              {
                boardName: activeBoard.name,
                selectedId: selectedDetectionId || null,
                detectionsCount: activeDetections.length,
                defectsCount: activeDefects.length,
                sampleDetections: activeDetections.slice(0, 3).map((d) => ({
                  designator: d.designator,
                  label: d.label,
                  bbox: d.bbox,
                  confidence: d.confidence,
                })),
                defects: activeDefects.map((def) => ({
                  type: def.type,
                  severity: def.severity,
                  region: def.region,
                })),
              },
              null,
              2
            )}
          </pre>
        </div>
      )}

      {/* 2. Main Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-4 scrollbar-thin">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 p-1 bg-bg-card rounded-2xl border border-border-subtle w-fit">
          <button
            onClick={() => setActiveMode('explain')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeMode === 'explain'
                ? 'bg-cyan-500/20 text-brand-cyan border border-cyan-500/40 shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Explain</span>
          </button>
          <button
            onClick={() => setActiveMode('assemble')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeMode === 'assemble'
                ? 'bg-cyan-500/20 text-brand-cyan border border-cyan-500/40 shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Assemble</span>
          </button>
          <button
            onClick={() => setActiveMode('troubleshoot')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeMode === 'troubleshoot'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Troubleshoot</span>
          </button>
        </div>

        {/* Suggested Queries based on active mode */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-cyan" />
            Suggested {activeMode.toUpperCase()} Inquiries
          </span>
          <div className="flex flex-wrap gap-2">
            {MODE_QUERIES[activeMode].map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSend(sq)}
                disabled={isStreaming}
                className="text-left text-xs font-mono px-3 py-1.5 rounded-xl bg-bg-elevated/60 hover:bg-bg-elevated border border-border-subtle hover:border-cyan-500/40 text-text-secondary hover:text-text-primary transition-all disabled:opacity-50"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Stream */}
        <div className="space-y-4 pt-2">
          {messages.map((m) => {
            const isAsst = m.role === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${isAsst ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono ${
                    isAsst
                      ? 'bg-cyan-500/20 text-brand-cyan border border-cyan-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {isAsst ? <Bot className="w-4 h-4" /> : 'YOU'}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed border ${
                    isAsst
                      ? 'bg-bg-card/90 border-border-subtle text-text-primary shadow-sm'
                      : 'bg-gradient-to-r from-cyan-950/70 to-teal-950/70 border-cyan-500/40 text-cyan-100 shadow-cyan-glow/20'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">
                    {m.content || (isStreaming ? <span className="animate-pulse">Reasoning from circuit knowledge base...</span> : '')}
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-text-muted text-right">
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 3. Input Bar */}
      <div className="p-4 bg-bg-base/90 backdrop-blur-md border-t border-border-subtle shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-3xl mx-auto flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot about defects, assembly sequence, pinouts, or rework..."
              disabled={isStreaming}
              className="w-full bg-bg-elevated/80 border border-border-subtle focus:border-cyan-400/80 rounded-2xl px-4 py-3 text-xs md:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-cyan-400 font-sans disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="p-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 text-bg-deepest font-bold hover:scale-105 active:scale-95 transition-all shadow-cyan-glow disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {isStreaming ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

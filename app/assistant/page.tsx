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
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useVisionStore } from '@/store/useVisionStore';
import { ChatMessage } from '@/types';
import Link from 'next/link';

const SUGGESTED_QUERIES = [
  '⚠️ How do I diagnose and rework the solder bridge short?',
  '🔍 What are the ATmega328P voltage ratings and maximum GPIO current?',
  '⚡ Explain the 5V and 3.3V power regulator distribution.',
  '📌 Verify SPI and I2C hardware bus pin assignments.',
];

export default function AssistantPage() {
  const { activeBoard, activeDetections, activeDefects, isModelConnected } = useVisionStore();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your **VisionGuard Hardware Copilot**.\n\nI have ingested the active inspection context for **${activeBoard.name}** (${activeDetections.length} components identified, ${activeDefects.length} defect flags). Ask me about defect diagnostics, multimeter verification steps, GPIO current limits, or component pinouts!`,
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

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    try {
      const payload = {
        messages: [...messages, userMessage].map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp || new Date().toISOString(),
        })),
        context: {
          boardName: activeBoard.name,
          detections: activeDetections,
          defects: activeDefects,
        },
      };

      const res = await fetch(`${apiUrl}/api/assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
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
    } catch (err) {
      console.warn('[VisionGuard Assistant Fallback]:', err);
      // Local fallback in case backend is offline
      const fallbackReply = `⚠️ **Backend Connection Notice**: Could not reach FastAPI copilot at \`${apiUrl}\`. Ensure the backend server is running on port 8000.\n\n*General Guidance for ${activeBoard.name}:* For solder defects, inspect adjacent header pins with a multimeter in buzzer continuity mode and apply flux + 330°C copper braid to clear shorts.`;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, content: fallbackReply } : msg
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
              <span className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded border border-cyan-500/40 bg-cyan-950/60 text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                LIVE SSE
              </span>
            </div>
            <p className="text-[11px] font-mono text-text-muted truncate hidden sm:block">
              Context: {activeBoard.name} • {activeDetections.length} components • {activeDefects.length} defect flags
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-brand-cyan bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Inspection Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Main Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4 scrollbar-thin">
        {/* Hardware Context Banner */}
        <div className="p-3.5 rounded-2xl bg-bg-card/70 border border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-brand-cyan" />
            <span>
              Target: <strong className="text-text-primary">{activeBoard.name}</strong>
            </span>
            <span className="text-border-strong">•</span>
            <span>
              Components: <strong className="text-brand-cyan">{activeDetections.length}</strong>
            </span>
            <span className="text-border-strong">•</span>
            <span>
              Defects: <strong className={activeDefects.length > 0 ? 'text-amber-400' : 'text-emerald-400'}>{activeDefects.length}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-text-muted text-[11px]">
            <Terminal className="w-3.5 h-3.5" />
            <span>FastAPI Backend: </span>
            <span className="text-emerald-400 font-semibold">http://localhost:8000</span>
          </div>
        </div>

        {/* Suggested Queries */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-cyan" />
            Suggested Technical Inquiries
          </span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUERIES.map((sq, i) => (
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
                    {m.content || (isStreaming ? <span className="animate-pulse">Thinking...</span> : '')}
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
              placeholder="Ask Copilot about defects, rework procedures, or component specs..."
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

/**
 * Server-Side LLM Route Adapter Stub (OpenAI / Anthropic / Local Ollama)
 *
 * Keeps API credentials safe on the server side via Next.js App Router API Route.
 *
 * Flow:
 * Browser Client -> POST /api/chat (Next.js route) -> Anthropic / OpenAI / Ollama -> SSE stream -> Client
 */

import { AssistantAdapter, AssistantContext } from './types';
import { ChatMessage } from '@/types';

export class LiveLlmAssistantAdapter implements AssistantAdapter {
  id = 'live-server-llm';
  name = 'VisionGuard LLM Agent (Cloud / Local Server)';
  version = '2.0.0-stub';
  isSimulated = false;

  async *ask(input: {
    messages: ChatMessage[];
    context: AssistantContext;
  }): AsyncIterable<string> {
    /*
    const response = await fetch('/api/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: input.messages,
        hardwareContext: {
          board: input.context.boardName,
          detections: input.context.detections,
          selectedComponent: input.context.selectedId,
          defects: input.context.defects,
        },
      }),
    });

    if (!response.body) throw new Error('ReadableStream not supported by endpoint');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield decoder.decode(value, { stream: true });
    }
    */

    yield `[Live LLM Adapter Stub] Connect your OPENAI_API_KEY or ANTHROPIC_API_KEY in .env.local to activate real-time reasoning with hardware context. Currently falling back to local simulated response.`;
  }
}

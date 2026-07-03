import type { LLMMessage } from '@forgemind/llm';
import type { PromptBlock } from '../types/index.js';
import { PromptBlockType } from '../types/index.js';
import { estimateTokens } from '../estimator/TokenEstimator.js';

export function createHistoryBlock(messages: readonly LLMMessage[]): PromptBlock {
  const lines = ['## Conversation History', ''];

  const conversationMessages = messages.filter((message) => message.role !== 'system');
  if (conversationMessages.length === 0) {
    lines.push('No conversation history.');
  } else {
    for (const message of conversationMessages) {
      const role = message.role === 'user' ? 'User' : 'Assistant';
      lines.push(`**${role}:** ${message.content}`);
      lines.push('');
    }
  }

  const content = lines.join('\n');
  return {
    id: 'history',
    type: PromptBlockType.History,
    label: 'Conversation History',
    content,
    enabled: conversationMessages.length > 0,
    order: 6,
    tokenCount: estimateTokens(content),
  };
}

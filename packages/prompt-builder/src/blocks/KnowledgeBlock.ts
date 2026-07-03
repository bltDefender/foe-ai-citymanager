import type { PromptBlock } from '../types/index.js';
import { PromptBlockType } from '../types/index.js';
import { estimateTokens } from '../estimator/TokenEstimator.js';

export function createKnowledgeBlock(docs: readonly string[]): PromptBlock {
  const content = docs.length > 0
    ? `## Knowledge Base\n\n${docs.join('\n\n---\n\n')}`
    : '## Knowledge Base\n\nNo additional knowledge documents loaded.';

  return {
    id: 'knowledge',
    type: PromptBlockType.Knowledge,
    label: 'Knowledge Base',
    content,
    enabled: docs.length > 0,
    order: 1,
    tokenCount: estimateTokens(content),
  };
}

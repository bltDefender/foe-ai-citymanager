import type { OptimizationGoal, PromptBlock } from '../types/index.js';
import { PromptBlockType } from '../types/index.js';
import { estimateTokens } from '../estimator/TokenEstimator.js';

export function createGoalsBlock(goals: readonly OptimizationGoal[]): PromptBlock {
  const lines = ['## Optimization Goals', ''];

  if (goals.length === 0) {
    lines.push('No specific goals set. Apply balanced optimization.');
  } else {
    const sorted = [...goals].sort((a, b) => b.priority - a.priority);
    for (const goal of sorted) {
      lines.push(`### ${goal.label} (Priority: ${goal.priority}/10)`);
      lines.push(goal.description);
      lines.push('');
    }
  }

  const content = lines.join('\n');
  return {
    id: 'goals',
    type: PromptBlockType.Goals,
    label: 'Optimization Goals',
    content,
    enabled: true,
    order: 2,
    tokenCount: estimateTokens(content),
  };
}

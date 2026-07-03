import type { Analysis } from '@forgemind/core';
import type { PromptBlock } from '../types/index.js';
import { PromptBlockType } from '../types/index.js';
import { estimateTokens } from '../estimator/TokenEstimator.js';

export function createAnalysisBlock(analysis: Analysis): PromptBlock {
  const lines: string[] = [
    '## City Analysis Results',
    '',
    '### Metrics',
    `- Road Coverage: ${analysis.metrics.roadPercentage.toFixed(1)}%`,
    `- Efficiency: ${(analysis.metrics.efficiency * 100).toFixed(1)}%`,
    `- Unused Space: ${analysis.metrics.unusedPercentage.toFixed(1)}%`,
    `- Occupied: ${analysis.metrics.occupiedPercentage.toFixed(1)}%`,
    `- Fragmentation: ${(analysis.metrics.fragmentation * 100).toFixed(1)}%`,
    `- Avg Road Distance: ${analysis.metrics.avgRoadDistance.toFixed(2)} tiles`,
    `- Connected Building Ratio: ${(analysis.metrics.connectedBuildingRatio * 100).toFixed(1)}%`,
    `- Largest Free Rectangle: ${analysis.metrics.largestFreeRectangle.width}x${analysis.metrics.largestFreeRectangle.height}`,
    '',
    '### Warnings',
  ];

  if (analysis.warnings.length === 0) {
    lines.push('- No warnings');
  } else {
    for (const warning of analysis.warnings) {
      lines.push(`- [${warning.level}] ${warning.message}`);
    }
  }

  lines.push('', '### Dead Ends');
  if (analysis.deadEnds.length === 0) {
    lines.push('- No dead ends detected');
  } else {
    lines.push(`- ${analysis.deadEnds.length} dead end road tiles detected`);
  }

  const content = lines.join('\n');
  return {
    id: 'analysis',
    type: PromptBlockType.Analysis,
    label: 'City Analysis',
    content,
    enabled: true,
    order: 4,
    tokenCount: estimateTokens(content),
  };
}

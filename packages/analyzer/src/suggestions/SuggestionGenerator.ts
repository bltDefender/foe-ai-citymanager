import type { City, AnalysisSuggestion, AnalysisMetrics } from '@forgemind/core';

let suggestionCounter = 0;

function nextId(): string {
  return `suggestion-${++suggestionCounter}`;
}

export function generateSuggestions(
  city: City,
  metrics: AnalysisMetrics,
): AnalysisSuggestion[] {
  suggestionCounter = 0;
  const suggestions: AnalysisSuggestion[] = [];

  if (metrics.roadPercentage > 20) {
    suggestions.push({
      id: nextId(),
      priority: 8,
      message: 'Reduce road tiles by using a spine layout',
      reason: `Roads currently occupy ${metrics.roadPercentage.toFixed(1)}% of your city. A spine layout uses fewer roads while maintaining connectivity.`,
      confidence: 0.8,
      impact: 0.7,
      affectedBuildingIds: [],
      dependencies: [],
    });
  }

  if (city.roads.length > 0) {
    const deadEndCount = city.analysis?.deadEnds.length ?? 0;
    if (deadEndCount > 2) {
      suggestions.push({
        id: nextId(),
        priority: 6,
        message: `Remove ${deadEndCount} dead-end road tiles`,
        reason: 'Dead-end roads consume space without connecting any buildings. Removing them frees tiles for productive buildings.',
        confidence: 0.9,
        impact: 0.5,
        affectedBuildingIds: [],
        dependencies: [],
      });
    }
  }

  if (metrics.fragmentation > 0.3) {
    suggestions.push({
      id: nextId(),
      priority: 7,
      message: 'Consolidate fragmented free space',
      reason: 'Your city has many small disconnected free areas. Consolidating them would allow larger buildings to be placed.',
      confidence: 0.75,
      impact: 0.6,
      affectedBuildingIds: [],
      dependencies: [],
    });
  }

  if (metrics.largestFreeRectangle.width * metrics.largestFreeRectangle.height > 9) {
    suggestions.push({
      id: nextId(),
      priority: 5,
      message: `Place a large building in the ${metrics.largestFreeRectangle.width}×${metrics.largestFreeRectangle.height} free area`,
      reason: 'There is a large contiguous free space available that could accommodate a Great Building or large cultural building.',
      confidence: 0.7,
      impact: 0.8,
      affectedBuildingIds: [],
      dependencies: [],
    });
  }

  return suggestions;
}

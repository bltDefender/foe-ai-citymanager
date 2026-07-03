import { describe, expect, it } from 'vitest';
import { PromptBuilder } from '../PromptBuilder.js';
import { BALANCED_TEMPLATE, PromptBlockType } from '../index.js';
import type { City } from '@forgemind/core';
import { BuildingCategory, BuildingState, Era, makeBuildingId, makeCityId } from '@forgemind/core';

function makeTestCity(): City {
  return {
    id: makeCityId('test'),
    width: 10,
    height: 10,
    era: Era.BronzeAge,
    owner: 'TestPlayer',
    buildings: [
      {
        id: makeBuildingId('b1'),
        entityId: 'b1',
        name: 'House',
        type: BuildingCategory.Residential,
        category: BuildingCategory.Residential,
        x: 0,
        y: 0,
        width: 2,
        height: 2,
        rotation: 0,
        connected: true,
        roadRequired: true,
        era: Era.BronzeAge,
        level: 1,
        state: BuildingState.Idle,
        productions: [],
        bonuses: [],
        tags: [],
        metadata: {},
      },
    ],
    roads: [],
    statistics: null,
    metadata: {
      gameVersion: '1',
      exportDate: new Date(),
      foeHelperVersion: '1',
      playerName: 'TestPlayer',
      era: Era.BronzeAge,
      source: 'test',
      checksum: '',
    },
    analysis: null,
  };
}

describe('PromptBuilder', () => {
  it('builds a package with default blocks', () => {
    const builder = new PromptBuilder();
    const pkg = builder.build();
    expect(pkg.blocks.length).toBeGreaterThan(0);
    expect(pkg.totalTokens).toBeGreaterThan(0);
  });

  it('includes city block when city is set', () => {
    const builder = new PromptBuilder();
    builder.setCity(makeTestCity());
    const pkg = builder.build();
    const cityBlock = pkg.blocks.find((block) => block.type === PromptBlockType.City);
    expect(cityBlock).toBeDefined();
    expect(cityBlock?.content).toContain('TestPlayer');
  });

  it('includes template block when template is set', () => {
    const builder = new PromptBuilder();
    builder.setTemplate(BALANCED_TEMPLATE);
    const pkg = builder.build();
    const templateBlock = pkg.blocks.find((block) => block.type === PromptBlockType.Template);
    expect(templateBlock).toBeDefined();
    expect(templateBlock?.label).toBe('Balanced Optimization');
  });

  it('excludes disabled blocks', () => {
    const builder = new PromptBuilder();
    builder.setBlockEnabled(PromptBlockType.System, false);
    const pkg = builder.build();
    const systemBlock = pkg.blocks.find((block) => block.type === PromptBlockType.System);
    expect(systemBlock).toBeUndefined();
  });

  it('builds messages for LLM', () => {
    const builder = new PromptBuilder();
    builder.setCity(makeTestCity());
    const messages = builder.buildMessages();
    expect(messages.length).toBeGreaterThan(0);
    const systemMsg = messages.find((message) => message.role === 'system');
    expect(systemMsg).toBeDefined();
    const userMsg = messages.find((message) => message.role === 'user');
    expect(userMsg).toBeDefined();
  });

  it('sets goals correctly', () => {
    const builder = new PromptBuilder();
    builder.setGoals([{ id: 'g1', label: 'Reduce Roads', description: 'Minimize road tiles', priority: 9 }]);
    const pkg = builder.build();
    const goalsBlock = pkg.blocks.find((block) => block.type === PromptBlockType.Goals);
    expect(goalsBlock?.content).toContain('Reduce Roads');
  });

  it('includes history when set', () => {
    const builder = new PromptBuilder();
    builder.setHistory([{ role: 'user', content: 'Previous question' }]);
    const messages = builder.buildMessages();
    const historyMsg = messages.find((message) => message.content === 'Previous question');
    expect(historyMsg).toBeDefined();
  });
});

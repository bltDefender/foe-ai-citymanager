import { beforeEach, describe, expect, it } from 'vitest';
import { KnowledgeLoader } from '../loader/KnowledgeLoader.js';
import { KnowledgeRegistry } from '../registry/KnowledgeRegistry.js';
import { KnowledgeCategory } from '../types/index.js';
import { GAME_MECHANICS_DOC } from '../documents/official/game-mechanics.js';
import { GREAT_BUILDINGS_DOC } from '../documents/official/great-buildings.js';

describe('KnowledgeLoader', () => {
  let loader: KnowledgeLoader;
  let registry: KnowledgeRegistry;

  beforeEach(() => {
    registry = new KnowledgeRegistry();
    registry.register(GAME_MECHANICS_DOC);
    registry.register(GREAT_BUILDINGS_DOC);
    loader = new KnowledgeLoader(registry);
  });

  it('loads document by id', () => {
    const doc = loader.loadDocument('official/game-mechanics');
    expect(doc.meta.title).toBe('FoE Game Mechanics');
  });

  it('throws for unknown id', () => {
    expect(() => loader.loadDocument('nonexistent')).toThrow();
  });

  it('loads by tags', () => {
    const docs = loader.loadByTags(['roads']);
    expect(docs.length).toBeGreaterThan(0);
  });

  it('loads by category', () => {
    const docs = loader.loadByCategory(KnowledgeCategory.GameMechanics);
    expect(docs.length).toBeGreaterThan(0);
  });

  it('builds context from multiple docs', () => {
    const context = loader.buildContext(['official/game-mechanics', 'official/great-buildings']);
    expect(context).toContain('FoE Game Mechanics');
    expect(context).toContain('Great Buildings');
  });
});

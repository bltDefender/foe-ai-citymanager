import { beforeEach, describe, expect, it } from 'vitest';
import { KnowledgeRegistry } from '../registry/KnowledgeRegistry.js';
import { KnowledgeCategory, KnowledgeSource } from '../types/index.js';
import type { KnowledgeDocument } from '../types/index.js';

function makeDoc(id: string, category: KnowledgeCategory, tags: string[] = []): KnowledgeDocument {
  return {
    meta: {
      id,
      title: `Doc ${id}`,
      version: '1.0',
      author: 'test',
      date: '2024-01-01',
      source: KnowledgeSource.Official,
      tags,
      category,
    },
    content: `Content for ${id}. This is about ${tags.join(', ')}.`,
  };
}

describe('KnowledgeRegistry', () => {
  let registry: KnowledgeRegistry;

  beforeEach(() => {
    registry = new KnowledgeRegistry();
  });

  it('registers and retrieves documents', () => {
    const doc = makeDoc('doc1', KnowledgeCategory.GameMechanics);
    registry.register(doc);
    expect(registry.get('doc1')).toBe(doc);
  });

  it('returns undefined for unknown document', () => {
    expect(registry.get('nonexistent')).toBeUndefined();
  });

  it('lists all documents', () => {
    registry.register(makeDoc('doc1', KnowledgeCategory.GameMechanics));
    registry.register(makeDoc('doc2', KnowledgeCategory.Strategies));
    expect(registry.list()).toHaveLength(2);
  });

  it('searches by category', () => {
    registry.register(makeDoc('doc1', KnowledgeCategory.GameMechanics));
    registry.register(makeDoc('doc2', KnowledgeCategory.Strategies));
    registry.register(makeDoc('doc3', KnowledgeCategory.GameMechanics));
    const results = registry.search({ categories: [KnowledgeCategory.GameMechanics] });
    expect(results).toHaveLength(2);
  });

  it('searches by tags', () => {
    registry.register(makeDoc('doc1', KnowledgeCategory.GameMechanics, ['roads', 'efficiency']));
    registry.register(makeDoc('doc2', KnowledgeCategory.Strategies, ['attack', 'military']));
    const results = registry.search({ tags: ['roads'] });
    expect(results).toHaveLength(1);
    expect(results[0]?.meta.id).toBe('doc1');
  });

  it('searches full text', () => {
    registry.register(makeDoc('doc1', KnowledgeCategory.GameMechanics, ['roads']));
    registry.register(makeDoc('doc2', KnowledgeCategory.Strategies, ['attack']));
    const results = registry.search({ fullText: 'roads' });
    expect(results.length).toBeGreaterThan(0);
  });

  it('getByCategory returns matching documents', () => {
    registry.register(makeDoc('doc1', KnowledgeCategory.GreatBuildings));
    registry.register(makeDoc('doc2', KnowledgeCategory.GameMechanics));
    const results = registry.getByCategory(KnowledgeCategory.GreatBuildings);
    expect(results).toHaveLength(1);
    expect(results[0]?.meta.id).toBe('doc1');
  });
});

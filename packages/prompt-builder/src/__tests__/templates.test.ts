import { describe, expect, it } from 'vitest';
import {
  ATTACK_TEMPLATE,
  BALANCED_TEMPLATE,
  BUILTIN_TEMPLATES,
  EXPERIMENTAL_TEMPLATE,
  FORGE_POINTS_TEMPLATE,
  GOODS_TEMPLATE,
  SPACE_SAVING_TEMPLATE,
} from '../templates/BuiltinTemplates.js';

describe('BuiltinTemplates', () => {
  it('has all required templates', () => {
    expect(BUILTIN_TEMPLATES.balanced).toBeDefined();
    expect(BUILTIN_TEMPLATES.attack).toBeDefined();
    expect(BUILTIN_TEMPLATES.forge_points).toBeDefined();
    expect(BUILTIN_TEMPLATES.space_saving).toBeDefined();
    expect(BUILTIN_TEMPLATES.goods).toBeDefined();
    expect(BUILTIN_TEMPLATES.experimental).toBeDefined();
  });

  it('each template has required fields', () => {
    for (const template of Object.values(BUILTIN_TEMPLATES)) {
      expect(template.id).toBeTruthy();
      expect(template.name).toBeTruthy();
      expect(template.description).toBeTruthy();
      expect(template.content.length).toBeGreaterThan(100);
      expect(template.tags.length).toBeGreaterThan(0);
    }
  });

  it('balanced template covers key topics', () => {
    expect(BALANCED_TEMPLATE.content).toContain('road');
    expect(BALANCED_TEMPLATE.content).toContain('Forge Point');
  });

  it('attack template mentions key GBs', () => {
    expect(ATTACK_TEMPLATE.content).toContain('Arc');
    expect(ATTACK_TEMPLATE.content).toContain('Alcatraz');
  });

  it('exports named templates', () => {
    expect(FORGE_POINTS_TEMPLATE.id).toBe('forge_points');
    expect(SPACE_SAVING_TEMPLATE.id).toBe('space_saving');
    expect(GOODS_TEMPLATE.id).toBe('goods');
    expect(EXPERIMENTAL_TEMPLATE.id).toBe('experimental');
  });
});

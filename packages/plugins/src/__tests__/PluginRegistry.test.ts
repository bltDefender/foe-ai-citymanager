import { describe, expect, it, vi } from 'vitest';
import { PluginRegistry } from '../registry/PluginRegistry.js';
import type { IPlugin, PluginCapability } from '../types/index.js';
import { makePluginId, PluginStatus } from '../types/index.js';

function makePlugin(id: string, capabilities: PluginCapability[] = []): IPlugin {
  return {
    metadata: {
      id: makePluginId(id),
      name: `Plugin ${id}`,
      version: '1.0.0',
      description: 'Test plugin',
      author: 'Test',
      capabilities,
    },
    status: PluginStatus.Inactive,
    load: vi.fn().mockResolvedValue(undefined),
    initialize: vi.fn().mockResolvedValue(undefined),
    activate: vi.fn().mockResolvedValue(undefined),
    deactivate: vi.fn().mockResolvedValue(undefined),
    unload: vi.fn().mockResolvedValue(undefined),
  };
}

describe('PluginRegistry', () => {
  it('registers and retrieves plugins', () => {
    const registry = new PluginRegistry();
    const plugin = makePlugin('plugin-1');
    registry.register(plugin);
    expect(registry.get(makePluginId('plugin-1'))).toBe(plugin);
  });

  it('lists all plugins', () => {
    const registry = new PluginRegistry();
    registry.register(makePlugin('p1'));
    registry.register(makePlugin('p2'));
    expect(registry.list()).toHaveLength(2);
  });

  it('unregisters a plugin', () => {
    const registry = new PluginRegistry();
    registry.register(makePlugin('p1'));
    registry.unregister(makePluginId('p1'));
    expect(registry.get(makePluginId('p1'))).toBeUndefined();
  });

  it('gets plugins by capability', () => {
    const registry = new PluginRegistry();
    registry.register(makePlugin('p1', ['LLMProvider']));
    registry.register(makePlugin('p2', ['KnowledgeProvider']));
    registry.register(makePlugin('p3', ['LLMProvider', 'Validator']));

    const llmPlugins = registry.getByCapability('LLMProvider');
    expect(llmPlugins).toHaveLength(2);
  });
});

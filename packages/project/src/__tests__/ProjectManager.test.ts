import { describe, expect, it } from 'vitest';
import type { City } from '@forgemind/core';
import { Era, makeCityId } from '@forgemind/core';
import { ProjectManager } from '../ProjectManager.js';

function makeTestCity(): City {
  return {
    id: makeCityId('city1'),
    width: 10,
    height: 10,
    era: Era.BronzeAge,
    owner: 'Test',
    buildings: [],
    roads: [],
    statistics: null,
    metadata: {
      gameVersion: '1',
      exportDate: new Date(),
      foeHelperVersion: '1',
      playerName: 'Test',
      era: Era.BronzeAge,
      source: 'test',
      checksum: '',
    },
    analysis: null,
  };
}

describe('ProjectManager', () => {
  const manager = new ProjectManager();

  it('creates a project', () => {
    const project = manager.createProject('My City');
    expect(project.name).toBe('My City');
    expect(project.city).toBeNull();
    expect(project.conversation).toHaveLength(0);
    expect(project.runs).toHaveLength(0);
  });

  it('creates project with city', () => {
    const city = makeTestCity();
    const project = manager.createProject('City Project', city);
    expect(project.city).toBe(city);
  });

  it('adds conversation entry', () => {
    const project = manager.createProject('Test');
    const entry = {
      id: 'e1',
      role: 'user' as const,
      content: 'Hello',
      timestamp: new Date(),
    };
    const updated = manager.addConversationEntry(project, entry);
    expect(updated.conversation).toHaveLength(1);
    expect(updated.conversation[0]?.content).toBe('Hello');
  });

  it('serializes and deserializes project', () => {
    const city = makeTestCity();
    const project = manager.createProject('Test Project', city);
    const json = manager.serialize(project);
    const restored = manager.deserialize(json);
    expect(restored.name).toBe('Test Project');
    expect(restored.id).toBe(project.id);
    expect(restored.createdAt).toBeInstanceOf(Date);
  });

  it('updates city', () => {
    const project = manager.createProject('Test');
    const city = makeTestCity();
    const updated = manager.updateCity(project, city);
    expect(updated.city).toBe(city);
  });

  it('immutable - does not mutate original', () => {
    const project = manager.createProject('Test');
    const entry = { id: 'e1', role: 'user' as const, content: 'Hi', timestamp: new Date() };
    const updated = manager.addConversationEntry(project, entry);
    expect(project.conversation).toHaveLength(0);
    expect(updated.conversation).toHaveLength(1);
  });
});

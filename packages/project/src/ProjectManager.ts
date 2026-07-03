import type { City } from '@forgemind/core';
import { makeProjectId } from './types/index.js';
import type { ConversationEntry, OptimizationRun, Project, ProjectSettings } from './types/index.js';

const DEFAULT_SETTINGS: ProjectSettings = {
  providerConfig: {
    id: 'openai',
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 4096,
    streaming: true,
  },
  theme: 'dark',
  tileSize: 48,
  showGrid: true,
};

interface SerializedConversationEntry extends Omit<ConversationEntry, 'timestamp'> {
  readonly timestamp: string;
}

interface SerializedOptimizationRun extends Omit<OptimizationRun, 'timestamp'> {
  readonly timestamp: string;
}

interface SerializedProject extends Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'conversation' | 'runs'> {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly conversation: readonly SerializedConversationEntry[];
  readonly runs: readonly SerializedOptimizationRun[];
}

export class ProjectManager {
  createProject(name: string, city: City | null = null): Project {
    const now = new Date();
    return {
      id: makeProjectId(`proj-${Date.now()}`),
      name,
      createdAt: now,
      updatedAt: now,
      city,
      conversation: [],
      runs: [],
      settings: DEFAULT_SETTINGS,
    };
  }

  addConversationEntry(project: Project, entry: ConversationEntry): Project {
    return {
      ...project,
      conversation: [...project.conversation, entry],
      updatedAt: new Date(),
    };
  }

  addOptimizationRun(project: Project, run: OptimizationRun): Project {
    return {
      ...project,
      runs: [...project.runs, run],
      updatedAt: new Date(),
    };
  }

  updateCity(project: Project, city: City): Project {
    return { ...project, city, updatedAt: new Date() };
  }

  updateSettings(project: Project, settings: Partial<ProjectSettings>): Project {
    return {
      ...project,
      settings: { ...project.settings, ...settings },
      updatedAt: new Date(),
    };
  }

  serialize(project: Project): string {
    return JSON.stringify({
      ...project,
      id: project.id as string,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      conversation: project.conversation.map((entry) => ({
        ...entry,
        timestamp: entry.timestamp.toISOString(),
      })),
      runs: project.runs.map((run) => ({
        ...run,
        timestamp: run.timestamp.toISOString(),
      })),
    });
  }

  deserialize(json: string): Project {
    const data = JSON.parse(json) as SerializedProject;
    const conversation: ConversationEntry[] = data.conversation.map((entry) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));

    const runs: OptimizationRun[] = data.runs.map((run) => ({
      ...run,
      timestamp: new Date(run.timestamp),
    }));

    return {
      id: makeProjectId(data.id),
      name: data.name,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      city: data.city,
      conversation,
      runs,
      settings: data.settings,
    };
  }
}

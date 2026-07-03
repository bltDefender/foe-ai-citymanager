export const KnowledgeSource = {
  Official: 'Official',
  Community: 'Community',
  User: 'User',
} as const;
export type KnowledgeSource = (typeof KnowledgeSource)[keyof typeof KnowledgeSource];

export const KnowledgeCategory = {
  GameMechanics: 'GameMechanics',
  Buildings: 'Buildings',
  Eras: 'Eras',
  GreatBuildings: 'GreatBuildings',
  Strategies: 'Strategies',
  Guides: 'Guides',
  Templates: 'Templates',
  Custom: 'Custom',
} as const;
export type KnowledgeCategory = (typeof KnowledgeCategory)[keyof typeof KnowledgeCategory];

export interface KnowledgeDocumentMeta {
  readonly id: string;
  readonly title: string;
  readonly version: string;
  readonly author: string;
  readonly date: string;
  readonly source: KnowledgeSource;
  readonly tags: readonly string[];
  readonly category: KnowledgeCategory;
}

export interface KnowledgeDocument {
  readonly meta: KnowledgeDocumentMeta;
  readonly content: string;
}

export interface KnowledgeSearchQuery {
  readonly tags?: readonly string[];
  readonly categories?: readonly KnowledgeCategory[];
  readonly fullText?: string;
}

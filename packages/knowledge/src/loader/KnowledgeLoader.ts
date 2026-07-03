import type { KnowledgeCategory, KnowledgeDocument, KnowledgeSearchQuery } from '../types/index.js';
import { KnowledgeRegistry } from '../registry/KnowledgeRegistry.js';

export class KnowledgeLoader {
  private readonly registry: KnowledgeRegistry;

  constructor(registry: KnowledgeRegistry) {
    this.registry = registry;
  }

  loadDocument(id: string): KnowledgeDocument {
    const doc = this.registry.get(id);
    if (!doc) throw new Error(`Knowledge document '${id}' not found`);
    return doc;
  }

  loadByTags(tags: string[]): KnowledgeDocument[] {
    return this.registry.search({ tags });
  }

  loadByCategory(category: KnowledgeCategory): KnowledgeDocument[] {
    return this.registry.getByCategory(category);
  }

  search(query: KnowledgeSearchQuery): KnowledgeDocument[] {
    return this.registry.search(query);
  }

  buildContext(ids: string[]): string {
    const docs = ids.map((id) => this.registry.get(id)).filter(Boolean) as KnowledgeDocument[];
    return docs.map((doc) => `# ${doc.meta.title}\n\n${doc.content}`).join('\n\n---\n\n');
  }
}

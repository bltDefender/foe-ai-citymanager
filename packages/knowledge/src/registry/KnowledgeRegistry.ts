import type { KnowledgeCategory, KnowledgeDocument, KnowledgeSearchQuery } from '../types/index.js';

export class KnowledgeRegistry {
  private readonly documents = new Map<string, KnowledgeDocument>();

  register(doc: KnowledgeDocument): void {
    this.documents.set(doc.meta.id, doc);
  }

  get(id: string): KnowledgeDocument | undefined {
    return this.documents.get(id);
  }

  list(): KnowledgeDocument[] {
    return Array.from(this.documents.values());
  }

  search(query: KnowledgeSearchQuery): KnowledgeDocument[] {
    let results = this.list();

    if (query.categories && query.categories.length > 0) {
      results = results.filter((doc) => query.categories!.includes(doc.meta.category));
    }

    if (query.tags && query.tags.length > 0) {
      results = results.filter((doc) => query.tags!.some((tag) => doc.meta.tags.includes(tag)));
    }

    if (query.fullText) {
      const lower = query.fullText.toLowerCase();
      results = results.filter(
        (doc) => doc.content.toLowerCase().includes(lower) || doc.meta.title.toLowerCase().includes(lower),
      );
    }

    return results;
  }

  getByCategory(category: KnowledgeCategory): KnowledgeDocument[] {
    return this.list().filter((doc) => doc.meta.category === category);
  }
}

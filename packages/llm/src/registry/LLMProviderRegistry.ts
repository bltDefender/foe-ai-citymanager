import type { ILLMProvider } from '../ILLMProvider.js';

export class LLMProviderRegistry {
  private readonly providers = new Map<string, ILLMProvider>();

  register(id: string, provider: ILLMProvider): void {
    this.providers.set(id, provider);
  }

  get(id: string): ILLMProvider {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new Error(`Provider '${id}' not found in registry`);
    }
    return provider;
  }

  list(): string[] {
    return Array.from(this.providers.keys());
  }

  has(id: string): boolean {
    return this.providers.has(id);
  }

  unregister(id: string): void {
    this.providers.delete(id);
  }
}

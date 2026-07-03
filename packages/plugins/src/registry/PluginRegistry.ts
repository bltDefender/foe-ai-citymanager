import type { IPlugin, PluginCapability, PluginId } from '../types/index.js';
import { PluginStatus } from '../types/index.js';

export class PluginRegistry {
  private readonly plugins = new Map<string, IPlugin>();

  register(plugin: IPlugin): void {
    this.plugins.set(plugin.metadata.id as string, plugin);
  }

  unregister(id: PluginId): void {
    this.plugins.delete(id as string);
  }

  get(id: PluginId): IPlugin | undefined {
    return this.plugins.get(id as string);
  }

  list(): IPlugin[] {
    return Array.from(this.plugins.values());
  }

  getByCapability(capability: PluginCapability): IPlugin[] {
    return this.list().filter((plugin) => plugin.metadata.capabilities.includes(capability));
  }

  getActive(): IPlugin[] {
    return this.list().filter((plugin) => plugin.status === PluginStatus.Active);
  }
}

import type { Permission, PluginManifest } from '../core/types';

const ALLOWED_PERMISSIONS = new Set<Permission>(['net', 'fs', 'ui', 'hw', 'runtime']);
const ID_PATTERN = /^[a-z0-9][a-z0-9._-]{1,63}$/;

export interface PluginGrantStore {
  isGranted(pluginId: string, permission: Permission): boolean;
  requestGrant(pluginId: string, permission: Permission): Promise<boolean>;
}

export class PluginManager {
  private readonly manifests = new Map<string, PluginManifest>();
  constructor(private readonly grants: PluginGrantStore) {}

  validateManifest(value: unknown): PluginManifest {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Manifest must be an object');
    const m = value as Record<string, unknown>;
    if (typeof m.id !== 'string' || !ID_PATTERN.test(m.id)) throw new Error('Invalid plugin id');
    if (typeof m.version !== 'string' || !/^\d+\.\d+\.\d+([+-][\w.-]+)?$/.test(m.version)) throw new Error('Version must be semver-like');
    if (typeof m.entry !== 'string' || m.entry.startsWith('/') || m.entry.includes('..') || !/^[\w./-]+\.(js|mjs|wasm)$/.test(m.entry)) throw new Error('Invalid plugin entry path');
    if (!Array.isArray(m.permissions) || m.permissions.some(p => !ALLOWED_PERMISSIONS.has(p as Permission))) throw new Error('Invalid permissions list');
    if (m.description !== undefined && typeof m.description !== 'string') throw new Error('Invalid description');
    return { id: m.id, version: m.version, entry: m.entry, permissions: [...new Set(m.permissions as Permission[])], description: m.description as string | undefined };
  }

  registerManifest(value: unknown) {
    const manifest = this.validateManifest(value);
    if (this.manifests.has(manifest.id)) throw new Error(`Plugin already registered: ${manifest.id}`);
    this.manifests.set(manifest.id, manifest);
    return manifest;
  }

  getManifest(id: string) { return this.manifests.get(id); }

  async getGrantedPermissions(pluginId: string): Promise<Permission[]> {
    const manifest = this.manifests.get(pluginId);
    if (!manifest) throw new Error('Unknown plugin');
    const granted: Permission[] = [];
    for (const permission of manifest.permissions) {
      if (this.grants.isGranted(pluginId, permission) || await this.grants.requestGrant(pluginId, permission)) granted.push(permission);
    }
    return granted;
  }

  // Intentionally no `execute()` method: execution belongs in a separately isolated host.
}

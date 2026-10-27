export type Permission = 'net' | 'fs' | 'ui' | 'hw' | 'runtime';

export interface ToolCall<TArgs = unknown> {
  id: string;
  tool: string;
  args: TArgs;
  requestedPermissions?: Permission[];
}

export interface ToolContext {
  callId: string;
  signal: AbortSignal;
  hasPermission(permission: Permission): boolean;
}

export interface AuditRecord {
  id: string;
  tool: string;
  startedAt: number;
  finishedAt: number;
  status: 'success' | 'error' | 'timeout' | 'denied' | 'cancelled';
  durationMs: number;
  error?: string;
}

export interface WidgetSpec {
  id: string;
  kind: 'text' | 'metric' | 'action' | 'code' | 'status';
  title?: string;
  payload: Record<string, unknown>;
}

export interface PluginManifest {
  id: string;
  version: string;
  entry: string;
  permissions: Permission[];
  description?: string;
}

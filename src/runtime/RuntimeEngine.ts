import type { AuditRecord, Permission, ToolCall } from '../core/types';
import { ToolRegistry } from './ToolRegistry';

export interface RuntimeOptions {
  hasPermission(permission: Permission, call: ToolCall): boolean;
  timeoutMs?: number;
  maxAuditRecords?: number;
}

export class RuntimeEngine {
  private readonly audit: AuditRecord[] = [];
  private readonly controllers = new Map<string, AbortController>();
  constructor(private readonly registry: ToolRegistry, private readonly options: RuntimeOptions) {}

  getAuditRecords() { return this.audit.map(record => ({ ...record })); }
  cancel(callId: string) { this.controllers.get(callId)?.abort(new Error('Cancelled by host')); }

  async execute<T = unknown>(call: ToolCall): Promise<T> {
    if (!call || typeof call.id !== 'string' || !/^[\w-]{1,100}$/.test(call.id)) throw new Error('Invalid tool call id');
    const definition = this.registry.get(call.tool);
    const startedAt = Date.now();
    if (!definition) {
      this.record({ id: call.id, tool: call.tool, startedAt, finishedAt: Date.now(), status: 'denied', durationMs: 0, error: 'Unknown tool' });
      throw new Error(`Unknown tool: ${call.tool}`);
    }
    if (!definition.validateArgs(call.args)) {
      this.record({ id: call.id, tool: call.tool, startedAt, finishedAt: Date.now(), status: 'denied', durationMs: 0, error: 'Invalid arguments' });
      throw new Error('Tool arguments failed validation');
    }
    for (const permission of definition.requiredPermissions) {
      if (!this.options.hasPermission(permission, call)) {
        this.record({ id: call.id, tool: call.tool, startedAt, finishedAt: Date.now(), status: 'denied', durationMs: 0, error: `Permission denied: ${permission}` });
        throw new Error(`Permission denied: ${permission}`);
      }
    }
    if (this.controllers.has(call.id)) throw new Error(`Duplicate active call id: ${call.id}`);
    const controller = new AbortController();
    this.controllers.set(call.id, controller);
    const timeoutMs = Math.max(100, Math.min(this.options.timeoutMs ?? 10_000, 120_000));
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const timedOut = new Promise<never>((_, reject) => {
        timeout = setTimeout(() => {
          controller.abort(new Error('Tool timed out'));
          reject(new Error('Tool timed out'));
        }, timeoutMs);
      });
      const work = Promise.resolve().then(() => definition.handler(call.args, {
        callId: call.id,
        signal: controller.signal,
        hasPermission: permission => this.options.hasPermission(permission, call),
      }));
      const result = await Promise.race([work, timedOut]);
      this.record({ id: call.id, tool: call.tool, startedAt, finishedAt: Date.now(), status: 'success', durationMs: Date.now() - startedAt });
      return result as T;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const status = controller.signal.aborted ? (message.toLowerCase().includes('timed out') ? 'timeout' : 'cancelled') : 'error';
      this.record({ id: call.id, tool: call.tool, startedAt, finishedAt: Date.now(), status, durationMs: Date.now() - startedAt, error: message.slice(0, 500) });
      throw error;
    } finally {
      if (timeout) clearTimeout(timeout);
      this.controllers.delete(call.id);
    }
  }

  private record(record: AuditRecord) {
    this.audit.push(record);
    const max = Math.max(100, this.options.maxAuditRecords ?? 2_000);
    if (this.audit.length > max) this.audit.splice(0, this.audit.length - max);
  }
}

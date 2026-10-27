import type { ToolCall } from '../core/types';

// Parses one JSON payload inside [Omni_call]...[/Omni_call]. Parsing does not execute it.
export function parseOmniCall(input: string): ToolCall {
  const start = input.indexOf('[Omni_call]');
  const end = input.indexOf('[/Omni_call]');
  if (start < 0 || end < start) throw new Error('Omni_call block not found');
  const raw = input.slice(start + '[Omni_call]'.length, end).trim();
  if (raw.length > 64_000) throw new Error('Omni_call payload too large');
  let value: unknown;
  try { value = JSON.parse(raw); } catch { throw new Error('Omni_call payload must be valid JSON'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Omni_call must be an object');
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.id !== 'string' || typeof candidate.tool !== 'string' || !('args' in candidate)) throw new Error('Omni_call requires id, tool and args');
  if (candidate.requestedPermissions !== undefined && (!Array.isArray(candidate.requestedPermissions) || candidate.requestedPermissions.some(p => !['net', 'fs', 'ui', 'hw', 'runtime'].includes(String(p))))) throw new Error('Invalid requestedPermissions');
  return candidate as unknown as ToolCall;
}

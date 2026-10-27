import type { Permission, ToolContext } from '../core/types';

export interface ToolDefinition<TArgs = unknown, TResult = unknown> {
  name: string;
  requiredPermissions: Permission[];
  validateArgs(value: unknown): value is TArgs;
  handler(args: TArgs, context: ToolContext): Promise<TResult> | TResult;
}

export class ToolRegistry {
  private readonly tools = new Map<string, ToolDefinition<any, any>>();

  register<TArgs, TResult>(definition: ToolDefinition<TArgs, TResult>) {
    if (!/^[a-z][a-z0-9_.-]{0,63}$/.test(definition.name)) throw new Error('Invalid tool name');
    if (this.tools.has(definition.name)) throw new Error(`Tool already registered: ${definition.name}`);
    this.tools.set(definition.name, definition);
  }

  get(name: string) { return this.tools.get(name); }
  list() { return [...this.tools.values()].map(({ name, requiredPermissions }) => ({ name, requiredPermissions })); }
}

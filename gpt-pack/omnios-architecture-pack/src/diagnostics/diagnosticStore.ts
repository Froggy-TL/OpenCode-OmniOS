import { defineStore } from 'pinia';
import { ref } from 'vue';

export type DiagnosticLevel = 'debug' | 'info' | 'warn' | 'error';
export interface DiagnosticEntry { id: string; at: number; level: DiagnosticLevel; source: string; message: string; details?: string }

export const useDiagnosticStore = defineStore('omnios-diagnostics', () => {
  const entries = ref<DiagnosticEntry[]>([]);
  const maxEntries = 1_000;
  function log(level: DiagnosticLevel, source: string, message: string, details?: unknown) {
    entries.value.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      at: Date.now(), level, source: source.slice(0, 100), message: message.slice(0, 2_000),
      details: details === undefined ? undefined : String(details instanceof Error ? details.stack ?? details.message : details).slice(0, 5_000),
    });
    if (entries.value.length > maxEntries) entries.value.splice(0, entries.value.length - maxEntries);
  }
  function clear() { entries.value = []; }
  return { entries, log, clear };
});

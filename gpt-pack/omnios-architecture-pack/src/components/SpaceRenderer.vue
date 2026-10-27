<script setup lang="ts">
import { computed } from 'vue';
import { useSpaceStore } from '../spaces/spaceStore';
import type { WidgetSpec } from '../core/types';

const props = defineProps<{ spaceId: string }>();
const spaces = useSpaceStore();
const space = computed(() => spaces.spaces[props.spaceId]);

function display(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value === null || ['number', 'boolean'].includes(typeof value)) return String(value);
  try { return JSON.stringify(value, null, 2); } catch { return '[unavailable]'; }
}
</script>

<template>
  <section class="space-root" :aria-label="space?.name ?? 'Virtual space'">
    <p v-if="!space" class="space-empty">Este espacio no existe.</p>
    <article v-for="widget in (space?.widgets ?? []) as WidgetSpec[]" :key="widget.id" class="space-widget">
      <header v-if="widget.title" class="space-widget__title">{{ widget.title }}</header>
      <p v-if="widget.kind === 'text' || widget.kind === 'status'">{{ display(widget.payload.text ?? widget.payload.status ?? '') }}</p>
      <div v-else-if="widget.kind === 'metric'" class="space-metric">{{ display(widget.payload.value ?? '—') }}</div>
      <pre v-else-if="widget.kind === 'code'" class="space-code"><code>{{ display(widget.payload.code ?? '') }}</code></pre>
      <p v-else-if="widget.kind === 'action'">Acción disponible: {{ display(widget.payload.label ?? widget.id) }}</p>
    </article>
    <p v-if="space && space.widgets.length === 0" class="space-empty">Espacio listo para materializar widgets.</p>
  </section>
</template>

<style scoped>
.space-root{display:grid;gap:12px;align-content:start;min-width:0}.space-widget{padding:14px;border:1px solid color-mix(in srgb,var(--omni-accent,#67dfff) 35%,transparent);border-radius:16px;background:color-mix(in srgb,var(--omni-panel,#121b2a) 88%,transparent);backdrop-filter:blur(18px);color:var(--omni-text,#eef8ff);box-shadow:inset 0 1px #ffffff12,0 10px 28px #0002}.space-widget__title{font-weight:650;margin-bottom:8px}.space-metric{font-size:1.7rem;font-variant-numeric:tabular-nums}.space-code{overflow:auto;max-height:45vh;white-space:pre-wrap}.space-empty{opacity:.65;font-size:.9rem}
</style>

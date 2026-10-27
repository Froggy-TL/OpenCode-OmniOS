<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDiagnosticStore } from '../diagnostics/diagnosticStore';
const store = useDiagnosticStore();
const open = ref(false);
const filter = ref<'all' | 'error' | 'warn'>('all');
const visibleEntries = computed(() => store.entries.filter(entry => filter.value === 'all' || entry.level === filter.value).slice().reverse());
</script>

<template>
  <aside class="diag" :class="{ 'diag--open': open }" aria-label="System diagnostics">
    <button class="diag__toggle" type="button" @click="open = !open" :aria-expanded="open">{{ open ? 'Cerrar consola' : `SYSTEM // ${store.entries.length}` }}</button>
    <section v-if="open" class="diag__panel">
      <header class="diag__header"><strong>OMNI // OBSERVATORY</strong><button type="button" @click="store.clear()">Limpiar</button></header>
      <label class="diag__filter">Filtro
        <select v-model="filter"><option value="all">Todos</option><option value="error">Errores</option><option value="warn">Avisos</option></select>
      </label>
      <div class="diag__logs" role="log" aria-live="polite">
        <article v-for="entry in visibleEntries" :key="entry.id" class="diag__entry" :class="`level-${entry.level}`">
          <small>{{ new Date(entry.at).toLocaleTimeString() }} · {{ entry.source }} · {{ entry.level.toUpperCase() }}</small>
          <div>{{ entry.message }}</div><pre v-if="entry.details">{{ entry.details }}</pre>
        </article>
        <p v-if="visibleEntries.length === 0">Sin eventos en este filtro.</p>
      </div>
    </section>
  </aside>
</template>

<style scoped>
.diag{position:fixed;z-index:9000;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));font:12px/1.45 ui-monospace,SFMono-Regular,monospace;color:#d8fff1}.diag__toggle,.diag__panel{background:#07130ff2;border:1px solid #48e6ae88;box-shadow:0 0 22px #31d99b20;border-radius:12px}.diag__toggle{padding:10px 14px;color:#8affca}.diag__panel{width:min(92vw,520px);height:min(65vh,560px);margin-top:8px;padding:12px;display:flex;flex-direction:column}.diag__header{display:flex;justify-content:space-between;gap:10px}.diag button,.diag select{color:inherit;background:#12271f;border:1px solid #48e6ae66;border-radius:6px;padding:5px}.diag__filter{display:flex;justify-content:space-between;margin:10px 0}.diag__logs{overflow:auto;min-height:0}.diag__entry{padding:8px 0;border-bottom:1px solid #48e6ae22;overflow-wrap:anywhere}.diag__entry small{display:block;opacity:.7}.diag__entry pre{white-space:pre-wrap;max-height:120px;overflow:auto;color:#a6c9bd}.level-error{color:#ff8d9a}.level-warn{color:#ffd98c}
</style>

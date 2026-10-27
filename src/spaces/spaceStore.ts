import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { WidgetSpec } from '../core/types';

export interface VirtualSpace {
  id: string;
  name: string;
  widgets: WidgetSpec[];
  updatedAt: number;
}

const makeSpace = (id: string, name: string): VirtualSpace => ({
  id, name, widgets: [], updatedAt: Date.now(),
});

export const useSpaceStore = defineStore('omnios-spaces', () => {
  const spaces = ref<Record<string, VirtualSpace>>({
    menu: makeSpace('menu', 'Menú'),
    agent: makeSpace('agent', 'Agente'),
    console: makeSpace('console', 'Consola'),
    files: makeSpace('files', 'Archivos'),
  });
  const activeSpaceId = ref('menu');
  const activeSpace = computed(() => spaces.value[activeSpaceId.value] ?? null);

  function ensureSpace(id: string, name = id): VirtualSpace {
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(id)) throw new Error('Invalid space id');
    if (!spaces.value[id]) spaces.value[id] = makeSpace(id, name);
    return spaces.value[id];
  }

  function activateSpace(id: string) {
    if (!spaces.value[id]) throw new Error(`Unknown space: ${id}`);
    activeSpaceId.value = id;
  }

  function upsertWidget(spaceId: string, widget: WidgetSpec) {
    const space = spaces.value[spaceId];
    if (!space) throw new Error(`Unknown space: ${spaceId}`);
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(widget.id)) throw new Error('Invalid widget id');
    if (!['text', 'metric', 'action', 'code', 'status'].includes(widget.kind)) throw new Error('Unsupported widget kind');
    const index = space.widgets.findIndex(item => item.id === widget.id);
    const safeWidget = structuredClone(widget);
    if (index < 0) space.widgets.push(safeWidget);
    else space.widgets[index] = safeWidget;
    space.updatedAt = Date.now();
  }

  function removeWidget(spaceId: string, widgetId: string) {
    const space = spaces.value[spaceId];
    if (!space) return;
    space.widgets = space.widgets.filter(widget => widget.id !== widgetId);
    space.updatedAt = Date.now();
  }

  function clearSpace(spaceId: string) {
    const space = spaces.value[spaceId];
    if (!space) return;
    space.widgets = [];
    space.updatedAt = Date.now();
  }

  return { spaces, activeSpaceId, activeSpace, ensureSpace, activateSpace, upsertWidget, removeWidget, clearSpace };
});

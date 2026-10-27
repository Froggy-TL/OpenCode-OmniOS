<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import type { MaterializationRequest } from '../types/omnios';
import { resolveAnimation } from '../visual/animationRegistry';

const props = defineProps<{
  request: MaterializationRequest | null;
}>();
const emit = defineEmits<{
  finished: [id: string];
}>();

const visible = ref(false);
let timeoutId: ReturnType<typeof setTimeout> | undefined;

const animationClass = computed(() =>
  props.request ? resolveAnimation(props.request.preset).className : '',
);

watch(() => props.request?.id, () => {
  if (timeoutId) clearTimeout(timeoutId);
  visible.value = Boolean(props.request);
  if (!props.request) return;

  const preset = resolveAnimation(props.request.preset);
  const duration = Math.max(0, Math.min(props.request.durationMs ?? preset.defaultDurationMs, 3000));
  if (duration === 0) {
    const id = props.request.id;
    visible.value = false;
    emit('finished', id);
    return;
  }
  timeoutId = setTimeout(() => {
    const id = props.request?.id;
    visible.value = false;
    if (id) emit('finished', id);
  }, duration);
});

onBeforeUnmount(() => {
  if (timeoutId) clearTimeout(timeoutId);
});
</script>

<template>
  <Transition name="omni-portal-fallback">
    <div
      v-if="visible && request"
      class="materialization-overlay"
      aria-live="polite"
      aria-atomic="true"
      :data-anchor="request.anchor"
    >
      <div class="materialization-card omni-glass" :class="animationClass">
        <span class="energy-orb" aria-hidden="true"></span>
        <div class="materialization-copy">
          <strong>{{ request.label }}</strong>
          <small>Materializando interfaz…</small>
        </div>
        <span class="energy-track" aria-hidden="true"><i></i></span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.materialization-overlay {
  position: fixed;
  z-index: 9000;
  right: 16px;
  bottom: 18px;
  width: min(340px, calc(100vw - 32px));
  pointer-events: none;
}
.materialization-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 15px;
  color: var(--omni-text, #f4f4ff);
  border-color: #bda0ff88;
}
.energy-orb {
  width: 14px; height: 14px; flex: 0 0 auto; border-radius: 50%;
  background: radial-gradient(circle at 30% 25%, white, #69e1ff 35%, #a66aff 75%);
  box-shadow: 0 0 18px #a66aff, 0 0 32px #69e1ff55;
  animation: orb-breathe 1s ease-in-out infinite alternate;
}
.materialization-copy { display: grid; gap: 4px; }
.materialization-copy strong { font-size: 13px; }
.materialization-copy small { color: var(--omni-muted, #a9b4df); font-size: 11px; }
.energy-track { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; overflow: hidden; }
.energy-track i {
  display: block; width: 35%; height: 100%;
  background: linear-gradient(90deg, #ff95e7, #69e1ff);
  box-shadow: 0 0 12px #69e1ff;
  animation: energy-travel 1s ease-in-out infinite;
}
.omni-portal-fallback-enter-active, .omni-portal-fallback-leave-active { transition: opacity .18s ease, transform .18s ease; }
.omni-portal-fallback-enter-from, .omni-portal-fallback-leave-to { opacity: 0; transform: translateY(8px); }
@keyframes orb-breathe { to { transform: scale(1.18); filter: hue-rotate(25deg); } }
@keyframes energy-travel { from { transform: translateX(-110%); } to { transform: translateX(310%); } }
@media (prefers-reduced-motion: reduce) {
  .energy-orb, .energy-track i { animation: none; }
}
</style>

import { onBeforeUnmount, ref } from 'vue';
import type { ServerHealth, ServerTarget } from '../types/omnios';

export type HealthAdapter = (target: ServerTarget, signal: AbortSignal) => Promise<void>;

export function useServerHealth(adapter: HealthAdapter, intervalMs = 15_000, timeoutMs = 4_000) {
  const health = ref<ServerHealth>({
    state: 'unknown', checkedAt: null, latencyMs: null,
  });
  const running = ref(false);
  let intervalId: ReturnType<typeof setInterval> | undefined;
  let controller: AbortController | undefined;

  async function check(target: ServerTarget) {
    controller?.abort();
    controller = new AbortController();
    const localController = controller;
    const started = performance.now();
    health.value = { ...health.value, state: 'checking', message: undefined };

    const timeout = setTimeout(() => localController.abort(), timeoutMs);
    try {
      await adapter(target, localController.signal);
      if (controller !== localController) return;
      health.value = {
        state: 'online',
        checkedAt: Date.now(),
        latencyMs: Math.round(performance.now() - started),
      };
    } catch (error) {
      if (controller !== localController) return;
      const timedOut = localController.signal.aborted;
      health.value = {
        state: 'offline',
        checkedAt: Date.now(),
        latencyMs: null,
        message: timedOut ? 'Tiempo de espera agotado' :
          (error instanceof Error ? error.message : 'No se pudo comprobar el servidor'),
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  function start(target: ServerTarget) {
    stop();
    running.value = true;
    void check(target);
    intervalId = setInterval(() => {
      if (running.value) void check(target);
    }, Math.max(3_000, intervalMs));
  }

  function stop() {
    running.value = false;
    if (intervalId) clearInterval(intervalId);
    intervalId = undefined;
    controller?.abort();
    controller = undefined;
  }

  onBeforeUnmount(stop);
  return { health, running, check, start, stop };
}

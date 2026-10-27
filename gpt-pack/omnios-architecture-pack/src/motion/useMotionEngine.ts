import { onMounted, onUnmounted } from 'vue';

export interface MotionOptions { tilt?: boolean; maxTilt?: number }
export function useMotionEngine(root: () => HTMLElement | null, options: MotionOptions = {}) {
  let removePointer: (() => void) | undefined;
  let removeOrientation: (() => void) | undefined;
  let media: MediaQueryList | undefined;
  const reduced = () => media?.matches ?? false;

  onMounted(() => {
    const element = root();
    if (!element) return;
    media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = (event: PointerEvent) => {
      if (reduced()) return;
      const rect = element.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
      element.style.setProperty('--pointer-x', String(x));
      element.style.setProperty('--pointer-y', String(y));
    };
    element.addEventListener('pointermove', pointer, { passive: true });
    removePointer = () => element.removeEventListener('pointermove', pointer);

    if (options.tilt && 'DeviceOrientationEvent' in window) {
      const orientation = (event: DeviceOrientationEvent) => {
        if (reduced()) return;
        const max = options.maxTilt ?? 8;
        element.style.setProperty('--tilt-x', `${Math.max(-max, Math.min(max, (event.beta ?? 0) / 6))}deg`);
        element.style.setProperty('--tilt-y', `${Math.max(-max, Math.min(max, (event.gamma ?? 0) / 6))}deg`);
      };
      // Device orientation permission, when required by the platform, must be requested by an explicit user gesture in the host.
      window.addEventListener('deviceorientation', orientation, { passive: true });
      removeOrientation = () => window.removeEventListener('deviceorientation', orientation);
    }
  });
  onUnmounted(() => { removePointer?.(); removeOrientation?.(); });
}

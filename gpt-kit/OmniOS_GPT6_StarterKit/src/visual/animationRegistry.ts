import type { MotionPreset } from '../types/omnios';

export interface AnimationDefinition {
  className: string;
  defaultDurationMs: number;
  description: string;
}

/**
 * Only app-authored presets are accepted. AI output should select a preset,
 * not inject arbitrary CSS text into the live DOM.
 */
export const animationRegistry: Record<MotionPreset, AnimationDefinition> = {
  portal: {
    className: 'omni-motion-portal',
    defaultDurationMs: 650,
    description: 'Revela un componente con brillo dimensional.',
  },
  'fade-up': {
    className: 'omni-motion-fade-up',
    defaultDurationMs: 480,
    description: 'Entrada breve desde abajo.',
  },
  'glass-sweep': {
    className: 'omni-motion-glass-sweep',
    defaultDurationMs: 850,
    description: 'Reflejo luminoso sobre cristal.',
  },
  'soft-pulse': {
    className: 'omni-motion-soft-pulse',
    defaultDurationMs: 900,
    description: 'Pulso suave para destacar un estado.',
  },
  none: {
    className: '',
    defaultDurationMs: 0,
    description: 'Sin animación.',
  },
};

export function resolveAnimation(preset: MotionPreset) {
  return animationRegistry[preset] ?? animationRegistry.none;
}

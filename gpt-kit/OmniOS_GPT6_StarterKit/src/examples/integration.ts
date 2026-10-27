import { applyTheme } from '../visual/themeEngine';
import { runSafeAction, type ActionAdapter } from '../security/safeActionRunner';
import type { MaterializationRequest } from '../types/omnios';

// En una app Vue, conserva la solicitud en un ref y pásala al portal.
export const demoMaterialization: MaterializationRequest = {
  id: 'agent-card-created-001',
  label: 'Nueva tarjeta de agente',
  preset: 'portal',
  durationMs: 850,
};

// Conecta estas funciones con Vue Router, tu sistema de notificaciones y ThemeEngine.
export const actionAdapter: ActionAdapter = {
  navigate: (route) => {
    // TODO: sustituir por router.push(route).
    console.info('[OmniOS] navegación solicitada:', route);
  },
  notify: (message) => {
    // TODO: sustituir por el componente toast real.
    console.info('[OmniOS] notificación:', message);
  },
  setTheme: (themeId) => {
    if (!applyTheme(themeId)) throw new Error(`Tema desconocido: ${themeId}`);
  },
};

export async function runExample() {
  return runSafeAction({ type: 'set-theme', themeId: 'arctic' }, actionAdapter);
}

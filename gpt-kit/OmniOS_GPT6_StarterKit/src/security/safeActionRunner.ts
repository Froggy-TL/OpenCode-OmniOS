import type { ActionResult, DeclarativeAction } from '../types/omnios';

export interface ActionAdapter {
  navigate(route: string): Promise<void> | void;
  notify(message: string): Promise<void> | void;
  setTheme(themeId: string): Promise<void> | void;
}

const ALLOWED_ROUTES = new Set(['/home', '/agents', '/servers', '/settings', '/console']);
const ALLOWED_THEMES = new Set(['portal', 'arctic', 'ember']);

function safeText(value: string, maxLength = 240) {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, maxLength);
}

/**
 * Accepts only a small declarative action vocabulary. Never eval() AI-generated
 * source code here. Sensitive actions should use a separate, audited workflow.
 */
export async function runSafeAction(
  action: DeclarativeAction,
  adapter: ActionAdapter,
): Promise<ActionResult> {
  try {
    switch (action.type) {
      case 'navigate': {
        if (!ALLOWED_ROUTES.has(action.route)) return { ok: false, message: 'Ruta no permitida.' };
        await adapter.navigate(action.route);
        return { ok: true, message: 'Navegación completada.' };
      }
      case 'notify': {
        const message = safeText(action.message);
        if (!message.trim()) return { ok: false, message: 'El mensaje está vacío.' };
        await adapter.notify(message);
        return { ok: true, message: 'Notificación mostrada.' };
      }
      case 'set-theme': {
        if (!ALLOWED_THEMES.has(action.themeId)) return { ok: false, message: 'Tema no registrado.' };
        await adapter.setTheme(action.themeId);
        return { ok: true, message: 'Tema aplicado.' };
      }
      default:
        return { ok: false, message: 'Tipo de acción desconocido.' };
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'La acción falló.',
    };
  }
}

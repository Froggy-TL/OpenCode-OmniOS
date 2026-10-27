import type { App } from 'vue';
import { useDiagnosticStore } from './diagnosticStore';

export function installDiagnostics(app: App) {
  app.config.errorHandler = (error, instance, info) => {
    const store = useDiagnosticStore();
    store.log('error', 'vue', error instanceof Error ? error.message : String(error), `${info}; component=${instance?.$options.name ?? 'anonymous'}; ${error instanceof Error ? error.stack ?? '' : ''}`);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('error', event => {
      useDiagnosticStore().log('error', 'window', event.message || 'Window error', `${event.filename}:${event.lineno}:${event.colno}`);
    });
    window.addEventListener('unhandledrejection', event => {
      const reason = event.reason;
      useDiagnosticStore().log('error', 'promise', 'Unhandled promise rejection', reason instanceof Error ? reason.stack ?? reason.message : String(reason));
    });
  }
}

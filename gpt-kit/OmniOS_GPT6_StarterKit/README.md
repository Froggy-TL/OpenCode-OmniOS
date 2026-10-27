# OmniOS GPT-6 Starter Kit

Un conjunto inicial de módulos para integrar en un cliente Vue 3 + TypeScript. No presupone una API concreta del servidor: los adaptadores de red están separados para conectarlos a la implementación real de OpenCode/OmniOS.

## Incluye

- `src/visual/`: registro de animaciones, temas y materialización visual.
- `src/components/MaterializationPortal.vue`: portal visual no bloqueante.
- `src/composables/useServerHealth.ts`: sondeo de salud con timeout, pausa y limpieza.
- `src/security/capabilities.ts`: registro de capacidades y permisos explícitos.
- `src/security/safeActionRunner.ts`: ejecución de acciones declarativas mediante allowlist.
- `src/types/omnios.ts`: tipos compartidos.
- `src/examples/`: ejemplos de integración.
- `docs/`: decisiones de arquitectura, pruebas manuales y lista de integración.

## Requisitos

- Vue 3
- TypeScript
- Un bundler compatible con Vue SFC (por ejemplo, Vite)
- Opcional: Vitest para pruebas

## Instalación

Copia los directorios `src/` a tu proyecto y adapta los imports a tu estructura. El código no necesita una dependencia de animación externa.

## Importante

Este kit no se conecta automáticamente a tu servidor, no ejecuta código arbitrario y no modifica el teléfono. Es una base integrable: conecta `healthAdapter`, `ActionAdapter` y el registro de capacidades a las APIs y permisos reales de tu app. No confíes en que `127.0.0.1` siempre represente el mismo host dentro de Android; depende de dónde se ejecute el servidor.

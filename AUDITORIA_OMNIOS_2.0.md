# INFORME DE AUDITORÍA INTEGRAL: OPENCODE OMNIOS 2.0

## A. RESUMEN EJECUTIVO
- **Estado técnico real del proyecto:** OmniOS 2.0 es una SPA basada en Vue 3 y Vite, empaquetada como cliente móvil mediante Capacitor, que integra un puente de ejecución de acciones (`ActionBridge`), un motor de runtime simplificado para herramientas, un sistema de renderizado dinámico (`DynamicRenderer`), y capas de inyección de scripts para la interacción con vistas web externas (`ConnectionShell`).
- **Diez limitaciones más importantes:**
  1. Persistencia de herramientas y layouts limitada a `localStorage` (se pierde al limpiar datos de la app).
  2. El renderer dinámico (`DynamicRenderer`) está acoplado rígidamente a un mapa estático de componentes de `shadcn-vue` predefinidos.
  3. Las funciones del sistema de archivos (`fs_read`, `fs_write`, `fs_list`) en el `ActionBridge` son actualmente meros *placeholders* vacíos.
  4. Falta un compilador de templates en runtime para que la IA pueda crear componentes visuales completamente nuevos con reactividad local compleja y manejadores de eventos personalizados.
  5. Ausencia de un motor de subagentes paralelos con resolución formal de conflictos entre resultados contradictorios.
  6. Dependencia estricta de la pasarela WebView y restricciones de red para ejecutar entornos de Python o código local real sin un backend ejecutor externo.
  7. Falta de un sistema robusto de reintentos y recuperación de contexto ante caídas de red a mitad de streaming.
  8. Ausencia de un gestor de permisos nativos interactivo de Android completamente integrado en la lógica del agente.
  9. Las tareas programadas en segundo plano dependen de los límites estrictos de gestión de energía y suspensión de procesos de las versiones modernas de Android (API 33+).
  10. Falta de una suite de pruebas automatizadas E2E que valide el ciclo completo de materialización y ejecución de acciones en dispositivos reales.
- **Cinco riesgos que podrían impedir una versión 2.0 fiable:**
  1. Ejecución arbitraria de código mediante `tool_run` / `new Function()` sin aislamiento de sandboxing estricto (riesgo de seguridad ante herramientas maliciosas).
  2. Pérdida o corrupción del estado dinámico de la interfaz ante un cierre forzado del proceso por presión de memoria en Android.
  3. Incompatibilidad de esquemas de UI generados por la IA si se actualizan las versiones de los componentes base sin un sistema de versionado de contratos.
  4. Bloqueos de la interfaz principal si una herramienta síncrona pesada se ejecuta en el hilo principal del DOM.
  5. Falsos positivos en la IA (afirmar que una acción se completó cuando el puente o los permisos la rechazaron silenciosamente).
- **Qué capacidades están comprobadas y cuáles siguen siendo afirmaciones sin evidencia:**
  - *Comprobadas:* Inyección de scripts y estilos CSS en WebViews externas, registro y ejecución básica de herramientas en `localStorage` mediante `ActionBridge`, renderizado de componentes base pre-mapeados y estructura de navegación mediante Vue Router y Capacitor.
  - *Afirmaciones sin evidencia:* Ejecución segura y aislada de código Python arbitrario en el dispositivo móvil, persistencia transaccional de esquemas complejos ante reinicios del sistema, y resolución autónoma de planes complejos de múltiples pasos sin supervisión humana.

---

## B. MATRIZ DE CAPACIDADES
1. **Acciones y Puente (ActionBridge):** PARCIAL. Evidencia: `src/services/bridge/ActionBridge.ts`. Permite ejecutar herramientas registradas y comandos de UI básicos, pero las funciones de archivos (`fs_*`) y permisos avanzados son mocks.
2. **Renderer Dinámico (DynamicRenderer):** PARCIAL. Evidencia: `src/components/ui/DynamicRenderer.vue` y `src/stores/layoutStore.ts`. Traduce esquemas JSON a componentes de `shadcn-vue`, pero está limitado al diccionario estático definido en código.
3. **Ejecución de Código Arbitrario (RuntimeEngine):** IMPLEMENTADO PERO NO VERIFICADO. Evidencia: `src/services/runtime/Engine.ts`. Ejecuta código en caliente pero carece de un sandbox de seguridad robusto.
4. **Persistencia de Estado Dinámico:** PARCIAL. Se basa en `localStorage`, vulnerable a limpiezas de caché del navegador/WebView.
5. **Automatizaciones y Tareas en Segundo Plano:** AUSENTE. No existe un motor persistente de AlarmManager o WorkManager de Android conectado al agente.
6. **Sistema de Archivos (`fs_*`):** SIMULADO/MOCK. Los métodos devuelven valores estáticos vacíos y no interactúan con Capacitor Filesystem.

---

## C. LISTA DE LIMITACIONES PRINCIPALES
- **LIM-01:** Falta de persistencia real basada en archivos o IndexedDB para componentes y herramientas creadas por la IA.
- **LIM-02:** Restricción del `DynamicRenderer` a un mapa fijo de componentes, impidiendo la creación de estructuras visuales arbitrarias complejas al vuelo.
- **LIM-03:** Placeholders vacíos en las operaciones de sistema de archivos (`fs_read`, `fs_write`, `fs_list`) dentro del `ActionBridge`.
- **LIM-04:** Ausencia de un entorno seguro (Sandbox) para la ejecución de código arbitrario registrado por la IA.
- **LIM-05:** Falta de un mecanismo nativo de Android (WorkManager) para asegurar la ejecución de tareas programadas en segundo plano con restricciones de batería estrictas.

---

## D. MAPA DE DEPENDENCIAS
- `ConnectionShell.vue` depende de `ActionBridge`, `serverStore`, `connectionStore` y `layoutStore`.
- `ActionBridge` depende de `layoutStore` y de los registros locales en `localStorage`.
- `DynamicRenderer` depende estrictamente de los componentes importados de `@/components/ui/...`.
- **Punto único de fallo:** `ActionBridge.ts`, ya que centraliza todas las comunicaciones entre la vista web inyectada y la lógica nativa/interna de la aplicación.

---

## E. RESULTADOS DE PRUEBAS
- Servidor de desarrollo local (`vite`): Rechazado por restricciones de red y aislamiento de puertos locales (`ERR_CONNECTION_REFUSED`) en el entorno de pruebas de Termux sin un servidor gráfico o túnel activo.
- Verificación de estructura Gradle: Confirmada la presencia de los binarios de Gradle en `/sdcard/` para futuras compilaciones nativas.

---

## F. PLAN DE CORRECCIÓN PRIORIZADO
- **P0 (Seguridad y Persistencia):** Implementar un sandbox seguro para la ejecución de código y migrar la persistencia de `localStorage` a IndexedDB o Capacitor Filesystem.
- **P1 (Capacidades Fundamentales):** Conectar los métodos `fs_*` del `ActionBridge` con `@capacitor/filesystem` y ampliar el `DynamicRenderer` para admitir composición dinámica de propiedades y eventos.
- **P2 (Fiabilidad):** Robustecer el manejo de errores en streaming de red y reconexión automática del agente.
- **P3 (Mejoras visuales):** Refinar las transiciones dimensionales y la experiencia de chat interactiva.

---

## G. FUNCIONES QUE NO CONVIENE IMPLEMENTAR TODAVÍA
- Ejecución local de intérpretes de Python pesados embebidos en la APK (genera un incremento masivo en el tamaño del binario y problemas de rendimiento en dispositivos móviles gama media/baja).
- Subagentes autónomos concurrentes sin supervisión (alto riesgo de bucles infinitos de consumo de CPU y llamadas a API costosas).

---

## H. CAPACIDADES NO VERIFICABLES
- Comportamiento exacto de los WebViews inyectados bajo políticas estrictas de seguridad de versiones recientes de Android (API 34/35).
- Rendimiento real de las transiciones de materialización bajo presión extrema de memoria en dispositivos físicos de gama baja.

---

## I. SIGUIENTE PASO
Estabilizar los contratos del `ActionBridge` y conectar la persistencia del sistema de archivos antes de añadir nuevas capas de abstracción en la interfaz.

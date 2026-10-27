# Arquitectura sugerida

## 1. Separar intención, validación y ejecución

Flujo recomendado:

1. El modelo propone una acción declarativa.
2. El validador comprueba el esquema, el permiso y los límites.
3. La UI muestra una confirmación cuando corresponde.
4. Un adaptador de app ejecuta la acción.
5. Se registra el resultado, duración y error sin guardar secretos.

No permitas que el modelo entregue una cadena JavaScript que se ejecute directamente en la app principal.

## 2. Catálogo de capacidades

Cada capacidad debe tener:
- ID estable y descripción legible.
- Disponibilidad detectada por adaptadores reales.
- Riesgo (lectura, escritura o sensible).
- Requisitos de confirmación.
- Estado concedido/revocado.
- Resultado de ejecución y motivo de fallo.

La disponibilidad no equivale a permiso. Que el dispositivo tenga una API no significa que la IA pueda usarla sin consentimiento.

## 3. Materialización visual

La solicitud debe contener un ID, etiqueta, preset registrado y duración limitada. El portal es `pointer-events: none`, así que no bloquea la interacción. Para colocarlo junto a un componente real, calcula la posición desde un elemento registrado por la app, no desde selectores arbitrarios generados por el modelo.

## 4. Servidores

La URL del servidor debe venir de la configuración del usuario. No supongas que localhost apunta siempre al mismo proceso, especialmente en Android. Separa:
- conexión TCP/HTTP;
- autenticación;
- endpoint de salud;
- compatibilidad de versión;
- capacidades anunciadas por el servidor.

No guardes tokens en logs ni los incluyas en mensajes de error.

## 5. Fallos y recuperación

- Timeout con AbortController.
- Cancelación de peticiones anteriores.
- Reintentos limitados con espera incremental.
- Botón de detener para tareas largas.
- Estado visible: pendiente, ejecutando, requiere aprobación, completado, fallido, cancelado.
- No reintentar automáticamente acciones no idempotentes, como borrar o enviar datos.

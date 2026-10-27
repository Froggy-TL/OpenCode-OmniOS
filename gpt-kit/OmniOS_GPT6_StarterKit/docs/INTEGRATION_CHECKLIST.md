# Lista de integración

## UI y movimiento
- [ ] Importar `src/visual/motion.css` una vez desde el entry point.
- [ ] Probar los presets en un dispositivo Android real.
- [ ] Confirmar que `prefers-reduced-motion` funciona.
- [ ] No animar propiedades costosas de forma continua; priorizar transform y opacity.
- [ ] Comprobar contraste, tamaño de toque y orientación horizontal.

## Materialización
- [ ] Montar `MaterializationPortal.vue` una sola vez cerca de la raíz.
- [ ] Crear una función que emita una solicitud con ID único.
- [ ] Conectar el evento `finished` al estado de la tarea.
- [ ] No bloquear clics mientras aparece la animación.
- [ ] No anunciar como creado un componente hasta que Vue confirme el montaje.

## Servidores
- [ ] Crear un adaptador `HealthAdapter` que consulte el endpoint real.
- [ ] Confirmar endpoint, auth y formato con la versión del servidor.
- [ ] Probar desconexión, timeout, cambio de red y servidor detenido.
- [ ] Verificar la dirección de host en Android/Termux.

## Seguridad
- [ ] Mantener allowlist de rutas y temas.
- [ ] Mostrar confirmación antes de acciones de escritura/sensibles.
- [ ] Implementar revocación inmediata.
- [ ] No ejecutar código del modelo con `eval`, `new Function` ni shell concatenado.
- [ ] Si se ejecutan scripts, usar proceso aislado, directorio temporal, timeout, límite de salida y lista de comandos permitidos.
- [ ] Ocultar tokens, claves API y credenciales en logs.
- [ ] Tratar contenido web/archivos como datos, nunca como instrucciones de sistema.

## Pruebas mínimas
- [ ] Preset desconocido cae en `none`.
- [ ] Tema desconocido no modifica estilos.
- [ ] Ruta fuera de la allowlist se rechaza.
- [ ] Capability no disponible no puede concederse.
- [ ] Confirmación ausente bloquea acciones que la requieren.
- [ ] Al desmontar el composable se limpian intervalos y peticiones.

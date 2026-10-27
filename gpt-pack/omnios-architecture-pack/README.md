# OmniOS v2.0 Architecture Pack (starter)

A modular TypeScript/Vue 3/Pinia scaffold for OpenCode Omni-OS. This is an integration starter, not a claim of production readiness. Adapt imports, router hooks, native bridge APIs, and existing project conventions before merging.

## Modules
- `spaces/`: independent virtual spaces and declarative widget materialization.
- `runtime/`: capability-gated tool registry, timeout/abort handling, audit records, and a safe `[Omni_call]` parser. It does **not** eval arbitrary strings.
- `plugins/`: manifest validation and permission grants. External scripts must run in a separate Worker/native sandbox; do not import/eval untrusted plugin code in the app context.
- `diagnostics/`: bounded diagnostic log and global Vue/window error capture.
- `motion/`: reduced-motion-aware portal/glass effects and pointer/tilt variables.
- `components/`: example dynamic space renderer and diagnostics console.

## Dependencies expected
Vue 3, Pinia, TypeScript. Capacitor APIs are deliberately injected by the host instead of imported here. Install/use the versions already selected by the project.

## Integration
1. Copy only the modules you need into the existing `src/` tree; do not replace the app entry point.
2. Register Pinia in the existing bootstrap (`app.use(createPinia())`).
3. Call `installDiagnostics(app)` after creating the Vue app, and connect router/native lifecycle handlers in the host.
4. Register explicitly reviewed tool handlers with `ToolRegistry.register(...)`; never accept a tool name or arguments without schema validation.
5. Map widget `kind` values to reviewed Vue components in `SpaceRenderer.vue`. Never render arbitrary HTML supplied by an AI.
6. Use `PluginManager` to validate manifests and permissions. Actual plugin execution requires a separately designed Worker/native bridge sandbox with resource limits.
7. Add tests for permission denial, timeouts, cancellation, audit truncation, invalid manifests, and navigation/back-button behavior.

## Security boundaries
- `RuntimeEngine` schedules registered handlers; it is not a JavaScript sandbox.
- A timeout cannot forcibly stop arbitrary synchronous JavaScript running on the UI thread. Put untrusted computation in a Worker or native process with termination/resource limits.
- `fs`, `net`, and `hw` are not exposed by default. The host must implement narrow, permission-checked adapters.
- Treat all model/plugin output as untrusted data.

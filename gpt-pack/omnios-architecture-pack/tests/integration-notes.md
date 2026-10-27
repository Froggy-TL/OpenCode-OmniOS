# Required tests before production

- `RuntimeEngine`: unknown tool, invalid schema, denied permission, duplicate call id, success, timeout, cancellation, bounded audit retention.
- Tool handlers: cancellation must be cooperative; native adapters must re-check permission at point of use.
- `PluginManager`: invalid IDs, path traversal, unsupported permissions, duplicate registration, denied grants.
- Spaces: invalid IDs, unknown space, widget upsert/remove, payload size limits and deep-clone behavior.
- Diagnostics: bounded log, redaction of tokens/secrets, error storm behavior.
- Android navigation: test system back, Capacitor back-button listener ordering, rapid route changes, app resume, dark-mode/status-bar backgrounds, reduced-motion preference.
- Native security: validate plugin signature/source, isolate execution, cap CPU/memory/output, terminate runaway workers, and audit all bridge calls.

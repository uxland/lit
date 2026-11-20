---
'@uxland/lit-utilities': major
---

Lit 3 support and cleanup.

- `lit` is now a peer dependency (`^3.0.0`) instead of a dependency, so the app's own Lit is used and no second copy is installed.
- The package no longer imports Lit at runtime.
- `propertiesObserver` now honours the `hasChanged` declared on each reactive property (it used to read a Lit 1 private field and always fall back to strict inequality) and forwards every `requestUpdate` argument to Lit.
- `dedupeMixin` delegates to `@uxland/utilities`, so all uxland mixins share the same registry.
- ESM only, published from `dist/`. Deep imports keep working through the `exports` map.
- Removed the `ramda` dependency.

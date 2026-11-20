---
'@uxland/regions': major
---

Lit 3 support, dynamic regions and lifecycle fixes.

**Breaking**

- `lit` is now a peer dependency (`^3.0.0`) instead of a dependency.
- `regionsCreated(regions)` is called only when a refresh actually created regions, after they exist, with the created `IRegion` objects. It used to be called after every update with the region definitions, before the regions were guaranteed to exist.
- ESM only, published from `dist/`. Deep imports keep working through the `exports` map.

**New**

- `regionDefinitions` getter on region hosts: override it to declare regions per instance instead of with `@region`.
- `refreshRegions()` on region hosts: re-synchronise regions after the definitions change (`create()` is kept as a deprecated alias).
- Regions are looked up in the host's `renderRoot`, so hosts that render in light DOM work without overriding `shadowRoot`.
- `findRegionTarget` and `getDeclaredRegions` helpers.
- `multipleActiveAdapterFactory` export (`multipleActiveAdapterFaactory` is kept as a deprecated alias).

**Fixes**

- Region creation waits for `updateComplete` (it awaited a private Lit field that no longer exists).
- Regions whose target disappears now detach their behaviors (`detach` was never called).
- `AdapterBase.behaviors` returns the same instances on every access, so behaviors are detached on the instances that were attached.
- Removed the `ramda` dependency.

# @uxland/regions

Regions for [Lit](https://lit.dev) applications: named placeholders in a host component where
other modules (plugins) inject their views without knowing about the host.

```bash
npm i @uxland/regions lit
```

`lit` (`^3.0.0`) is a peer dependency.

## Declaring regions with `@region`

```ts
import {LitElement, html} from 'lit';
import {regionHost, region, type IRegion} from '@uxland/regions';

class AppShell extends regionHost(LitElement) {
  @region({name: 'main', targetId: 'main-content'})
  main: IRegion;

  render() {
    return html`<div id="main-content"></div>`;
  }
}
```

After every update the host creates the regions whose target element exists and removes the ones
whose target is gone. `regionsCreated(regions)` is called after a refresh that created regions,
with the regions just created.

## Registering views

```ts
import {regionManager} from '@uxland/regions';

regionManager.registerViewWithRegion('main', 'home', {htmlTag: 'home-view'});
```

Views can also be added directly with `region.addView(key, view)`. Use `regionView(LitElement)` in
view components to receive `active`, `regionContext` and their `activeChanged` /
`regionContextChanged` callbacks.

## Per-instance regions

Override `regionDefinitions` when the regions depend on the instance (for example on an
attribute), and call `refreshRegions()` when they change:

```ts
class DynamicRegion extends regionHost(LitElement) {
  @property() name = '';

  // Light DOM works: regions are looked up in the render root.
  createRenderRoot() {
    return this;
  }

  get regionDefinitions() {
    return this.name ? {region: {name: this.name, targetId: `${this.name}-container`}} : {};
  }

  render() {
    return this.name ? html`<div id=${`${this.name}-container`}></div>` : html``;
  }
}
```

## Adapters

How views are shown in the target depends on the adapter: `multipleActiveAdapterFactory` (default,
all views visible), `singleActiveAdapterFactory` and `selectableAdapterFactory`. Register one per
target with `regionAdapterRegistry`, or pass `adapterFactory` in the region definition.

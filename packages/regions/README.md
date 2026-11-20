# @uxland/regions

Regions for [Lit](https://lit.dev) applications. A region is a named placeholder inside a host
component; other modules (plugins, features) put their views into it by name, without importing
or knowing about the host.

- [Installation](#installation)
- [Quick start](#quick-start)
- [Region hosts](#region-hosts)
- [Views](#views)
- [Working with a region](#working-with-a-region)
- [Adapters](#adapters)
- [Region managers](#region-managers)
- [Migrating from 1.x](#migrating-from-1x)

## Installation

```bash
npm i @uxland/regions lit
```

`lit` `^3.0.0` is a peer dependency. The package is ESM only.

The `@region` decorator is a TypeScript *experimental* decorator, like Lit's own decorators in
that mode. Enable it in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "useDefineForClassFields": false
  }
}
```

## Quick start

```ts
import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {region, regionHost, regionManager, regionView, type IRegion} from '@uxland/regions';

// 1. A host declares where the region lives.
@customElement('app-shell')
class AppShell extends regionHost(LitElement) {
  @region({name: 'main', targetId: 'main-content'})
  main: IRegion;

  render() {
    return html`<main id="main-content"></main>`;
  }
}

// 2. A view is any element. regionView adds the region lifecycle properties.
@customElement('home-view')
class HomeView extends regionView(LitElement) {
  activeChanged(active: boolean) {
    if (active) console.log('home is visible');
  }
  render() {
    return html`<h1>Home</h1>`;
  }
}

// 3. Anyone registers views by region name, before or after the host exists.
regionManager.registerViewWithRegion('main', 'home', {htmlTag: 'home-view'});
```

When `<app-shell>` renders, it creates the `main` region in `#main-content`, stores it in
`this.main` and adds every view registered for `main`.

## Region hosts

`regionHost(LitElement)` turns a component into a region host. After every update it synchronises
its regions:

- a region whose target element exists and is not created yet is created, stored in its property
  and populated with the views registered for its name;
- a region whose target element is no longer rendered is removed.

The target is looked up by id in the host's render root, so it works both with a shadow root and
with hosts that render in light DOM (`createRenderRoot() { return this; }`).

### Region definition

| Option | Description |
|---|---|
| `name` | Region name. Views are registered against it. Must be unique in its region manager. |
| `targetId` | Id of the element, inside the host, where the views are rendered. |
| `scoped` | Creates a child region manager for this region, so nested regions with common names don't clash. |
| `adapterFactory` | Adapter for this region, overriding the [adapter registry](#adapters). |
| `options` | Free-form options, available to adapters as `definition.options`. |

### Per-instance regions

`@region` declares regions for every instance of a class. When they depend on the instance (for
example on an attribute), override `regionDefinitions` instead. The keys are the properties that
will hold each region:

```ts
@customElement('dynamic-region')
class DynamicRegion extends regionHost(LitElement) {
  @property() name = '';
  region: IRegion | undefined;

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

Regions are synchronised after every update. If the definitions or the target change outside an
update, call `refreshRegions()`.

### Lifecycle

- `regionsCreated(regions: IRegion[])` is called after a synchronisation that created at least one
  region, once the regions exist and their views have been added. Override it to configure them,
  for example to set `region.context`.
- On `disconnectedCallback` the host removes its regions from the region manager and detaches
  their behaviors.

## Views

A view definition tells the region how to obtain the view element. Exactly one of `htmlTag`,
`factory` or `element` is required.

| Property | Description |
|---|---|
| `htmlTag` | Tag name to create. With `htmlUrl`, that module is imported first. |
| `factory` | `() => Promise<HTMLElement>`. |
| `element` | An existing element. |
| `isDefault` | With single-active adapters, the view activated when no other view is active. |
| `sortHint` | With the multiple-active adapter, views are ordered by this string. |
| `removeFromDomWhenDeactivated` | Remove the element when deactivated instead of hiding it. |
| `options` | Free-form options for the view. |

Every view element receives `view` (its definition), `viewKey`, `region`, `active` and
`regionContext`. `regionView(LitElement)` declares `active` and `regionContext` as reactive
properties and calls `activeChanged(current, previous)` and `regionContextChanged(current,
previous)` when they change.

## Working with a region

```ts
await region.addView('settings', {htmlTag: 'settings-view'});
await region.activate('settings');
await region.deactivate('settings');
await region.toggleViewActive('settings');
await region.removeView('settings');

region.context = {patientId: '123'}; // passed to every view as regionContext
region.currentViews;                 // all view definitions
region.currentActiveViews;           // active view definitions
region.containsView('settings');
region.isViewActive('settings');
```

## Adapters

The adapter decides how views are shown in the target element.

| Factory | Behaviour |
|---|---|
| `multipleActiveAdapterFactory` | Default. Every added view is activated and shown, ordered by `sortHint`. |
| `singleActiveAdapterFactory` | One active view at a time. Activating a view deactivates the current one. |
| `selectableAdapterFactory` | Single active view for targets with `selected` / `attrForSelected` properties (tabs, switchers). |

The adapter for a target is resolved in this order: `adapterFactory` in the region definition,
dynamic factories, the target's constructor, its tag name, and finally the default.

```ts
import {regionAdapterRegistry, selectableAdapterFactory} from '@uxland/regions';

regionAdapterRegistry.registerAdapterFactory('my-tabs', selectableAdapterFactory);
regionAdapterRegistry.registerAdapterFactory(MyTabs, selectableAdapterFactory);
regionAdapterRegistry.registerDefaultAdapterFactory(myAdapterFactory);
```

Custom adapters can extend `AdapterBase`, `SingleActiveAdapter` or `SelectableAdapter`.

## Region managers

`regionManager` is the default, global region manager, and `regionHost` uses it. To use another
one (for example an application-specific manager), build the mixin yourself:

```ts
import {regionAdapterRegistry, regionHostMixin, RegionManager} from '@uxland/regions';

const appRegionManager = new RegionManager();
export const appRegionHost = regionHostMixin(appRegionManager, regionAdapterRegistry);

class AppShell extends appRegionHost(LitElement) {}
```

| Method | Description |
|---|---|
| `registerViewWithRegion(name, key, view)` | Registers a view for every region with that name, now and in the future. |
| `addViewToRegion(name, key, view)` | Adds a view to an existing region. |
| `getRegion(name)` | The region with that name, if it exists. |
| `getRegisteredViews(name)` | Views registered for that name. |
| `remove(region)` | Removes a region. |
| `createRegionManager()` | Creates a child manager (used by `scoped` regions). |

## Migrating from 1.x

- **Lit 3.** `lit` is now a peer dependency, `^3.0.0`.
- **`regionsCreated`** is now called only after a synchronisation that created regions, with the
  created `IRegion` objects. In 1.x it was called after every update, with the region definitions,
  and the regions might not exist yet.
- **Per-instance regions.** Instead of writing to `constructor.__uxl_regions__` (`regionsProperty`),
  override `regionDefinitions` and call `refreshRegions()`.
- **Light DOM hosts** no longer need to override `shadowRoot`.
- **Renamed** `multipleActiveAdapterFaactory` to `multipleActiveAdapterFactory`. The old name
  still works and is deprecated, as is `create()` in favour of `refreshRegions()`.
- **ESM only.** Deep imports such as `@uxland/regions/region-decorator` still resolve, but prefer
  importing from `@uxland/regions`.

# @uxland/lit-utilities

Small utilities for [Lit](https://lit.dev) components: event listeners declared with a decorator,
`<property>Changed` callbacks and mixin deduplication.

## Installation

```bash
npm i @uxland/lit-utilities lit
```

`lit` `^3.0.0` is a peer dependency. The package is ESM only.

`@listen` is a TypeScript *experimental* decorator, like Lit's own decorators in that mode. Enable
it in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "useDefineForClassFields": false
  }
}
```

## `@listen(eventName, target?)`

Subscribes a method to an event. Subscriptions are refreshed after every update, so they follow
elements that appear or are re-rendered, and are removed on `disconnectedCallback`.

`target` is either a CSS selector, matched in the shadow root and in the light DOM, or an
`EventTarget` such as `window` or `document`.

```ts
import {LitElement, html} from 'lit';
import {listen} from '@uxland/lit-utilities';

class SaveForm extends LitElement {
  render() {
    return html`<button id="save">Save</button>`;
  }

  @listen('click', '#save')
  save(event: MouseEvent) {}

  @listen('resize', window)
  onResize() {}
}
```

## `propertiesObserver(Base)`

Calls `<property>Changed(newValue, oldValue)` whenever a reactive property changes. A property
counts as changed when its own `hasChanged` says so (Lit's default comparison when it declares
none), so the callback runs exactly when Lit schedules an update for that property.

```ts
import {LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {propertiesObserver} from '@uxland/lit-utilities';

class UserCard extends propertiesObserver(LitElement) {
  @property() userId: string;

  userIdChanged(current: string, previous: string) {
    this.loadUser(current);
  }
}
```

The callback runs synchronously when the property is set, before the update.

## `dedupeMixin(mixin)`

Wraps a mixin so it is applied only once per class chain, even if several mixins include it.

```ts
import {dedupeMixin} from '@uxland/lit-utilities';

export const loggable = dedupeMixin(
  (superClass) =>
    class extends superClass {
      log(message: string) {}
    }
);
```

It shares its registry with `dedupeMixin` from `@uxland/utilities`, so mixins deduplicated with
either one are recognised by both.

## Migrating from 1.x

- `lit` is now a peer dependency, `^3.0.0`.
- `propertiesObserver` now honours the `hasChanged` declared on each property. In 1.x it always
  used strict inequality, so a property with a custom `hasChanged` could get `<property>Changed`
  calls Lit did not consider changes.
- ESM only.

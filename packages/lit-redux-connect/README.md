# @uxland/lit-redux-connect

Binds properties of [Lit](https://lit.dev) components to a [Redux](https://redux.js.org) store.
A watched property is set from the store when the component is created and updated (debounced)
whenever the selected state changes.

## Installation

```bash
npm i @uxland/lit-redux-connect lit redux
```

`lit` `^3.0.0` is a peer dependency. The package is ESM only.

`@watch` is a TypeScript *experimental* decorator. Enable it in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "useDefineForClassFields": false
  }
}
```

## Usage

```ts
import {LitElement, html} from 'lit';
import {connect, watch} from '@uxland/lit-redux-connect';
import {store} from './store';

class UserBadge extends connect(store)(LitElement) {
  // Selector function
  @watch((state) => state.user.name)
  userName: string;

  // Path in the state, split by dots
  @watch('user.preferences.theme')
  theme: string;

  render() {
    return html`<span class=${this.theme}>${this.userName}</span>`;
  }
}
```

- `connect(store)` adds the store subscription to the component. `store` is the default store for
  its `@watch` properties.
- `@watch(selector, options?)` declares a property that takes its value from the store. The
  selector is a function of the state (called with the component as `this`) or a dot-separated
  path.
- The component subscribes right after it is created and unsubscribes on `disconnectedCallback`.
  It does not subscribe again if it is connected again.

### `@watch` options

| Option | Description |
|---|---|
| `store` | Store to read from, instead of the one passed to `connect`. |
| `propertyOptions` | Lit property options for the watched property (`type`, `attribute`, `hasChanged`...). |

## Without the mixin

`bind(element)` subscribes an element's watched properties to their stores and sets their current
values; `unbind(element)` removes those subscriptions. `connect` calls them for you.

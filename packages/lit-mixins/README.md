# @uxland/lit-mixins

Mixins that connect [Lit](https://lit.dev) components to other uxland libraries: localization
([`@uxland/localization`](https://www.npmjs.com/package/@uxland/localization)) and routing
([`@uxland/routing`](https://www.npmjs.com/package/@uxland/routing)).

## Installation

```bash
npm i @uxland/lit-mixins lit
```

`lit` `^3.0.0` is a peer dependency. The package is ESM only.

## Localization: `litLocale(Base)`

Gives the component a `localize(key, ...args)` function built from the current language, locales
and formats of `@uxland/localization`, and re-renders the component when any of them changes.

```ts
import {LitElement, html} from 'lit';
import {litLocale} from '@uxland/lit-mixins';

class Greeting extends litLocale(LitElement) {
  render() {
    return html`<p>${this.localize('greeting.hello')}</p>`;
  }
}
```

| Member | Description |
|---|---|
| `localize` | Translation function for the current language. |
| `language`, `locales`, `formats` | Current localization state. |
| `resetSubscribers()` | Stops listening to localization changes. Called on `disconnectedCallback`. |

The component subscribes to localization changes in its constructor, so after it has been
disconnected it no longer re-renders on language changes.

To build `localize` with your own factory, use `litLocaleMixin(factory)(Base)`.

## Routing: `routing(store, selectors)(Base)`

Connects a component to the routing state of `@uxland/routing` in a Redux store.

```ts
import {LitElement} from 'lit';
import {routing} from '@uxland/lit-mixins';
import {routingSelectors} from '@uxland/routing';
import {store} from './store';

class UsersPage extends routing(store, routingSelectors)(LitElement) {
  subroute = '/users';

  isRouteActiveChanged(active: boolean) {
    if (active) this.load();
  }
}
```

| Member | Description |
|---|---|
| `subroute` | Route this component belongs to. |
| `isRouteActive` | Whether the current route matches `subroute`. |
| `route`, `params`, `query` | Current route, its parameters and query string, from the store. |
| `isRouteActiveChanged(current, previous)` | Called when `isRouteActive` changes. |

`routeChanged`, `paramsChanged` and `queryChanged` are only called if the component also uses
`propertiesObserver` from `@uxland/lit-utilities`.

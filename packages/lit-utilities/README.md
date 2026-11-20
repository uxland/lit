# @uxland/lit-utilities

Small utilities for [Lit](https://lit.dev) components.

```bash
npm i @uxland/lit-utilities lit
```

`lit` (`^3.0.0`) is a peer dependency.

## `@listen(eventName, target?)`

Subscribes a method to an event after every update, and unsubscribes on disconnect. `target` is a
CSS selector (searched in the shadow root and the light DOM) or an `EventTarget`.

```ts
class MyElement extends LitElement {
  @listen('click', '#save')
  save() {}
}
```

## `propertiesObserver(Base)`

Calls `<property>Changed(newValue, oldValue)` whenever a reactive property changes, using the
property's own `hasChanged` when it declares one.

```ts
class MyElement extends propertiesObserver(LitElement) {
  @property() name: string;
  nameChanged(current: string, previous: string) {}
}
```

## `dedupeMixin(mixin)`

Wraps a mixin so it is applied only once per class chain.

# @uxland/lit

Llibreries d'[uxland](https://github.com/uxland/uxland) per a [Lit](https://lit.dev).

| Paquet | Descripció |
|---|---|
| [`@uxland/lit-utilities`](packages/lit-utilities) | `listen`, `propertiesObserver`, `dedupeMixin` |
| [`@uxland/regions`](packages/regions) | Regions: `regionHost`, `@region`, `regionView`, adaptadors |
| [`@uxland/lit-redux-connect`](packages/lit-redux-connect) | Connexió de components Lit amb Redux |
| [`@uxland/lit-mixins`](packages/lit-mixins) | Mixins de localització i routing |

Els paquets que ja no es mantenen són a [`legacy/`](legacy).

## Desenvolupament

Requereix Node 22 i pnpm 10.

```bash
pnpm install
pnpm build      # compila tots els paquets a dist/
pnpm test       # web-test-runner (Chrome)
pnpm lint       # Biome
```

## Publicació

Les versions es gestionen amb [Changesets](https://github.com/changesets/changesets):

1. A cada PR que canviï un paquet publicat: `pnpm changeset`.
2. En fer merge a `master`, el workflow `Release` obre la PR "chore: version packages".
3. En fer merge d'aquesta PR, es publiquen les noves versions a npm amb *trusted publishing* (OIDC) i provenance.

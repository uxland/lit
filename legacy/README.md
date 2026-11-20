# Paquets congelats

Aquests paquets ja no formen part del workspace: no es compilen, no es testegen i no es publiquen.
Les versions que ja hi ha a npm continuen disponibles.

| Paquet | Última versió a npm |
|---|---|
| `@uxland/prism` | 1.0.0 |
| `@uxland/routed-region` | 1.0.0 |
| `@uxland/ui-content-switcher` | 1.0.0 |

No s'han trobat projectes que els facin servir, però encara no s'ha confirmat amb tot l'equip,
així que **no s'han deprecat a npm**.

Si algun projecte els necessita: moure el paquet a `packages/`, adaptar-lo a l'estructura actual
(`src/`, `dist/`, `tsconfig.json` i `package.json` com els altres paquets) i publicar-ne una versió nova.

Els tests de `prism` i `routed-region` depenen de les utilitats de `test/utilities` de l'arrel.

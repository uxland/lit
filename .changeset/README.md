# Changesets

Cada PR que canviï el comportament d'un paquet publicat ha d'afegir un changeset:

```bash
pnpm changeset
```

Tria els paquets afectats i el tipus de salt (`major`, `minor`, `patch`) i descriu el canvi.
En fer merge a `master`, el workflow de release obre (o actualitza) la PR "Version Packages".
Quan es fa merge d'aquesta PR, es publiquen a npm les noves versions.

---
id: ZBLK-003
type: blocker
date: 2026-06-29
tags: [css, tailwind, background-image, react, wrapper, grid]
---

# ZBLK-003 — Grille background-image disparaît après load React

| Friction                                                             | Cause réelle                                                                                                               | Solution                                                                                       | Statut |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------ |
| La grille millimétré apparaît une fraction de seconde puis disparaît | `background-image` sur `body` écrasé par `background-color` du wrapper React `<div className="bg-background">` après mount | Déplacé en `@layer utilities .graph-bg`, appliqué directement sur les 2 root divs dans App.tsx | résolu |

## Références

- [LRN-011](../../learnings/LRN-011.md) — Pattern bg-image body vs wrapper React

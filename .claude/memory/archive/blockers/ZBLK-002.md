---
id: ZBLK-002
type: blocker
date: 2026-06-29
tags: [shadcn, tailwind-v4, css, setup, silent-failure]
---

# ZBLK-002 — App sans style après intégration shadcn/ui (3 iter.)

| Friction                                       | Cause réelle                                                                                                          | Solution                                                                                           | Statut |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------ |
| CSS shadcn/ui non appliqué après `shadcn init` | `@import 'tailwindcss'` sans guillemets doubles + `@theme inline` invalide + CSS vars OKLCH absentes du `@layer base` | `@import "tailwindcss"` (guillemets) + `@theme { --color-*: var(--*) }` + OKLCH dans `@layer base` | résolu |

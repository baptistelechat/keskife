---
id: ZBLK-006
type: blocker
date: 2026-06-29
tags: [shadcn, chart, tailwind-v4, css-variables, tooltip, indicator]
---

# ZBLK-006 — Indicateur dot tooltip shadcn chart invisible

| Friction                                                  | Cause réelle                                                                                   | Solution                                                       | Statut |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------ |
| Le point coloré dans `ChartTooltipContent` n'apparaît pas | `bg-[--color-bg]` invalide en Tailwind v4 — génère `background-color: --color-bg` sans `var()` | `bg-(--color-bg)` + `border-(--color-border)` dans `chart.tsx` | résolu |

Détecté quand Baptiste demande "peut-on ajouter un petit point devant le nom ?" — le dot était déjà codé dans le composant mais rendu transparent.

## Références

- [LRN-021](../../learnings/LRN-021.md) — pattern général Tailwind v4 CSS vars arbitraires

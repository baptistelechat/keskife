---
id: ZBLK-004
type: blocker
date: 2026-06-29
tags: [css, tailwind, rounded, card, border-l, ui, visual-feedback]
---

# ZBLK-004 — Bordure gauche card trop arrondie au rendu

| Friction                                                                                                  | Cause réelle                                                                                                 | Solution                                                           | Statut |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ------ |
| La bordure colorée gauche des entry cards courbe visiblement aux coins, différente du moodboard référence | `rounded-lg` = 8px border-radius s'applique à tous les coins dont la gauche où se trouve l'indicateur coloré | Remplacé par `rounded-sm` (4px) sur le div card dans EntryList.tsx | résolu |

## Références

- [LRN-013](../../learnings/LRN-013.md) — rounded-sm pour bordures indicatrices

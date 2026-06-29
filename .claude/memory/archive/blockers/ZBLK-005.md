---
id: ZBLK-005
type: blocker
date: 2026-06-29
tags: [edit-tool, hooks, biome, formatter, modified-since-read]
---

# ZBLK-005 — Edit `types/index.ts` échoue "modified since read" après hook reformatter

| Friction                                                                                   | Cause réelle                                                                                                                                    | Solution                                                                               | Statut |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------ |
| Edit tool rejette la modification de `types/index.ts` avec "file modified since last read" | Le hook PostToolUse (Biome formatter) a reformatté le fichier après l'edit précédent sur `EntryList.tsx`, invalidant l'état de lecture mémorisé | Re-Read obligatoire du fichier cible avant tout Edit quand un formatter hook est actif | résolu |

voir aussi GLRN-103 (pattern global documenté)

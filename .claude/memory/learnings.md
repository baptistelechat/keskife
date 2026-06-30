---
register: learnings
---

## Index

| ID                              | Date       | Pattern observé                                                  | Tags                                                                                              |
| ------------------------------- | ---------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [LRN-001](learnings/LRN-001.md) | 2026-06-29 | Vars VITE*SUPABASE*\* absentes → client silencieux, app cassée   | #supabase #vite #env-vars #setup                                                                  |
| [LRN-002](learnings/LRN-002.md) | 2026-06-29 | Recharts : couleurs via props, pas via classes Tailwind          | #recharts #tailwind #css #chart #colors                                                           |
| [LRN-003](learnings/LRN-003.md) | 2026-06-29 | `@theme inline` invalide en Tailwind v4 → CSS ignoré             | #tailwind-v4 #theme #inline #silent-failure #shadcn                                               |
| [LRN-004](learnings/LRN-004.md) | 2026-06-29 | `@import "tailwindcss"` : guillemets obligatoires                | #tailwind-v4 #import #postcss #shadcn #cli #quotes                                                |
| [LRN-005](learnings/LRN-005.md) | 2026-06-29 | shadcn v4 CSS vars : OKLCH dans `@layer base`, `var()` `@theme`  | #shadcn #tailwind-v4 #oklch #css-variables #setup                                                 |
| [LRN-006](learnings/LRN-006.md) | 2026-06-29 | `user_id` absent INSERT Supabase → 403 RLS même avec JWT valide  | #supabase #rls #insert #user_id #auth #postgres                                                   |
| [LRN-007](learnings/LRN-007.md) | 2026-06-29 | `captionLayout="dropdown"` sans `startMonth`/`endMonth` bloque   | #react-day-picker #calendar #dropdown #navigation                                                 |
| [LRN-008](learnings/LRN-008.md) | 2026-06-29 | shadcn Calendar : `size-(--cell-size)` obligatoire Tailwind v4   | #shadcn #calendar #tailwind-v4 #css-variables                                                     |
| [LRN-009](learnings/LRN-009.md) | 2026-06-29 | `fixedWeeks` react-day-picker → hauteur calendrier stable        | #react-day-picker #calendar #fixedWeeks #layout                                                   |
| [LRN-010](learnings/LRN-010.md) | 2026-06-29 | shadcn SelectItem JSX complexe → reproduit dans trigger auto     | #shadcn #select #jsx #trigger #ui #react                                                          |
| [LRN-011](learnings/LRN-011.md) | 2026-06-29 | bg-image body invisible sous bg-color child React                | #css #tailwind #background-image #react #utility-class                                            |
| [LRN-012](learnings/LRN-012.md) | 2026-06-29 | `data-[state=on]:` pour actif Radix ToggleGroup                  | #tailwind-v4 #radix-ui #toggle-group #data-state #active-state                                    |
| [LRN-013](learnings/LRN-013.md) | 2026-06-29 | `rounded-sm` (4px) pour bordure gauche colorée card              | #tailwind #css #rounded-sm #card #border-l #visual-precision                                      |
| [LRN-014](learnings/LRN-014.md) | 2026-06-29 | Moodboard HTML standalone avant implémentation UI                | #design #moodboard #html #workflow #frontend-design                                               |
| [LRN-015](learnings/LRN-015.md) | 2026-06-29 | `<input type="date">` → Popover + Calendar shadcn contrôlé       | #shadcn #calendar #popover #date-picker #controlled-open #react                                   |
| [LRN-016](learnings/LRN-016.md) | 2026-06-29 | Flip bordure séparatrice `flex-col`→`flex-row` responsive        | #tailwind #responsive #flex #border #layout                                                       |
| [LRN-017](learnings/LRN-017.md) | 2026-06-29 | Wrapper `bg-[color]` Calendar inline → fond continu              | #calendar #shadcn #css #tailwind #design                                                          |
| [LRN-018](learnings/LRN-018.md) | 2026-06-29 | Manifest PWA : icône SVG `sizes: "any"` évite la génération PNG  | #pwa #manifest #icon #svg #ios #png #vite-plugin-pwa                                              |
| [LRN-019](learnings/LRN-019.md) | 2026-06-29 | `size="icon"` + texte → overflow visuel sur éléments adjacents   | #shadcn #button #size-icon #overflow #ui #pwa                                                     |
| [LRN-020](learnings/LRN-020.md) | 2026-06-29 | shadcn charts : couleurs via `var(--color-{key})` dans les data  | #shadcn #recharts #chart #css-variables #colors #tailwind-v4                                      |
| [LRN-021](learnings/LRN-021.md) | 2026-06-29 | Tailwind v4 : `bg-(--var)` obligatoire pour CSS vars arbitraires | #tailwind-v4 #css-variables #arbitrary-values #shadcn #bug                                        |
| [LRN-022](learnings/LRN-022.md) | 2026-06-29 | Cycling tag coprime → couverture uniforme de tous les enums      | #seed #mock-data #cycling #enum #tag #bug #parity                                                 |
| [LRN-023](learnings/LRN-023.md) | 2026-06-30 | SVG viewBox tight crop : bounding box réel + stroke/2            | #svg #viewbox #icon #logo #stroke #bounding-box #lucide #crop                                     |
| [LRN-024](learnings/LRN-024.md) | 2026-06-30 | Recharts Pie : `outerRadius` px → débordement mobile             | #recharts #chart #pie #responsive #mobile #outerRadius #shadcn                                    |
| [LRN-025](learnings/LRN-025.md) | 2026-06-30 | `ChartLegendContent` shadcn : pas de `flex-wrap` par défaut      | #shadcn #recharts #chart #legend #responsive #flex-wrap #mobile                                   |
| [LRN-026](learnings/LRN-026.md) | 2026-06-30 | `react-day-picker/locale` : `fr` intégrée avec weekStartsOn=1    | #react-day-picker #calendar #locale #fr #weekStartsOn #shadcn #i18n                               |
| [LRN-027](learnings/LRN-027.md) | 2026-06-30 | `children` à destructurer de DayButton pour ajouter du JSX       | #react-day-picker #calendar #DayButton #children #props #shadcn #customization                    |
| [LRN-028](learnings/LRN-028.md) | 2026-06-30 | `getDay()` pour weekends (modifier `weekend` absent rdp v10)     | #react-day-picker #calendar #weekend #modifier #DayButton #getDay #v10                            |
| [LRN-029](learnings/LRN-029.md) | 2026-06-30 | Pattern `daysWithData` : modifier custom + dot + hook par mois   | #react-day-picker #calendar #shadcn #custom-modifier #daysWithData #useMonthActivity #performance |

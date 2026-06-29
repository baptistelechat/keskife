---
register: journal
---

## 2026-06-29

Initialisation de l'infrastructure mémoire agent du projet Kronik. Le projet est une SPA React 19 + Vite + Supabase permettant de journaliser et visualiser du temps de travail par tags (dev, prod, admin, réunion, formation).

**Entrées clés :**

- [BDR-001](decisions/BDR-001.md) — Supabase retenu comme backend (auth + BDD)
- [BDR-002](decisions/BDR-002.md) — Navigation sans routeur (2 vues max)
- [LRN-001](learnings/LRN-001.md) — Piège env vars Supabase silencieux
- [BLK-001](blockers/BLK-001.md) — `.env.example` manquant

---

Session de refonte UI : intégration complète de shadcn/ui dans Kronik. L'utilisateur a constaté que l'app n'utilisait pas shadcn et a demandé une refonte de tous les composants. Les fichiers `button`, `card`, `input`, `label`, `select`, `badge`, `toggle`, `toggle-group`, `alert` ont été ajoutés via la CLI shadcn, puis tous les composants de l'app ont été refactorisés (AuthForm, EntryForm, EntryList, Dashboard, Stats, PeriodSelector, ChartToggle, App).

La partie la plus longue a été l'obtention d'un CSS fonctionnel. Trois itérations ont été nécessaires avant d'arriver à la structure correcte : `@import "tailwindcss";` (avec guillemets) + `@theme { --color-*: var(--*) }` + `@layer base { :root { oklch values } }`. La taille du bundle CSS est passée de 2,38 kB à 38,51 kB, confirmant que les utilitaires Tailwind sont bien générés.

Le path alias Windows (bug GLRN-121) a aussi frappé : shadcn a créé les fichiers dans `@\components\ui\` au lieu de `src\components\ui\`, corrigé par un `Move-Item` PowerShell. Le `components.json` a dû être créé manuellement car le `shadcn init` échouait à détecter Tailwind (cause : absence de guillemets dans `@import`).

**Entrées clés :**

- [BDR-003](decisions/BDR-003.md) — shadcn/ui retenu comme bibliothèque UI
- [ZBLK-002](archive/blockers/ZBLK-002.md) — CSS sans style, 3 itérations nécessaires

---

Session de debug et refonte du formulaire d'entrée. Trois corrections successives : (1) bug RLS Supabase sur l'INSERT — `user_id` absent du payload malgré un JWT valide, corrigé en injectant `supabase.auth.getUser()` dans `addEntry` ; (2) bug de refresh — `EntryForm` et `Dashboard` instanciaient chacun `useEntries()` indépendamment, les états ne se synchronisaient pas, corrigé en levant `addEntry` au niveau `Dashboard` et en le passant en prop ; (3) initialisation des heures hardcodée à 09:00/10:00, corrigée avec `nowTime()` et `oneHourLater()`.

Ensuite refonte complète du composant `EntryForm` : remplacement du `<Input type="date">` par le composant `Calendar` shadcn + `Popover`, puis évolution vers un calendrier inline en layout côte à côte (calendrier gauche, formulaire droite). Le composant `calendar.tsx` installé via CLI utilisait la syntaxe Tailwind v3 pour les CSS custom properties (`h-[--cell-size]`) qui ne fonctionne pas en v4 — réécriture manuelle avec `size-(--cell-size)`. Le mode `captionLayout="dropdown"` bloquait la navigation à décembre 2026 faute de `startMonth`/`endMonth` explicites. Ajout de `fixedWeeks` pour stabiliser la hauteur de la carte. Les labels de catégories ont été étendus aux noms complets (Développement, Production, Administration).

**Entrées clés :**

- [LRN-006](learnings/LRN-006.md) — user_id absent INSERT Supabase → 403 RLS
- [LRN-007](learnings/LRN-007.md) — captionLayout dropdown sans plage → navigation bloquée
- [LRN-008](learnings/LRN-008.md) — syntax CSS vars Tailwind v4 dans calendar.tsx

---

Session courte : ajout de pastilles colorées devant les items du select "Catégorie" dans `EntryForm`. Import de `TAG_COLORS` depuis `types/index.ts`, wrapping de chaque `SelectItem` dans un `<span className="flex items-center gap-2">` avec un dot `<span style={{ backgroundColor: TAG_COLORS[t] }} />`. Le contenu JSX est reproduit automatiquement dans le trigger par `SelectValue`.

**Entrées clés :**

- [LRN-010](learnings/LRN-010.md) — shadcn SelectItem JSX → trigger auto

---

Session de redesign UI complet (Direction B1 Papier Millimétré Classique). Démarré par un moodboard HTML dédié en 3 directions visuelles (`docs/moodboard/moodboards.html`), puis 3 variantes de la Direction B (`moodboard-b-variants.html`). Baptiste a choisi la B1 Classique.

Implémentation complète : refonte de `src/index.css` (palette cream/navy/blue, grille millimétré `.graph-bg`, fonts IBM Plex via Google Fonts), header App.tsx en navy avec ToggleGroup surligné actif, entry cards avec bordure gauche colorée via inline style + badge tag sémantique monospace. Ajout de `TAG_BADGE_BG` et `TAG_BADGE_TEXT` dans `types/index.ts`.

Deux bugs reportés via screenshots : (1) la grille disparaissait après mount React — `background-image` sur `body` écrasé par `background-color` du wrapper, corrigé en classe utilitaire `.graph-bg` sur le root div ; (2) bordure gauche des cards trop arrondie — `rounded-lg` → `rounded-sm`.

**Entrées clés :**

- [BDR-004](decisions/BDR-004.md) — Direction B1 Papier Millimétré Classique
- [ZBLK-003](archive/blockers/ZBLK-003.md) — Grille disparaît après load React

---

Session courte de remplacement des datepickers natifs HTML. Les `<Input type="date">` présents dans `Dashboard` (sélecteur du journal quotidien) et `PeriodSelector` (plage personnalisée dans Stats) ont été remplacés par le pattern `Popover + Calendar` shadcn avec état `open` contrôlé pour fermeture automatique après sélection. Les props Calendar ont été alignées sur l'instance de référence d'EntryForm : `showWeekNumber`, `fixedWeeks`, `startMonth`/`endMonth` (±5 ans) et `timeZone`. Un bouton "Aujourd'hui" a été ajouté dans chaque popover (`border-t p-2`), qui sélectionne `new Date()` et ferme le popover.

**Entrées clés :**

- [LRN-015](learnings/LRN-015.md) — Pattern Popover + Calendar pour remplacer input[type=date]

---

Bug fix Stats > Personnalisé : sélectionner aujourd'hui retournait "Aucune donnée sur cette période". Cause racine : `fetchEntriesInRange` utilisait `.toISOString()` (UTC) pour les bornes de requête Supabase, alors que les entrées sont stockées en heure locale sans timezone (via `toLocalISO`). Pour UTC+2, sélectionner le 29/06 produisait `2026-06-28T22:00:00Z` — toutes les entrées du jour étaient hors plage. Le bug touchait en réalité tous les modes (Semaine, Mois, Trimestre…), pas seulement Personnalisé. Fix : ajout de `toLocalDateStr()` et remplacement par des chaînes locales `T00:00:00`/`T23:59:59`, aligné sur le pattern déjà correct de `useEntries` (Dashboard).

---

Session de renommage de l'app. `kronik.vercel.app` étant déjà pris, une exploration de ~40 noms a été lancée : variantes orthographiques de Kronik (kronique, chronique, kronico…), noms thématiques journal/temps (folio, slate, quill, strata, daystamp…), jeux de mots phonétiques ("qu'est-ce qu'il fait" → kekife, keskife…). Après plusieurs allers-retours — dont une correction de cadrage (l'app est un journal de ce qu'on a fait, pas du pointage d'horaires), Baptiste a retenu **Keskife**. Toute l'app a été mise à jour : `index.html`, `package.json`, `App.tsx`, `AuthForm.tsx`, et les composants `KronikPieChart`/`KronikBarChart` renommés en `KeskifePieChart`/`KeskifeBarChart`. Note : `CLAUDE.md` local et les fichiers `docs/` référencent encore "Kronik" — à mettre à jour séparément.

**Entrées clés :**

- [BDR-006](decisions/BDR-006.md) — Renommage "Kronik" → "Keskife"

---

Session courte de responsive design sur `EntryForm`. Deux modifications appliquées : (1) layout Calendar+Form passé de `flex` à `flex-col sm:flex-row` pour empiler les panneaux sur mobile, avec flip de la bordure séparatrice (`border-b sm:border-b-0 sm:border-r`) ; (2) Calendar enveloppé dans un `<div className="flex justify-center bg-[#f7f3ec]">` pour le centrer sur mobile et donner l'illusion que son fond cream s'étend sur toute la colonne gauche, sans toucher la zone "Aujourd'hui" en dessous.

---

Session de transformation de Keskife en PWA. Installation de `vite-plugin-pwa` v1.3.0, configuration du manifest (nom "Keskife", `theme_color: #1e2d4a`, `background_color: #f7f3ec`, `display: standalone`, icône SVG unique avec `sizes: "any"`). Création de `public/icon.svg` (horloge aux couleurs de la palette B1). Mise à jour de `index.html` avec le bon favicon + `<meta name="theme-color">`. Pattern `controllerchange`+`hadController` intégré dans `App.tsx` via `useEffect` pour reload automatique silencieux sans toast dès qu'un nouveau SW s'active. Build prod validé (`dist/sw.js` + `dist/workbox-*.js` générés).

**Entrées clés :**

- [BDR-007](decisions/BDR-007.md) — Keskife PWA : vite-plugin-pwa + auto-reload silencieux

---

Session courte PWA : bouton d'installation in-app + alignement manifest statique.

Ajout d'un bouton "Installer" dans la top bar de `App.tsx` : hook `beforeinstallprompt` stocké en state, guard `isStandalone` (calculé une fois au mount), disparition au clic et sur `appinstalled`. Premier essai avec `size="icon"` + texte "Installer" → overflow visuel sur la navigation (corrigé en `size="sm"` + `gap-1.5`). Le bouton est placé à gauche de la ToggleGroup navigation.

Côté manifest : premier essai avec `devOptions: { enabled: true }` pour rendre le SW visible en dev générait un dossier `dev-dist/` indésirable. Alignement sur le pattern ifecho : `manifest: false` dans VitePWA + `public/manifest.json` statique + `<link rel="manifest">` dans `index.html`. Le manifest est désormais visible immédiatement dans DevTools > Application > Manifest dès `pnpm dev`, sans `dev-dist/`.

**Entrées clés :**

- [BDR-008](decisions/BDR-008.md) — Manifest PWA statique (pattern ifecho)

---

Session d'identité visuelle PWA. Génération de 6 propositions d'icône dans `docs/ui/icon/index.html` — HTML standalone avec SVG inline et script JS pour comparer les variantes sans outils externes. Baptiste a retenu la **variante E Spectrum** : CalendarDays + 6 dots aux couleurs des 5 tags (dev/réunion/prod/formation/admin).

Remplacement de `public/icon.svg` (ancienne horloge) par le design Spectrum. Setup complet `@vite-pwa/assets-generator` : installation, `pwa-assets.config.ts` avec `minimalPreset`, script `generate-pwa-assets`, mise à jour du manifest Vite (4 entrées PNG + SVG fallback) et de `index.html` (`favicon.ico` + `apple-touch-icon`). Génération des 7 formats en une commande. Fix immédiat du fond blanc sur `maskable-icon-512x512.png` via `resizeOptions: { background: '#1e2d4a' }` dans le preset maskable. Skill global `/gen-pwa-icons` créé pour relancer le process depuis n'importe quel projet.

**Entrées clés :**

- [BDR-009](decisions/BDR-009.md) — Logo Spectrum retenu comme identité Keskife

---

Session de migration des charts vers shadcn/ui. Installation du composant `chart.tsx` via CLI (déplacé manuellement de `@\components\ui\` → `src\components\ui\`, bug Windows GLRN-121 reproductible). Migration de `KeskifePieChart` et `KeskifeBarChart` : `ResponsiveContainer` remplacé par `ChartContainer`, tooltip/légende Recharts raw remplacés par `ChartTooltip`/`ChartTooltipContent`/`ChartLegend`/`ChartLegendContent`. Couleurs des tags passées via `ChartConfig` (clé = tag, valeur = hex `TAG_COLORS`) — `ChartStyle` les injecte en `--color-{key}` dans le DOM. Les data items Pie reçoivent `fill: "var(--color-{tag})"` au lieu de `Cell`.

Deux corrections post-migration : (1) tooltip trop étroit pour "Développement" + valeur → `gap-2` ajouté sur le conteneur `justify-between` dans `chart.tsx` ; (2) indicateur dot invisible — `bg-[--color-bg]` Tailwind v3 invalide en v4 (génère `background-color: --color-bg` sans `var()`) → corrigé en `bg-(--color-bg)` / `border-(--color-border)`.

**Entrées clés :**

- [BDR-010](decisions/BDR-010.md) — Charts migrés vers wrappers shadcn/ui
- [LRN-021](learnings/LRN-021.md) — Tailwind v4 : syntaxe `(--var)` obligatoire
- [ZBLK-006](archive/blockers/ZBLK-006.md) — Dot invisible chart.tsx

---

Session courte de tooling dev : création du script `scripts/seed.mjs` pour peupler la base de données avec des données mock réalistes. Le script purge toutes les entrées de l'utilisateur connecté puis insère ~45 entrées réparties sur 3 semaines (jours ouvrés uniquement, 3 créneaux/jour, 5 tags couverts). Lancé via `pnpm seed` → `node --env-file=.env.local scripts/seed.mjs`.

Premier point de friction : Baptiste a demandé à ne pas stocker le mot de passe en env. Remplacement de `SEED_PASSWORD` par un prompt readline interactif avec `output: null` pour masquer l'écho — aucune dépendance supplémentaire, compatible Windows.

Second point : les tags `admin` et `formation` n'apparaissaient jamais dans les données générées. Cause : parity slot selection — `slots[3]` était sélectionné uniquement quand `dayIndex % 2 === 0`, mais son `tagIdx` valait `dayIndex % 2 === 0 ? 0 : 2`, donc toujours 0 (dev) au moment où il était pris. Fix : formule `TAGS[(dayIndex + i * 2) % TAGS.length]` avec step=2 coprime avec N=5, garantissant tous les tags en 5 jours.

**Entrées clés :**

- [BDR-011](decisions/BDR-011.md) — Script seed readline interactif
- [LRN-022](learnings/LRN-022.md) — Cycling tag coprime pour couverture uniforme

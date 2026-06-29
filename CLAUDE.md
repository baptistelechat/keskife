## 💻 Kronik

Application web de suivi du temps de travail. Permet de journaliser des entrées taguées (dev, prod, admin, réunion, formation), de les consulter dans un journal quotidien et d'analyser sa répartition via des graphiques interactifs.

### Stack technique

- **Langage** : TypeScript 5.8
- **Framework** : React 19 + Vite 6
- **Runtime / Package manager** : Node.js + pnpm
- **Styling** : Tailwind CSS v4 (via `@tailwindcss/vite`)
- **Base de données** : Supabase (PostgreSQL + auth intégrée)
- **Charts** : Recharts 2
- **Icônes** : Lucide React

### Architecture

SPA deux pages (`Dashboard` = journal d'entrées, `Stats` = graphiques). Navigation par onglets (`useState`). Hooks dédiés : `useAuth` (session Supabase), `useEntries` (CRUD entrées). Aucun routeur installé.

### Conventions importantes

- Variables d'env requises : `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans `.env.local`
- Tags fixes définis dans `src/types/index.ts` (`Tag` union type + palettes couleurs)
- Dates stockées en ISO 8601 (`started_at`, `ended_at`, `created_at`)

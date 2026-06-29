# Kronik — Brief de projet

> Journal de bord professionnel avec split visuel des activités.  
> Stack : Vite + React + TypeScript + Tailwind + shadcn/ui + Supabase + Recharts + Vercel

---

## 🎯 Objectif

Permettre à un utilisateur de logger rapidement ses activités journalières (titre + plage horaire + catégorie) et d'analyser la répartition de son temps sur différentes périodes via des graphiques simples.

---

## 👥 Utilisateurs

- Multi-utilisateurs via Supabase Auth (email / password)
- Chaque utilisateur ne voit **que ses propres entrées** (RLS activé)
- Partage de l'app via une URL Vercel (pas de notion d'équipe / workspace)

---

## 🗄️ Schéma Supabase

```sql
create table public.entries (
  id          uuid        default gen_random_uuid() primary key,
  user_id     uuid        references auth.users(id) on delete cascade not null,
  title       text        not null,
  tag         text        check (tag in ('dev', 'prod', 'admin', 'réunion', 'formation')) not null,
  started_at  timestamptz not null,
  ended_at    timestamptz not null,
  created_at  timestamptz default now()
);

-- Row Level Security
alter table public.entries enable row level security;

create policy "Users manage own entries"
  on public.entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

> 💡 La date de l'entrée est dérivée de `started_at` (pas de colonne `date` séparée).  
> Pour une saisie rétroactive, l'utilisateur choisit manuellement la date + heure de début.

---

## ✨ Fonctionnalités

### 1. Auth
- Login / Register (email + password) via Supabase Auth
- Redirection automatique vers le dashboard si déjà connecté
- Bouton de déconnexion

### 2. Saisie d'une entrée (formulaire manuel)
- **Date** : aujourd'hui par défaut, modifiable (date picker natif)
- **Heure de début** : time picker
- **Heure de fin** : time picker
- **Titre** : champ texte libre
- **Tag** : sélecteur parmi `dev` | `prod` | `admin` | `réunion` | `formation`
- Bouton **Enregistrer**

> Pas de timer start/stop dans cette v1 — saisie 100% manuelle.

### 3. Liste des entrées du jour
- Affichage chronologique des entrées du jour courant
- Colonne : heure début → fin | durée calculée | titre | badge tag coloré
- Action : supprimer une entrée
- *(édition = v2)*

### 4. Graphiques — Onglet Stats

#### Sélecteur de période
| Option | Détail |
|---|---|
| `Semaine` | Lun → Dim de la semaine courante |
| `Mois` | Mois civil courant |
| `Trimestre` | T1/T2/T3/T4 courant |
| `Année civile` | 1er Jan → 31 Déc |
| `Exercice comptable` | 1er Jan → 31 Déc (identique pour l'instant, paramétrable v2) |
| `Personnalisé` | Date début + Date fin libres |

#### Types de graphiques (toggle)
- 🥧 **Camembert (Pie)** : répartition en % par tag sur la période
- 📊 **Barres empilées (Stacked Bar)** : cumul par tag par jour / semaine selon la période

#### Métriques affichées sous les graphiques
- Temps total sur la période
- Temps par tag (en heures + %)

---

## 🗂️ Structure du projet

```
kronik/
├── .env.local                    # VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
├── .env.example
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx                   # Routing + AuthGuard
│   ├── lib/
│   │   └── supabase.ts           # Client Supabase + types générés
│   ├── types/
│   │   └── index.ts              # Type Entry, Tag, Period...
│   ├── hooks/
│   │   ├── useEntries.ts         # CRUD entrées (useQuery style)
│   │   └── useAuth.ts            # Session utilisateur
│   ├── components/
│   │   ├── Auth/
│   │   │   └── AuthForm.tsx      # Login + Register
│   │   ├── Entry/
│   │   │   ├── EntryForm.tsx     # Formulaire saisie
│   │   │   └── EntryList.tsx     # Liste du jour
│   │   └── Stats/
│   │       ├── PeriodSelector.tsx
│   │       ├── ChartToggle.tsx
│   │       ├── PieChart.tsx
│   │       ├── StackedBarChart.tsx
│   │       └── StatsSummary.tsx  # Métriques texte
│   └── pages/
│       ├── Dashboard.tsx         # Saisie + liste du jour
│       └── Stats.tsx             # Graphiques + période
```

---

## 🎨 UI / Style

- **Tailwind CSS** + **shadcn/ui** pour les composants (Button, Input, Select, Tabs, Card, Badge, Popover, Calendar)
- Init shadcn : `pnpm dlx shadcn@latest init` puis ajouter les composants au besoin
- **Couleurs des tags** (constantes à définir dans `types/index.ts`) :

| Tag | Couleur suggérée |
|---|---|
| `dev` | Bleu `#3B82F6` |
| `prod` | Vert `#10B981` |
| `admin` | Gris `#6B7280` |
| `réunion` | Orange `#F59E0B` |
| `formation` | Violet `#8B5CF6` |

- Layout : **deux onglets** — `Journal` (Dashboard) et `Stats`
- Mobile-friendly (mais pas prioritaire v1)

---

## 🚀 Déploiement

- **Frontend** : Vercel (import repo GitHub)
- **Backend** : Supabase (projet dédié `kronik`)
- Variables d'environnement à configurer dans Vercel :
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

---

## 🔲 Hors scope v1

- Timer start/stop
- Édition d'une entrée existante
- Notifications / rappels
- Export CSV / PDF
- Paramétrage de l'exercice comptable
- Vue équipe / comparaison entre utilisateurs
- Mode sombre

---

## ✅ Checklist de lancement

- [ ] Créer le projet Supabase (`kronik`)
- [ ] Exécuter le SQL schema dans l'éditeur Supabase
- [ ] Activer Auth (email/password) dans Supabase
- [ ] `pnpm create vite@latest kronik -- --template react-ts`
- [ ] Installer les dépendances : `@supabase/supabase-js`, `recharts`, `tailwindcss`
- [ ] Init shadcn/ui : `pnpm dlx shadcn@latest init`
- [ ] Ajouter les composants shadcn nécessaires : `button`, `input`, `select`, `tabs`, `card`, `badge`, `popover`, `calendar`
- [ ] Configurer `.env.local` avec URL + anon key
- [ ] Implémenter Auth → Dashboard → Stats
- [ ] Push GitHub → déployer sur Vercel

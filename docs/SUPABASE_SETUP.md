# Setup Supabase — Kronik

## 1. Créer le projet

- [x] Aller sur [supabase.com](https://supabase.com) → **New project**
- [x] Nom : `kronik`
- [x] Choisir une région proche (ex. `eu-central-1`)
- [x] Définir un mot de passe DB fort (le noter quelque part)
- [x] Attendre la fin du provisionnement (~1 min)

---

## 2. Activer Auth email/password

- [x] **Authentication** → **Providers** → **Email** → activer
- [x] Désactiver "Confirm email" si tu veux tester sans vérification de mail (optionnel)

---

## 3. Créer la table `entries`

- [x] **SQL Editor** → **New query** → coller et exécuter :

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

- [x] Vérifier dans **Table Editor** que la table `entries` apparaît

---

## 4. Récupérer les clés API

- [x] **Project Settings** → **API**
- [x] Copier **Project URL** → `VITE_SUPABASE_URL`
- [x] Copier **anon / public key** → `VITE_SUPABASE_ANON_KEY`

---

## 5. Configurer `.env.local`

- [x] Créer le fichier `.env.local` à la racine du projet :

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 6. Tester en local

- [x] `pnpm dev`
- [x] Créer un compte via le formulaire Register
- [x] Ajouter une entrée → vérifier qu'elle apparaît dans **Table Editor** → `entries`

---

## 7. Déployer sur Vercel

- [x] Push le repo sur GitHub
- [x] Importer le repo sur [vercel.com](https://vercel.com) → **New Project**
- [x] Dans **Environment Variables**, ajouter :
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [x] **Deploy** → vérifier que l'app tourne en prod

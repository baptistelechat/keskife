// ponytail: seed dev uniquement — node --env-file=.env.local scripts/seed.mjs
import { createClient } from "@supabase/supabase-js";
import { createInterface } from "node:readline";

const { VITE_SUPABASE_URL: url, VITE_SUPABASE_ANON_KEY: key } = process.env;

if (!url || !key) {
  console.error(
    "Variables manquantes dans .env.local : VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY",
  );
  process.exit(1);
}

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    rl.question(question, (a) => {
      rl.close();
      resolve(a);
    }),
  );
}

function askHidden(question) {
  // output: null supprime l'écho — le mot de passe n'apparaît pas dans le terminal
  const rl = createInterface({ input: process.stdin, output: null });
  process.stdout.write(question);
  return new Promise((resolve) =>
    rl.question("", (a) => {
      rl.close();
      process.stdout.write("\n");
      resolve(a);
    }),
  );
}

const email = process.env.SEED_EMAIL || (await ask("Email : "));
const password = await askHidden("Mot de passe : ");

const supabase = createClient(url, key);

const TITLES = {
  dev: [
    "Refacto module auth",
    "Fix bug pagination",
    "Implémentation API REST",
    "Review PR collègue",
    "Migration base de données",
    "Mise en place tests",
    "Debug prod",
    "Feature dashboard",
  ],
  prod: [
    "Déploiement v2.3",
    "Hotfix critique",
    "Release candidate",
    "Mise à jour dépendances",
    "Monitoring post-deploy",
  ],
  admin: [
    "Rapport mensuel",
    "Mise à jour docs",
    "Gestion tickets support",
    "Backlog grooming",
    "Suivi budget projet",
  ],
  réunion: [
    "Daily standup",
    "Point équipe hebdo",
    "Sync client",
    "Retrospective sprint",
    "Planning sprint",
    "One-to-one manager",
  ],
  formation: [
    "Lecture RFC",
    "Tuto TypeScript avancé",
    "Webinar architecture",
    "Peer learning session",
  ],
};

const TAGS = ["dev", "prod", "admin", "réunion", "formation"];

function pad(n) {
  return String(n).padStart(2, "0");
}

function toISO(date, h, m = 0) {
  return `${date}T${pad(h)}:${pad(m)}:00`;
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function isWeekend(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return d.getDay() === 0 || d.getDay() === 6;
}

// 3 créneaux fixes par jour, tags en cycling garantissant tous les 5 tags
const TIME_SLOTS = [
  [8, 9],
  [9, 11],
  [14, 16],
];

function entriesForDay(date, dayIndex) {
  return TIME_SLOTS.map(([start, end], i) => {
    const tag = TAGS[(dayIndex + i * 2) % TAGS.length];
    const title = TITLES[tag][(dayIndex + i) % TITLES[tag].length];
    return {
      title,
      tag,
      started_at: toISO(date, start),
      ended_at: toISO(date, end),
    };
  });
}

async function main() {
  console.log("🔑 Connexion...");
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });
  if (authError) {
    console.error("Auth échouée :", authError.message);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log(`✅ Connecté : ${email}`);

  // Purge
  console.log("🗑️  Purge des entrées existantes...");
  const { error: delError } = await supabase
    .from("entries")
    .delete()
    .eq("user_id", userId);
  if (delError) {
    console.error("Purge échouée :", delError.message);
    process.exit(1);
  }

  // Génération — 3 semaines à partir d'aujourd'hui
  const today = new Date();
  const startDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const entries = [];
  let dayIndex = 0;

  for (let i = 0; i < 21; i++) {
    const date = addDays(startDate, i);
    if (isWeekend(date)) continue;
    entries.push(
      ...entriesForDay(date, dayIndex).map((e) => ({ ...e, user_id: userId })),
    );
    dayIndex++;
  }

  console.log(`📝 Insertion de ${entries.length} entrées sur 3 semaines...`);
  const { error: insertError } = await supabase.from("entries").insert(entries);
  if (insertError) {
    console.error("Insertion échouée :", insertError.message);
    process.exit(1);
  }

  console.log(
    `✅ ${entries.length} entrées créées du ${startDate} au ${addDays(startDate, 20)}`,
  );
  await supabase.auth.signOut();
}

main();

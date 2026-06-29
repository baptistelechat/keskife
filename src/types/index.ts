export type Tag = "dev" | "prod" | "admin" | "réunion" | "formation";

export interface Entry {
  id: string;
  user_id: string;
  title: string;
  tag: Tag;
  started_at: string;
  ended_at: string;
  created_at: string;
}

export type Period =
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "fiscal"
  | "custom";

export interface DateRange {
  from: Date;
  to: Date;
}

export const TAG_COLORS: Record<Tag, string> = {
  dev: "#3B82F6",
  prod: "#10B981",
  admin: "#6B7280",
  réunion: "#F59E0B",
  formation: "#8B5CF6",
};

export const TAG_BADGE_BG: Record<Tag, string> = {
  dev: "rgba(59,130,246,0.1)",
  prod: "rgba(16,185,129,0.1)",
  admin: "rgba(107,114,128,0.1)",
  réunion: "rgba(245,158,11,0.1)",
  formation: "rgba(139,92,246,0.1)",
};

export const TAG_BADGE_TEXT: Record<Tag, string> = {
  dev: "#2563EB",
  prod: "#059669",
  admin: "#4B5563",
  réunion: "#D97706",
  formation: "#7C3AED",
};

export const TAG_LABELS: Record<Tag, string> = {
  dev: "Développement",
  prod: "Production",
  admin: "Administration",
  réunion: "Réunion",
  formation: "Formation",
};

export const TAGS: Tag[] = ["dev", "prod", "admin", "réunion", "formation"];

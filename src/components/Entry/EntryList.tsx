import { Trash2 } from "lucide-react";
import {
  TAG_BADGE_BG,
  TAG_BADGE_TEXT,
  TAG_COLORS,
  TAG_LABELS,
} from "../../types";
import type { Entry } from "../../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function durationLabel(started: string, ended: string): string {
  const ms = new Date(ended).getTime() - new Date(started).getTime();
  const totalMin = Math.round(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${String(m).padStart(2, "0")}`;
}

function timeLabel(iso: string): string {
  const [, timePart] = iso.split("T");
  return timePart?.slice(0, 5) ?? "";
}

interface Props {
  entries: Entry[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export function EntryList({ entries, loading, onDelete }: Props) {
  if (loading) {
    return <p className="text-sm text-muted-foreground">Chargement...</p>;
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-10 text-center">
        <p className="text-sm text-muted-foreground">
          Aucune entrée pour ce jour
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center gap-3 rounded-sm border bg-card px-4 py-3 shadow-sm"
          style={{
            borderLeftColor: TAG_COLORS[entry.tag],
            borderLeftWidth: "3px",
          }}
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{entry.title}</p>
            <p className="font-mono text-xs text-muted-foreground">
              {timeLabel(entry.started_at)} → {timeLabel(entry.ended_at)} ·{" "}
              {durationLabel(entry.started_at, entry.ended_at)}
            </p>
          </div>
          <Badge
            variant="outline"
            style={{
              backgroundColor: TAG_BADGE_BG[entry.tag],
              color: TAG_BADGE_TEXT[entry.tag],
              borderColor: TAG_COLORS[entry.tag] + "60",
            }}
            className="shrink-0 font-mono text-[10px] uppercase tracking-wide"
          >
            {TAG_LABELS[entry.tag]}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(entry.id)}
            aria-label="Supprimer l'entrée"
            className="shrink-0 size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 />
          </Button>
        </div>
      ))}
    </div>
  );
}

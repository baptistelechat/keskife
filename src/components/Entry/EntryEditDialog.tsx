import { useEffect, useState } from "react";
import { Clock2Icon } from "lucide-react";
import { TAGS, TAG_LABELS, TAG_COLORS } from "../../types";
import type { Entry, Tag } from "../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function timeFromISO(iso: string): string {
  return iso.split("T")[1]?.slice(0, 5) ?? "";
}

function dateFromISO(iso: string): string {
  return iso.split("T")[0] ?? "";
}

interface Props {
  entry: Entry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (
    id: string,
    patch: {
      title: string;
      tag: Tag;
      startTime: string;
      endTime: string;
      date: string;
    },
  ) => Promise<unknown>;
}

export function EntryEditDialog({ entry, open, onOpenChange, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState<Tag>("dev");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && entry) {
      setTitle(entry.title);
      setTag(entry.tag);
      setStartTime(timeFromISO(entry.started_at));
      setEndTime(timeFromISO(entry.ended_at));
      setDate(dateFromISO(entry.started_at));
      setError(null);
    }
  }, [open, entry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry) return;
    if (endTime <= startTime) {
      setError("L'heure de fin doit être après l'heure de début");
      return;
    }
    setError(null);
    setLoading(true);
    const err = await onSave(entry.id, {
      title,
      tag,
      startTime,
      endTime,
      date,
    });
    setLoading(false);
    if (!err) onOpenChange(false);
    else setError("Erreur lors de la sauvegarde");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier l'entrée</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-title" className="text-xs">
              Titre
            </Label>
            <Input
              id="edit-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-start" className="text-xs">
                Début
              </Label>
              <div className="relative">
                <Input
                  id="edit-start"
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-8 pr-8 text-sm [&::-webkit-calendar-picker-indicator]:hidden"
                />
                <Clock2Icon className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-end" className="text-xs">
                Fin
              </Label>
              <div className="relative">
                <Input
                  id="edit-end"
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-8 pr-8 text-sm [&::-webkit-calendar-picker-indicator]:hidden"
                />
                <Clock2Icon className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-tag" className="text-xs">
              Catégorie
            </Label>
            <Select value={tag} onValueChange={(v) => setTag(v as Tag)}>
              <SelectTrigger id="edit-tag">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TAGS.map((t) => (
                  <SelectItem key={t} value={t}>
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: TAG_COLORS[t] }}
                      />
                      {TAG_LABELS[t]}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

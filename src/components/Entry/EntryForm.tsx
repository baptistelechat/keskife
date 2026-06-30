import { useState } from "react";
import { Clock2Icon } from "lucide-react";
import { TAGS, TAG_LABELS, TAG_COLORS } from "../../types";
import type { Tag } from "../../types";
import { useMonthActivity } from "../../hooks/useMonthActivity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function oneHourLater() {
  const d = new Date();
  d.setHours(d.getHours() + 1);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface Props {
  selectedDate: string;
  addEntry: (payload: {
    title: string;
    tag: Tag;
    date: string;
    startTime: string;
    endTime: string;
  }) => Promise<{ message: string } | null>;
}

const today = new Date();
const START_MONTH = new Date(today.getFullYear() - 5, 0);
const END_MONTH = new Date(today.getFullYear() + 5, 11);

export function EntryForm({ addEntry }: Props) {
  const [date, setDate] = useState<Date>(new Date());
  const {
    month: currentMonth,
    setMonth: setCurrentMonth,
    activeDays,
  } = useMonthActivity(new Date(today.getFullYear(), today.getMonth(), 1));
  const [startTime, setStartTime] = useState(nowTime());
  const [endTime, setEndTime] = useState(oneHourLater());
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState<Tag>("dev");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (endTime <= startTime) {
      setError("L'heure de fin doit être après l'heure de début");
      return;
    }
    setError(null);
    setLoading(true);
    const err = await addEntry({
      title,
      tag,
      date: toDateStr(date),
      startTime,
      endTime,
    });
    if (err) {
      setError(err.message);
    } else {
      setTitle("");
      setStartTime(endTime);
      setEndTime(endTime);
    }
    setLoading(false);
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-col border-b sm:border-b-0 sm:border-r">
          <div className="flex justify-center bg-[#f7f3ec]">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              startMonth={START_MONTH}
              endMonth={END_MONTH}
              timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
              showWeekNumber
              fixedWeeks
              daysWithData={activeDays}
            />
          </div>
          <div className="border-t p-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                const now = new Date();
                setDate(now);
                setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
              }}
            >
              Aujourd'hui
            </Button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col justify-between gap-4 p-4"
        >
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="start-time" className="text-xs">
                  Début
                </Label>
                <div className="relative">
                  <Input
                    id="start-time"
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
                <Label htmlFor="end-time" className="text-xs">
                  Fin
                </Label>
                <div className="relative">
                  <Input
                    id="end-time"
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
              <Label htmlFor="entry-title" className="text-xs">
                Titre
              </Label>
              <Input
                id="entry-title"
                type="text"
                required
                placeholder="Ce que tu as fait..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="entry-tag" className="text-xs">
                Catégorie
              </Label>
              <Select value={tag} onValueChange={(v) => setTag(v as Tag)}>
                <SelectTrigger id="entry-tag">
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
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </form>
      </div>
    </Card>
  );
}

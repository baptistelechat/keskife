import { useState } from "react";
import {
  ArrowUpDown,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { EntryForm } from "../components/Entry/EntryForm";
import { EntryList } from "../components/Entry/EntryList";
import { EntryEditDialog } from "../components/Entry/EntryEditDialog";
import { useEntries } from "../hooks/useEntries";
import type { Entry } from "../types";
import { useMonthActivity } from "../hooks/useMonthActivity";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const today = new Date();
const START_MONTH = new Date(today.getFullYear() - 5, 0);
const END_MONTH = new Date(today.getFullYear() + 5, 11);

export function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<Entry | null>(null);
  const [sortAsc, setSortAsc] = useState(false);
  const { month, setMonth, activeDays } = useMonthActivity();
  const iso = toISO(selectedDate);
  const { entries, loading, deleteEntry, addEntry, updateEntry } =
    useEntries(iso);
  const sortedEntries = sortAsc
    ? entries.toSorted((a, b) => a.started_at.localeCompare(b.started_at))
    : entries;

  return (
    <div className="flex flex-col gap-6">
      <EntryForm selectedDate={iso} addEntry={addEntry} />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <h2 className="font-semibold">Journal du jour</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 gap-1 px-1.5 text-xs text-muted-foreground font-normal"
              onClick={() => setSortAsc((s) => !s)}
              aria-label={
                sortAsc
                  ? "Trier du plus récent au plus ancien"
                  : "Trier du plus ancien au plus récent"
              }
            >
              <ArrowUpDown className="size-3" />
              <span className="hidden sm:inline">
                {sortAsc ? "Plus ancien d'abord" : "Plus récent d'abord"}
              </span>
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() =>
                setSelectedDate(
                  (d) =>
                    new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1),
                )
              }
              aria-label="Jour précédent"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <CalendarIcon className="size-4" />
                  <span className="hidden sm:inline">
                    {selectedDate.toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => {
                    if (d) {
                      setSelectedDate(d);
                      setOpen(false);
                    }
                  }}
                  month={month}
                  onMonthChange={setMonth}
                  startMonth={START_MONTH}
                  endMonth={END_MONTH}
                  timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
                  showWeekNumber
                  fixedWeeks
                  daysWithData={activeDays}
                />
                <div className="border-t p-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedDate(new Date());
                      setOpen(false);
                    }}
                  >
                    Aujourd'hui
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() =>
                setSelectedDate(
                  (d) =>
                    new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1),
                )
              }
              aria-label="Jour suivant"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
        <EntryList
          entries={sortedEntries}
          loading={loading}
          onDelete={deleteEntry}
          onEdit={setEditEntry}
        />
      </div>

      <EntryEditDialog
        entry={editEntry}
        open={editEntry !== null}
        onOpenChange={(o) => {
          if (!o) setEditEntry(null);
        }}
        onSave={updateEntry}
      />
    </div>
  );
}

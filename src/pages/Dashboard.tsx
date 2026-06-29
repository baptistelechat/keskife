import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { EntryForm } from "../components/Entry/EntryForm";
import { EntryList } from "../components/Entry/EntryList";
import { useEntries } from "../hooks/useEntries";
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
  const iso = toISO(selectedDate);
  const { entries, loading, deleteEntry, addEntry } = useEntries(iso);

  return (
    <div className="flex flex-col gap-6">
      <EntryForm selectedDate={iso} addEntry={addEntry} />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Journal du jour</h2>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <CalendarIcon className="size-4" />
                {selectedDate.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
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
                startMonth={START_MONTH}
                endMonth={END_MONTH}
                timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
                showWeekNumber
                fixedWeeks
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
        </div>
        <EntryList entries={entries} loading={loading} onDelete={deleteEntry} />
      </div>
    </div>
  );
}

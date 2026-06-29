import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import type { Period, DateRange } from "../../types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  period: Period;
  customRange: DateRange;
  onChange: (period: Period) => void;
  onCustomRange: (range: DateRange) => void;
}

const PERIODS: { value: Period; label: string }[] = [
  { value: "week", label: "Semaine" },
  { value: "month", label: "Mois" },
  { value: "quarter", label: "Trimestre" },
  { value: "year", label: "Année civile" },
  { value: "fiscal", label: "Exercice" },
  { value: "custom", label: "Personnalisé" },
];

const today = new Date();
const START_MONTH = new Date(today.getFullYear() - 5, 0);
const END_MONTH = new Date(today.getFullYear() + 5, 11);
const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

function formatShort(d: Date) {
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function PeriodSelector({
  period,
  customRange,
  onChange,
  onCustomRange,
}: Props) {
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup
        type="single"
        value={period}
        onValueChange={(v) => {
          if (v) onChange(v as Period);
        }}
        className="flex-wrap justify-start gap-1"
      >
        {PERIODS.map((p) => (
          <ToggleGroupItem
            key={p.value}
            value={p.value}
            className="rounded-full px-3 py-1 text-sm"
          >
            {p.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {period === "custom" && (
        <div className="flex items-center gap-2">
          <Popover open={openFrom} onOpenChange={setOpenFrom}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <CalendarIcon className="size-4" />
                {formatShort(customRange.from)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={customRange.from}
                onSelect={(d) => {
                  if (d) {
                    onCustomRange({ ...customRange, from: d });
                    setOpenFrom(false);
                  }
                }}
                startMonth={START_MONTH}
                endMonth={END_MONTH}
                timeZone={TZ}
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
                    onCustomRange({ ...customRange, from: new Date() });
                    setOpenFrom(false);
                  }}
                >
                  Aujourd'hui
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <span className="text-sm text-muted-foreground">→</span>
          <Popover open={openTo} onOpenChange={setOpenTo}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <CalendarIcon className="size-4" />
                {formatShort(customRange.to)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={customRange.to}
                onSelect={(d) => {
                  if (d) {
                    onCustomRange({ ...customRange, to: d });
                    setOpenTo(false);
                  }
                }}
                startMonth={START_MONTH}
                endMonth={END_MONTH}
                timeZone={TZ}
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
                    onCustomRange({ ...customRange, to: new Date() });
                    setOpenTo(false);
                  }}
                >
                  Aujourd'hui
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}

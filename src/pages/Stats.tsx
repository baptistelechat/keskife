import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { PeriodSelector } from "../components/Stats/PeriodSelector";
import { ChartToggle } from "../components/Stats/ChartToggle";
import { KeskifePieChart } from "../components/Stats/KeskifePieChart";
import { KeskifeBarChart } from "../components/Stats/KeskifeBarChart";
import { StatsSummary } from "../components/Stats/StatsSummary";
import { fetchEntriesInRange } from "../hooks/useEntries";
import { Card, CardContent } from "@/components/ui/card";
import type { Period, DateRange, Entry, Tag } from "../types";
import type { ChartType } from "../components/Stats/ChartToggle";

function getRangeForPeriod(period: Period, custom: DateRange): DateRange {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  if (period === "week") {
    const day = now.getDay();
    const from = new Date(now);
    from.setDate(now.getDate() - ((day + 6) % 7));
    from.setHours(0, 0, 0, 0);
    const to = new Date(from);
    to.setDate(from.getDate() + 6);
    to.setHours(23, 59, 59, 999);
    return { from, to };
  }
  if (period === "month") {
    return { from: new Date(y, m, 1), to: new Date(y, m + 1, 0, 23, 59, 59) };
  }
  if (period === "quarter") {
    const q = Math.floor(m / 3);
    return {
      from: new Date(y, q * 3, 1),
      to: new Date(y, q * 3 + 3, 0, 23, 59, 59),
    };
  }
  if (period === "year" || period === "fiscal") {
    return { from: new Date(y, 0, 1), to: new Date(y, 11, 31, 23, 59, 59) };
  }
  return custom;
}

function groupByTag(entries: Entry[]): { tag: Tag; minutes: number }[] {
  const map = new Map<Tag, number>();
  for (const e of entries) {
    const ms =
      new Date(e.ended_at).getTime() - new Date(e.started_at).getTime();
    map.set(e.tag, (map.get(e.tag) ?? 0) + ms / 60000);
  }
  return Array.from(map.entries()).map(([tag, minutes]) => ({ tag, minutes }));
}

export function Stats() {
  const [period, setPeriod] = useState<Period>("week");
  const [customRange, setCustomRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });
  const [chartType, setChartType] = useState<ChartType>("pie");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const range = getRangeForPeriod(period, customRange);

  useEffect(() => {
    setLoading(true);
    fetchEntriesInRange(range.from, range.to).then((data) => {
      setEntries(data);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, customRange]);

  const groupBy =
    period === "year" || period === "fiscal" || period === "quarter"
      ? "week"
      : "day";

  return (
    <div className="flex flex-col gap-6">
      <PeriodSelector
        period={period}
        customRange={customRange}
        onChange={setPeriod}
        onCustomRange={setCustomRange}
      />
      <ChartToggle value={chartType} onChange={setChartType} />

      <Card>
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            <m.div
              key={loading ? "loading" : chartType}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {loading ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Chargement...
                </p>
              ) : chartType === "pie" ? (
                <KeskifePieChart data={groupByTag(entries)} />
              ) : (
                <KeskifeBarChart entries={entries} groupBy={groupBy} />
              )}
            </m.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <StatsSummary entries={entries} />
        </CardContent>
      </Card>
    </div>
  );
}

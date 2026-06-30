import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { TAG_COLORS, TAG_LABELS, TAGS } from "../../types";
import type { Entry, Tag } from "../../types";

const chartConfig = Object.fromEntries(
  TAGS.map((tag) => [tag, { label: TAG_LABELS[tag], color: TAG_COLORS[tag] }]),
) satisfies ChartConfig;

interface Props {
  entries: Entry[];
  groupBy: "day" | "week";
}

function groupEntries(entries: Entry[], groupBy: "day" | "week") {
  const map = new Map<string, Record<Tag, number>>();

  for (const entry of entries) {
    const d = new Date(entry.started_at);
    let key: string;

    if (groupBy === "week") {
      const dayOfWeek = d.getDay();
      const monday = new Date(d);
      monday.setDate(d.getDate() - ((dayOfWeek + 6) % 7));
      key = monday.toISOString().slice(0, 10);
    } else {
      key = entry.started_at.slice(0, 10);
    }

    if (!map.has(key)) {
      map.set(key, { dev: 0, prod: 0, admin: 0, réunion: 0, formation: 0 });
    }

    const ms =
      new Date(entry.ended_at).getTime() - new Date(entry.started_at).getTime();
    map.get(key)![entry.tag] += ms / 3600000;
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, tags]) => ({
      date,
      ...Object.fromEntries(
        TAGS.map((t) => [t, Math.round(tags[t] * 10) / 10]),
      ),
    }));
}

export function KeskifeBarChart({ entries, groupBy }: Props) {
  if (entries.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Aucune donnée sur cette période
      </p>
    );
  }

  const data = groupEntries(entries, groupBy);

  return (
    <ChartContainer config={chartConfig} className="min-h-[280px] w-full">
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          tickFormatter={(v: string) => v.slice(5)}
        />
        <YAxis tick={{ fontSize: 11 }} unit="h" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend
          content={<ChartLegendContent className="flex-wrap gap-x-4 gap-y-1" />}
        />
        {TAGS.map((tag) => (
          <Bar
            key={tag}
            dataKey={tag}
            stackId="a"
            fill={`var(--color-${tag})`}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

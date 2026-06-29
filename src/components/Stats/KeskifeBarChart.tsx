import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TAG_COLORS, TAG_LABELS, TAGS } from "../../types";
import type { Entry, Tag } from "../../types";

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
    .map(([date, tags]) => ({ date, ...tags }));
}

export function KeskifeBarChart({ entries, groupBy }: Props) {
  if (entries.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        Aucune donnée sur cette période
      </p>
    );
  }

  const data = groupEntries(entries, groupBy);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          tickFormatter={(v: string) => v.slice(5)}
        />
        <YAxis tick={{ fontSize: 11 }} unit="h" />
        <Tooltip formatter={(v: number) => `${Math.round(v * 10) / 10}h`} />
        <Legend />
        {TAGS.map((tag) => (
          <Bar
            key={tag}
            dataKey={tag}
            name={TAG_LABELS[tag]}
            stackId="a"
            fill={TAG_COLORS[tag]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

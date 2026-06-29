import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TAG_COLORS, TAG_LABELS } from "../../types";
import type { Tag } from "../../types";

interface Props {
  data: { tag: Tag; minutes: number }[];
}

export function KeskifePieChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        Aucune donnée sur cette période
      </p>
    );
  }

  const chartData = data.map((d) => ({
    name: TAG_LABELS[d.tag],
    value: d.minutes,
    tag: d.tag,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={110}
        >
          {chartData.map((entry) => (
            <Cell key={entry.tag} fill={TAG_COLORS[entry.tag]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v: number) => `${Math.round((v / 60) * 10) / 10}h`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

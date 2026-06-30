import { PieChart, Pie } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { TAG_COLORS, TAG_LABELS, TAGS } from "../../types";
import type { Tag } from "../../types";

const chartConfig = Object.fromEntries(
  TAGS.map((tag) => [tag, { label: TAG_LABELS[tag], color: TAG_COLORS[tag] }]),
) satisfies ChartConfig;

interface Props {
  data: { tag: Tag; minutes: number }[];
}

export function KeskifePieChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Aucune donnée sur cette période
      </p>
    );
  }

  const chartData = data.map((d) => ({
    tag: d.tag,
    name: TAG_LABELS[d.tag],
    value: Math.round((d.minutes / 60) * 10) / 10,
    fill: `var(--color-${d.tag})`,
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[280px] w-full">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="45%"
          outerRadius="70%"
        />
        <ChartTooltip
          content={<ChartTooltipContent nameKey="tag" hideLabel />}
        />
        <ChartLegend
          content={
            <ChartLegendContent
              nameKey="tag"
              className="flex-wrap gap-x-4 gap-y-1"
            />
          }
        />
      </PieChart>
    </ChartContainer>
  );
}

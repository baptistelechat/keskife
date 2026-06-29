import { PieChart as PieIcon, BarChart2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type ChartType = "pie" | "bar";

interface Props {
  value: ChartType;
  onChange: (v: ChartType) => void;
}

export function ChartToggle({ value, onChange }: Props) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as ChartType);
      }}
    >
      <ToggleGroupItem value="pie" aria-label="Camembert" className="gap-1.5">
        <PieIcon />
        Répartition
      </ToggleGroupItem>
      <ToggleGroupItem
        value="bar"
        aria-label="Barres empilées"
        className="gap-1.5"
      >
        <BarChart2 />
        Évolution
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

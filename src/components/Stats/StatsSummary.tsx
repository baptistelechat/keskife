import { TAG_COLORS, TAG_LABELS, TAGS } from "../../types";
import type { Entry } from "../../types";

interface Props {
  entries: Entry[];
}

export function StatsSummary({ entries }: Props) {
  const totalMs = entries.reduce((acc, e) => {
    return (
      acc + (new Date(e.ended_at).getTime() - new Date(e.started_at).getTime())
    );
  }, 0);

  const totalH = totalMs / 3600000;

  const byTag = TAGS.map((tag) => {
    const ms = entries
      .filter((e) => e.tag === tag)
      .reduce(
        (acc, e) =>
          acc +
          (new Date(e.ended_at).getTime() - new Date(e.started_at).getTime()),
        0,
      );
    return {
      tag,
      hours: ms / 3600000,
      pct: totalMs > 0 ? (ms / totalMs) * 100 : 0,
    };
  }).filter((t) => t.hours > 0);

  if (entries.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">
          {Math.round(totalH * 10) / 10}h
        </span>
        <span className="text-sm text-gray-500">sur la période</span>
      </div>

      <div className="space-y-2">
        {byTag.map(({ tag, hours, pct }) => (
          <div key={tag} className="flex items-center gap-3">
            <div
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: TAG_COLORS[tag] }}
            />
            <span className="w-24 text-sm text-gray-700">
              {TAG_LABELS[tag]}
            </span>
            <div className="h-1.5 flex-1 rounded-full bg-gray-100">
              <div
                className="h-1.5 rounded-full"
                style={{ width: `${pct}%`, backgroundColor: TAG_COLORS[tag] }}
              />
            </div>
            <span className="w-20 text-right text-sm text-gray-500">
              {Math.round(hours * 10) / 10}h · {Math.round(pct)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

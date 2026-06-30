import { useState, useEffect } from "react";
import { fetchActiveDaysInMonth } from "./useEntries";

export function useMonthActivity(initialMonth?: Date) {
  const [month, setMonth] = useState<Date>(initialMonth ?? new Date());
  const [activeDays, setActiveDays] = useState<Date[]>([]);
  const y = month.getFullYear();
  const m = month.getMonth();

  useEffect(() => {
    fetchActiveDaysInMonth(y, m).then(setActiveDays);
  }, [y, m]);

  return { month, setMonth, activeDays };
}

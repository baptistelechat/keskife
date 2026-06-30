import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Entry, Tag } from "../types";

function toLocalISO(date: string, time: string): string {
  // Build an ISO string from local date + time without UTC conversion
  return `${date}T${time}:00`;
}

export function useEntries(date: string) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from("entries")
      .select("*")
      .gte("started_at", `${date}T00:00:00`)
      .lte("started_at", `${date}T23:59:59`)
      .order("started_at", { ascending: false });
    setEntries((data as Entry[]) ?? []);
    setLoading(false);
  }, [date]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addEntry = async (payload: {
    title: string;
    tag: Tag;
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("entries").insert({
      user_id: user?.id,
      title: payload.title,
      tag: payload.tag,
      started_at: toLocalISO(payload.date, payload.startTime),
      ended_at: toLocalISO(payload.date, payload.endTime),
    });
    if (!error) await fetch();
    return error;
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase.from("entries").delete().eq("id", id);
    if (!error) setEntries((prev) => prev.filter((e) => e.id !== id));
    return error;
  };

  const updateEntry = async (
    id: string,
    patch: {
      title: string;
      tag: Tag;
      startTime: string;
      endTime: string;
      date: string;
    },
  ) => {
    const { error } = await supabase
      .from("entries")
      .update({
        title: patch.title,
        tag: patch.tag,
        started_at: toLocalISO(patch.date, patch.startTime),
        ended_at: toLocalISO(patch.date, patch.endTime),
      })
      .eq("id", id);
    if (!error) await fetch();
    return error;
  };

  return {
    entries,
    loading,
    addEntry,
    deleteEntry,
    updateEntry,
    refetch: fetch,
  };
}

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function fetchActiveDaysInMonth(
  year: number,
  month: number,
): Promise<Date[]> {
  const from = new Date(year, month, 1);
  const to = new Date(year, month + 1, 0);
  const { data } = await supabase
    .from("entries")
    .select("started_at")
    .gte("started_at", `${toLocalDateStr(from)}T00:00:00`)
    .lte("started_at", `${toLocalDateStr(to)}T23:59:59`);
  if (!data?.length) return [];
  const seen = new Set<string>();
  return data
    .map((r) => (r.started_at as string).split("T")[0])
    .filter((d) => {
      if (seen.has(d)) return false;
      seen.add(d);
      return true;
    })
    .map((d) => {
      const [y, m, day] = d.split("-").map(Number);
      return new Date(y, m - 1, day);
    });
}

export async function fetchEntriesInRange(
  from: Date,
  to: Date,
): Promise<Entry[]> {
  const { data } = await supabase
    .from("entries")
    .select("*")
    .gte("started_at", `${toLocalDateStr(from)}T00:00:00`)
    .lte("started_at", `${toLocalDateStr(to)}T23:59:59`)
    .order("started_at", { ascending: true });
  return (data as Entry[]) ?? [];
}

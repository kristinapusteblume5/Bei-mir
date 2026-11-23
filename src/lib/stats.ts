import { HABITS } from "../content/checkin";
import { fmt } from "./lifewheel";
import { dateKey, type AppData, type Checkin } from "./storage";

export const MIN_DAYS = 14; // Tage mit Abend-Review, ab denen Muster gezeigt werden
export const MIN_GROUP = 5; // Mindestzahl Tage je Vergleichsgruppe

export type Metric = "mood" | "energy" | "stress";
// Alle Skalen laufen von 1 bis 5.
export const METRICS: { id: Metric; label: string; range: number; threshold: number; max: number }[] = [
  { id: "mood", label: "Stimmung", range: 4, threshold: 0.3, max: 5 },
  { id: "energy", label: "Energie", range: 4, threshold: 0.3, max: 5 },
  { id: "stress", label: "Stress", range: 4, threshold: 0.3, max: 5 },
];

export const mean = (xs: number[]): number | null => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

// Tageswert = Mittel aus Morgen und Abend, falls beide vorhanden sind.
export function dayValue(c: Checkin, k: Metric): number | null {
  const v = [c.morning?.[k], c.evening?.[k]].filter((x): x is number => typeof x === "number");
  return mean(v);
}

export function weekKeys(monday: Date): string[] {
  return Array.from({ length: 7 }, (_, i) => dateKey(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i)));
}

export const eligibleDays = (data: AppData): number => Object.values(data.checkins).filter((c) => c.evening).length;

export interface Comparison {
  habitId: string; habit: string; metric: Metric;
  withN: number; withoutN: number; withAvg: number; withoutAvg: number;
  diff: number; neutral: boolean;
}

// Vergleicht Abend-Werte an Tagen mit und ohne Gewohnheit. Ohne genug Daten: leere Liste.
export function compareHabits(data: AppData): Comparison[] {
  const days = Object.values(data.checkins).filter((c) => c.evening);
  if (days.length < MIN_DAYS) return [];
  const out: Comparison[] = [];
  for (const h of HABITS) {
    for (const m of METRICS) {
      const withV: number[] = [];
      const withoutV: number[] = [];
      for (const c of days) {
        const v = c.evening?.[m.id];
        if (typeof v !== "number") continue;
        (c.evening?.habits.includes(h.id) ? withV : withoutV).push(v);
      }
      if (withV.length < MIN_GROUP || withoutV.length < MIN_GROUP) continue;
      const a = mean(withV) as number;
      const b = mean(withoutV) as number;
      out.push({ habitId: h.id, habit: h.label, metric: m.id, withN: withV.length, withoutN: withoutV.length,
        withAvg: a, withoutAvg: b, diff: a - b, neutral: Math.abs(a - b) < m.threshold });
    }
  }
  return out;
}

export function describeComparison(c: Comparison): string {
  const m = METRICS.find((x) => x.id === c.metric);
  const base = `An ${c.withN} Tagen mit ${c.habit} lag deine ${m?.label} im Schnitt bei ${fmt(c.withAvg)}, an ${c.withoutN} Tagen ohne bei ${fmt(c.withoutAvg)}.`;
  return c.neutral ? `${base} Kaum Unterschied.` : base;
}

export function topInsight(data: AppData): { text: string; n: number } | null {
  const all = compareHabits(data);
  if (all.length === 0) return null;
  const rel = (c: Comparison) => Math.abs(c.diff) / (METRICS.find((m) => m.id === c.metric)?.range ?? 1);
  const best = all.filter((c) => !c.neutral).sort((a, b) => rel(b) - rel(a))[0];
  if (!best) {
    return { text: "In deinen bisherigen Daten zeigen sich keine auffälligen Unterschiede zwischen Tagen mit und ohne deine Gewohnheiten.", n: eligibleDays(data) };
  }
  return { text: describeComparison(best), n: best.withN + best.withoutN };
}

export function factorCounts(checkins: Checkin[], kind: "good" | "bad"): { id: string; count: number }[] {
  const m = new Map<string, number>();
  for (const c of checkins) for (const id of c.evening?.[kind] ?? []) m.set(id, (m.get(id) ?? 0) + 1);
  return Array.from(m, ([id, count]) => ({ id, count })).sort((a, b) => b.count - a.count);
}

export function habitDays(checkins: Checkin[], habitId: string): { done: number; total: number } {
  const ev = checkins.filter((c) => c.evening);
  return { done: ev.filter((c) => c.evening?.habits.includes(habitId)).length, total: ev.length };
}

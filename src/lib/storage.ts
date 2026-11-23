// Alle Daten bleiben lokal im Browser (localStorage). Kein Login, kein Server.
export type Mood = 1 | 2 | 3 | 4 | 5;

export interface Morning {
  mood: Mood;
  energy: number; // 1–5
  stress: number; // 1–5
  body: string[]; // Körpergefühl (Mehrfachauswahl)
  note: string;
}

export interface Evening {
  mood?: Mood; // optional, weil ältere Einträge ohne Abend-Werte existieren
  energy?: number;
  stress?: number;
  good: string[];
  bad: string[];
  habits: string[]; // erledigte Gewohnheiten
  note: string;
}

export interface Checkin {
  date: string; // YYYY-MM-DD, lokale Zeit
  morning?: Morning;
  evening?: Evening;
}

export interface LifewheelAssessment {
  week: string; // Montag der Woche, YYYY-MM-DD
  answers: Record<string, number>; // Frage-ID -> 1–5
  summary: Record<string, number>; // Bereichs-ID -> 1–5
  focus?: string[]; // Bereiche, denen mehr Energie zugedacht ist
  notes: Record<string, string>;
  values: Record<string, number>; // Werte-Frage-ID -> 1–5
  savedAt: string;
}

export interface RoutineStep {
  id: string;
  text: string;
  hint?: string;
  kind?: "guided" | "audio" | "video" | "exercise" | "checkin";
  anleitung?: string[];
  impuls?: string; // Frage, die im Schritt steht
  audio?: string; // Pfad zur Hintergrundmusik
  stimme?: string; // Pfad zu einer eigenen Sprachaufnahme
  dauer?: number; // Sekunden für den Timer
  exercise?: string; // Übungs-ID aus content/exercises
}
// Erledigte Schritte je Routine, Schlüssel ist die Routine-ID.
export type RoutineLog = Record<string, string[]>;
export interface ExerciseLog {
  date: string;
  exerciseId: string;
  stateId?: string;
  outcome: "besser" | "unveraendert" | "schlechter";
  at: string;
}

export interface Insight {
  id: string;
  date: string;
  text: string;
  feelings: string[]; // Zustands-IDs aus content/exercises
  areas: string[]; // Lebensbereichs-IDs aus content/lifewheel
}

export interface ChecklistItem { id: string; text: string }

export interface AppData {
  version: 1;
  checkins: Record<string, Checkin>;
  lifewheel: Record<string, LifewheelAssessment>;
  routines: Record<string, RoutineStep[] | undefined>;
  videos: Record<string, string | undefined>; // eigener Pfad oder Link je Routine
  routineLog: Record<string, RoutineLog>; // Datum -> erledigte Schritt-IDs
  exerciseLog: ExerciseLog[];
  insights?: Insight[]; // selbst notierte Erkenntnisse
  checkliste?: ChecklistItem[]; // eigene Punkte zum Abhaken
  checklistLog?: Record<string, string[]>; // Datum -> erledigte Punkte
  favorites?: string[]; // Lieblingsübungen für den Schnellzugriff
  reflections: Record<string, Record<string, string>>; // Wochen-Montag -> Frage-ID -> Antwort
}

import { dbLeeren, dbLesen, dbSchreiben } from "./db";

const KEY = "bei-mir:daten";
const SICHERUNG = "bei-mir:letzte-sicherung";

// Gelesen wird aus dem Zwischenspeicher, damit die Seiten ohne Warten auskommen.
// Geschrieben wird in beide Ablagen: localStorage sofort, IndexedDB im Hintergrund.
let cache: AppData | null = null;
const empty = (): AppData => ({ version: 1, checkins: {}, lifewheel: {}, routines: {}, videos: {}, routineLog: {}, exerciseLog: [], insights: [], checkliste: undefined, checklistLog: {}, reflections: {} });

// Phase-3-Einträge (ein flacher Check-in) werden in Morgen und Abend aufgeteilt, ohne Werte zu erfinden.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const to5 = (v: unknown): number | undefined =>
  typeof v === "number" ? (v > 5 ? Math.ceil(v / 2) : v) : undefined;

// Frühere Einträge liefen auf einer Skala bis 10. Sie werden halbiert und aufgerundet,
// damit alte und neue Werte vergleichbar bleiben.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rescale(d: AppData): AppData {
  for (const c of Object.values(d.checkins)) {
    for (const part of [c.morning, c.evening]) {
      if (!part) continue;
      const e = to5(part.energy); if (e !== undefined) part.energy = e;
      const s = to5(part.stress); if (s !== undefined) part.stress = s;
    }
  }
  for (const a of Object.values(d.lifewheel)) {
    for (const map of [a.answers, a.summary]) {
      for (const k of Object.keys(map)) { const v = to5(map[k]); if (v !== undefined) map[k] = v; }
    }
  }
  return d;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrate(all: Record<string, any>): Record<string, Checkin> {
  const out: Record<string, Checkin> = {};
  for (const [k, c] of Object.entries(all)) {
    out[k] = c && c.mood !== undefined && !c.morning && !c.evening
      ? {
          date: c.date,
          morning: { mood: c.mood, energy: c.energy, stress: c.stress, body: c.body ?? [], note: "" },
          evening: { good: c.good ?? [], bad: c.bad ?? [], habits: c.habits ?? [], note: c.note ?? "" },
        }
      : c;
  }
  return out;
}

function lesenAus(raw: string | null | undefined): AppData | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && parsed.version === 1 && parsed.checkins
      ? rescale({ ...empty(), ...parsed, checkins: migrate(parsed.checkins) } as AppData)
      : null;
  } catch {
    return null;
  }
}

// Einmal beim Start: die dauerhafte Ablage gewinnt, falls sie mehr Tage kennt.
export async function initStorage(): Promise<void> {
  let lokal: AppData | null = null;
  try {
    lokal = lesenAus(localStorage.getItem(KEY));
  } catch {
    lokal = null;
  }
  const roh = await dbLesen<AppData>();
  const dauerhaft = roh ? lesenAus(JSON.stringify(roh)) : null;
  const tage = (d: AppData | null) => (d ? Object.keys(d.checkins).length : -1);
  cache = tage(dauerhaft) > tage(lokal) ? dauerhaft : (lokal ?? dauerhaft);
  if (cache) {
    try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch { /* ignorieren */ }
  }
}

export function loadData(): AppData {
  if (cache) return cache;
  try {
    cache = lesenAus(localStorage.getItem(KEY)) ?? empty();
  } catch {
    cache = empty();
  }
  return cache;
}

export function saveData(data: AppData): void {
  cache = data;
  const text = JSON.stringify(data);
  localStorage.setItem(KEY, text); // wirft bei vollem Speicher, das meldet die Oberfläche
  void dbSchreiben(data);
}

export function exportJson(): string {
  return JSON.stringify(loadData(), null, 2);
}

export function dateiname(): string {
  return `bei-mir-sicherung-${dateKey(new Date())}.json`;
}

export function clearAll(): void {
  cache = null;
  try { localStorage.removeItem(KEY); } catch { /* ignorieren */ }
  try { localStorage.removeItem(SICHERUNG); } catch { /* ignorieren */ }
  void dbLeeren();
}

export function letzteSicherung(): string | null {
  try { return localStorage.getItem(SICHERUNG); } catch { return null; }
}

export function sicherungNotiert(): void {
  try { localStorage.setItem(SICHERUNG, new Date().toISOString()); } catch { /* ignorieren */ }
}

// Prüft, ob eine Sicherung ansteht: nach vierzehn Tagen oder wenn es noch nie eine gab.
export function sicherungFaellig(): boolean {
  const d = loadData();
  if (Object.keys(d.checkins).length === 0) return false;
  const letzte = letzteSicherung();
  if (!letzte) return true;
  return Date.now() - new Date(letzte).getTime() > 14 * 24 * 60 * 60 * 1000;
}

// Liest eine Sicherungsdatei ein und ersetzt die vorhandenen Daten.
export function importieren(text: string): AppData {
  const geladen = lesenAus(text);
  if (!geladen) throw new Error("Die Datei passt nicht zu dieser App.");
  saveData(geladen);
  return geladen;
}

export function dateKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const t = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${t}`;
}

// Woche beginnt am Montag.
export function mondayOf(d: Date): Date {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  r.setDate(r.getDate() - ((r.getDay() + 6) % 7));
  return r;
}

export function saveDay(key: string, patch: Partial<Omit<Checkin, "date">>): void {
  const d = loadData();
  d.checkins[key] = { ...d.checkins[key], ...patch, date: key };
  saveData(d);
}

export function updateData(fn: (d: AppData) => void): void {
  const d = loadData();
  fn(d);
  saveData(d);
}

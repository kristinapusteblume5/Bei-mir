// Zeitfenster: Morgen ab 5:00, Abend ab 18:00 (weiche Sperre, der Hinweis lässt sich überspringen).
export const MORNING_FROM = 5;
export const EVENING_FROM = 18;
// Auf der Heute-Seite löst die Abendkachel die Morgenroutine schon ab 17 Uhr ab.
export const EVENING_TILE_FROM = 17;
export type Slot = "morning" | "evening";

export function eveningTile(now = new Date()): boolean {
  const h = now.getHours();
  return h >= EVENING_TILE_FROM || h < MORNING_FROM;
}

export function isOpen(slot: Slot, now = new Date()): boolean {
  const h = now.getHours();
  return slot === "morning" ? h >= MORNING_FROM : h >= EVENING_FROM || h < MORNING_FROM;
}

// Vor 5:00 Uhr gehört der Abend-Review noch zum Vortag.
export function activeDate(now = new Date()): Date {
  const d = new Date(now);
  if (d.getHours() < MORNING_FROM) d.setDate(d.getDate() - 1);
  return d;
}

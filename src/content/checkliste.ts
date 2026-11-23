import type { ChecklistItem } from "../lib/storage";

// Startvorschläge. Du kannst sie auf der Heute-Seite ändern, ergänzen oder löschen.
export const DEFAULT_CHECKLISTE: ChecklistItem[] = [
  { id: "c1", text: "Genug getrunken" },
  { id: "c2", text: "An die frische Luft" },
  { id: "c3", text: "Etwas nur für mich" },
  { id: "c4", text: "Handy bewusst weggelegt" },
];

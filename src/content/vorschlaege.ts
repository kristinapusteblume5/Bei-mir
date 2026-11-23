import type { Morning } from "../lib/storage";

export interface Option { label: string; to: string }
export interface Tipp {
  id: string;
  ueberschrift: string;
  satz: string;
  optionen: Option[];
}

// Aus dem Morgen-Check-in wird ein Vorschlag abgeleitet.
// Die erste Regel, die passt, gewinnt. Es ist ein Angebot, keine Aufgabe.
const REGELN: { id: string; trifft: (m: Morning) => boolean; tipp: Omit<Tipp, "id"> }[] = [
  {
    id: "stress",
    trifft: (m) => m.stress >= 4,
    tipp: {
      ueberschrift: "Viel Druck heute",
      satz: "Spannung geht leichter über den Körper raus als über den Kopf.",
      optionen: [
        { label: "Sport oder Kettlebell", to: "/routine/kettlebell" },
        { label: "Schütteln, eine Minute", to: "/support/gestresst/schuetteln" },
      ],
    },
  },
  {
    id: "muede",
    trifft: (m) => m.energy <= 2,
    tipp: {
      ueberschrift: "Wenig Energie",
      satz: "Kleine Bewegung bringt oft mehr zurück als Ausruhen.",
      optionen: [
        { label: "Kurzer Spaziergang", to: "/support/erschoepft/spaziergang" },
        { label: "Zu einem Lieblingslied tanzen", to: "/support/wuetend/tanzen" },
      ],
    },
  },
  {
    id: "stimmung",
    trifft: (m) => m.mood <= 2,
    tipp: {
      ueberschrift: "Heute fühlt es sich schwer an",
      satz: "Mit anderen zu sein hilft oft mehr, als man vorher denkt.",
      optionen: [
        { label: "Jemanden anrufen", to: "/support/unverbunden" },
        { label: "Raus, ins Café oder an die Luft", to: "/support/unverbunden/spaziergang" },
      ],
    },
  },
  {
    id: "angespannt",
    trifft: (m) => m.body.includes("angespannt") || m.body.includes("schmerzhaft"),
    tipp: {
      ueberschrift: "Dein Körper meldet sich",
      satz: "Etwas Dehnung oder Beine hoch, mehr braucht es gerade nicht.",
      optionen: [
        { label: "Stretching", to: "/routine/stretching" },
        { label: "Beine hochlagern", to: "/support/erschoepft/beinehoch" },
      ],
    },
  },
  {
    id: "unruhig",
    trifft: (m) => m.body.includes("unruhig"),
    tipp: {
      ueberschrift: "Unruhe im Körper",
      satz: "Erst rauslassen, dann runterkommen.",
      optionen: [
        { label: "Tanzen", to: "/support/wuetend/tanzen" },
        { label: "Ruhig atmen", to: "/support/gestresst/ausatmen" },
      ],
    },
  },
  {
    id: "gut",
    trifft: () => true,
    tipp: {
      ueberschrift: "Gute Ausgangslage",
      satz: "Nimm dir etwas vor, auf das du dich heute freust.",
      optionen: [
        { label: "Kettlebell-Workout", to: "/routine/kettlebell" },
        { label: "Erkenntnis festhalten", to: "/" },
      ],
    },
  },
];

export function tippFuer(m: Morning): Tipp {
  const regel = REGELN.find((r) => r.trifft(m)) ?? REGELN[REGELN.length - 1];
  return { id: regel.id, ...regel.tipp };
}

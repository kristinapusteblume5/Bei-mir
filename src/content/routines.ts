import type { RoutineStep } from "../lib/storage";

// Zwei feste Abläufe. Jeder Schritt hat eine Art, die bestimmt, was die App anzeigt:
// Anleitung, Musik im Hintergrund, Video oder der Check-in.
export const DEFAULT_ROUTINES: Record<string, RoutineStep[]> = {
  morning: [
    {
      id: "m1", text: "Bodyscan", kind: "guided", dauer: 300,
      hint: "Einmal durch den Körper wandern, von den Füßen bis zum Kopf.",
      anleitung: [
        "Leg oder setz dich bequem hin. Die Augen dürfen offen oder geschlossen sein.",
        "Spür zuerst deine Füße. Wie fühlen sie sich an? Schwer, leicht, warm, kalt?",
        "Wandere langsam nach oben: Unterschenkel, Knie, Oberschenkel.",
        "Weiter zu Becken, Bauch und Rücken. Du musst nichts verändern, nur wahrnehmen.",
        "Dann Brust, Schultern, Arme, Hände.",
        "Zum Schluss Nacken, Gesicht und Kopf.",
        "Spür einen Moment deinen ganzen Körper und komm in deinem Tempo zurück.",
      ],
    },
    {
      id: "m2", text: "Dankbarkeit", kind: "audio", audio: "/audio/morgen-jazz.mp3", dauer: 180,
      hint: "Ein kurzer Moment mit Musik.",
      impuls: "Was möchte ich heute einladen?",
      anleitung: [
        "Starte die Musik, wenn du magst.",
        "Denk an eine Sache, für die du heute dankbar bist. Eine reicht.",
        "Dann die Frage: Was möchte ich heute einladen? Mehr Ruhe, mehr Leichtigkeit, mehr Mut?",
        "Du darfst es aufschreiben oder einfach denken.",
      ],
    },
    {
      id: "m3", text: "Morgenübungen", kind: "video",
      hint: "Dein Video mit den Übungen für den Morgen.",
    },
    {
      id: "m4", text: "Bewusster Kaffee", kind: "guided", dauer: 300,
      hint: "Trinken, ohne nebenbei etwas anderes zu tun.",
      anleitung: [
        "Mach dir deinen Kaffee oder Tee in Ruhe.",
        "Setz dich hin. Handy liegt woanders.",
        "Nimm den Geruch wahr, die Wärme der Tasse, den ersten Schluck.",
        "Trink so lange, wie es dir guttut.",
      ],
    },
  ],
  evening: [
    {
      id: "e1", text: "Breathing", kind: "exercise", exercise: "ausatmen",
      hint: "Ruhig ein, etwas länger aus.",
    },
    {
      id: "e2", text: "Dankbarkeitsmomente", kind: "audio", audio: "/audio/abend-piano.mp3", dauer: 300,
      hint: "Drei Momente des Tages, mit Klaviermusik.",
      impuls: "Welche drei Momente von heute möchte ich behalten?",
      anleitung: [
        "Starte die Musik, wenn du magst.",
        "Geh den Tag in Gedanken durch.",
        "Such drei Momente, die gut waren. Sie dürfen klein sein.",
        "Bleib bei jedem kurz, bevor du weitergehst.",
      ],
    },
    {
      id: "e3", text: "Handy in den Flugmodus", kind: "guided", dauer: 60,
      hint: "Der Tag ist jetzt zu Ende.",
      anleitung: [
        "Stell dein Handy auf Flugmodus.",
        "Leg es außer Reichweite, am besten in einen anderen Raum.",
        "Nimm wahr, wie sich das anfühlt.",
      ],
    },
  ],
};

export const DEFAULT_VIDEOS: Record<string, string> = {
  morning: "/videos/morgen.mp4",
  evening: "/videos/abend.mp4",
};

export const DEFAULT_FAVORITES = ["doppelseufzer", "beinehoch"];

// Zwei weitere Abläufe ohne feste Uhrzeit.
DEFAULT_ROUTINES.kettlebell = [
  {
    id: "k1", text: "Aufwärmen", kind: "guided", dauer: 180,
    hint: "Kreisen, lockern, Puls hochbringen.",
    anleitung: [
      "Schultern und Hüfte je zehnmal kreisen.",
      "Zwanzig lockere Kniebeugen ohne Gewicht.",
      "Arme schwingen, bis der Körper warm ist.",
    ],
  },
  {
    id: "k2", text: "Kettlebell Swings", kind: "guided", dauer: 300,
    hint: "Aus der Hüfte, nicht aus den Armen.",
    anleitung: [
      "Füße etwas weiter als hüftbreit, Kettlebell vor dir.",
      "Rücken lang, Hüfte nach hinten schieben, dann kraftvoll nach vorn.",
      "Die Kugel schwingt bis Brusthöhe, die Arme bleiben locker.",
      "Zehn bis fünfzehn Wiederholungen, dann Pause. Drei bis vier Durchgänge.",
    ],
  },
  {
    id: "k3", text: "Goblet Squats", kind: "guided", dauer: 240,
    hint: "Kettlebell vor der Brust, tief und langsam.",
    anleitung: [
      "Halte die Kettlebell mit beiden Händen vor der Brust.",
      "Geh so tief in die Hocke, wie es sich gut anfühlt.",
      "Fersen bleiben am Boden, der Rücken bleibt lang.",
      "Acht bis zwölf Wiederholungen, drei Durchgänge.",
    ],
  },
  {
    id: "k4", text: "Schulterdrücken", kind: "guided", dauer: 240,
    hint: "Eine Seite nach der anderen.",
    anleitung: [
      "Kettlebell auf Schulterhöhe, Ellenbogen nah am Körper.",
      "Nach oben drücken, ohne ins Hohlkreuz zu gehen.",
      "Langsam absenken.",
      "Sechs bis zehn Wiederholungen je Seite, zwei bis drei Durchgänge.",
    ],
  },
  {
    id: "k5", text: "Ausklang", kind: "guided", dauer: 180,
    hint: "Runterkommen und locker machen.",
    anleitung: [
      "Geh ein paar Schritte und lass den Atem ruhiger werden.",
      "Schüttle Arme und Beine aus.",
      "Dehne kurz, was sich fest anfühlt.",
    ],
  },
];

DEFAULT_ROUTINES.stretching = [
  {
    id: "s1", text: "Nacken und Schultern", kind: "guided", dauer: 180,
    hint: "Langsam, ohne zu ziehen.",
    anleitung: [
      "Kopf sanft zur Seite neigen, die Gegenhand bleibt locker.",
      "Dreißig Sekunden halten, dann die Seite wechseln.",
      "Schultern ein paar Mal kreisen.",
    ],
  },
  {
    id: "s2", text: "Brust und Rücken", kind: "guided", dauer: 180,
    hint: "Öffnen und runden im Wechsel.",
    anleitung: [
      "Hände hinter dem Rücken falten und die Brust öffnen.",
      "Dann den Rücken rund machen, Kinn zur Brust.",
      "Im Atemrhythmus ein paar Mal wechseln.",
    ],
  },
  {
    id: "s3", text: "Hüfte", kind: "guided", dauer: 240,
    hint: "Ausfallschritt, Becken sinken lassen.",
    anleitung: [
      "Großer Ausfallschritt, hinteres Knie darf auf einer Decke liegen.",
      "Becken leicht nach vorn schieben, bis es zieht, aber nicht schmerzt.",
      "Dreißig bis sechzig Sekunden halten, dann die Seite wechseln.",
    ],
  },
  {
    id: "s4", text: "Beinrückseite", kind: "guided", dauer: 240,
    hint: "Knie dürfen weich bleiben.",
    anleitung: [
      "Im Sitzen ein Bein lang strecken, das andere anwinkeln.",
      "Mit langem Rücken nach vorn kommen.",
      "Dreißig bis sechzig Sekunden halten, dann die Seite wechseln.",
    ],
  },
  {
    id: "s5", text: "Ausruhen", kind: "guided", dauer: 180,
    hint: "Zum Schluss nichts tun.",
    anleitung: [
      "Leg dich auf den Rücken, Beine angestellt oder hochgelagert.",
      "Atme ruhig und spür nach.",
      "Bleib, solange es guttut.",
    ],
  },
];

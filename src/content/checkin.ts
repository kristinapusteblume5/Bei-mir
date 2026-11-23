export interface Option { id: string; label: string }

// Reihenfolge = Wert 1 bis 5 (Mood)
export const MOODS = ["Schlecht", "Eher schlecht", "Okay", "Gut", "Sehr gut"];

export const BODY: Option[] = [
  { id: "entspannt", label: "Entspannt" }, { id: "angespannt", label: "Angespannt" },
  { id: "muede", label: "Müde" }, { id: "unruhig", label: "Unruhig" },
  { id: "schwer", label: "Schwer" }, { id: "schmerzhaft", label: "Schmerzhaft" },
  { id: "energiegeladen", label: "Gut und energiegeladen" },
];

export const GOOD: Option[] = [
  { id: "zeit", label: "Ich hatte Zeit für mich" }, { id: "draussen", label: "Ich war draußen" },
  { id: "bewegt", label: "Ich habe mich bewegt" }, { id: "begegnungen", label: "Ich hatte schöne Begegnungen" },
  { id: "kreativ", label: "Ich war kreativ" }, { id: "entspannt", label: "Ich konnte entspannen" },
  { id: "geschafft", label: "Ich habe etwas geschafft" }, { id: "gesorgt", label: "Ich habe gut für mich gesorgt" },
];

export const BAD: Option[] = [
  { id: "stress", label: "Zu viel Stress" }, { id: "aufgaben", label: "Zu viele Aufgaben" },
  { id: "bewegung", label: "Zu wenig Bewegung" }, { id: "zeit", label: "Zu wenig Zeit für mich" },
  { id: "medien", label: "Zu viel Handy/Medien" }, { id: "konflikte", label: "Konflikte" },
  { id: "schlaf", label: "Schlechter Schlaf" }, { id: "pausen", label: "Zu wenig Pausen" },
  { id: "beduerfnisse", label: "Ich habe meine Bedürfnisse ignoriert" },
];

export const HABITS: Option[] = [
  { id: "bewegung", label: "Sport / Bewegung" }, { id: "draussen", label: "Zeit draußen / Natur" },
  { id: "metime", label: "Me-Time" }, { id: "kreativitaet", label: "Kreativität" },
];

import { AREAS } from "./lifewheel";

// Ideen, wie sich ein Lebensbereich stärken lässt. Allgemeine Vorschläge, keine Vorschriften
// und keine Aussagen über deine Daten.
export const AREA_IMPULSE: Record<string, string[]> = {
  sport: [
    "Einen festen Zeitpunkt für Bewegung setzen statt auf Lust zu warten",
    "Spätestens nach einer Stunde Sitzen kurz aufstehen und strecken",
    "Eine Bewegungsform suchen, die dir Freude macht, nicht nur Pflicht ist",
  ],
  ernaehrung: [
    "Einmal in der Woche in Ruhe kochen, ohne Zeitdruck",
    "Ein Gericht auf Vorrat kochen, damit müde Tage leichter werden",
    "Beim Essen sitzen bleiben und den Bildschirm weglassen",
  ],
  mental: [
    "Gedanken aufschreiben, statt sie im Kopf zu drehen",
    "Einen Termin mit dir selbst einplanen, an dem nichts passieren muss",
    "Wenn es viel ist: mit jemandem reden, der zuhört, ohne zu lösen",
  ],
  liebe: [
    "Einen Abend ohne Ablenkung einplanen, Handys bleiben weg",
    "Aussprechen, was du dir gerade wünschst, statt zu hoffen, dass es bemerkt wird",
    "Eine kleine Geste am Tag, die nichts kostet",
  ],
  freundschaft: [
    "Einer Person diese Woche ohne Anlass schreiben",
    "Eine Verabredung festmachen statt sie zu vertagen",
    "Ein Gespräch führen, in dem du auch von dir erzählst",
  ],
  beruf: [
    "Eine Aufgabe benennen, die dir Energie gibt, und ihr mehr Raum geben",
    "Grenzen festlegen, zum Beispiel ein fester Feierabend",
    "Das Gespräch suchen, wenn etwas dauerhaft nicht passt",
  ],
  finanzen: [
    "Einen Überblick über feste Ausgaben machen, ohne zu bewerten",
    "Einen kleinen Betrag automatisch zur Seite legen lassen",
    "Eine größere Entscheidung in Ruhe und mit Zahlen vorbereiten",
  ],
  kreativitaet: [
    "Etwas anfangen, das niemand sehen muss",
    "Material sichtbar liegen lassen, damit die Hürde kleiner wird",
    "Eine halbe Stunde einplanen, ohne Ergebnis im Kopf",
  ],
  spiritualitaet: [
    "Jeden Tag ein paar Minuten Stille, ohne Handy",
    "Draußen sein und einfach schauen, ohne Ziel",
    "Aufschreiben, was dir Sinn gibt, und ab und zu nachlesen",
  ],
  entwicklung: [
    "Eine Frage sammeln, die dich wirklich interessiert, und ihr nachgehen",
    "Einmal am Tag etwas absagen oder Nein sagen, wenn es nicht passt",
    "Zurückschauen, was sich in einem Jahr verändert hat",
  ],
  freizeit: [
    "Zwei feste Zeitfenster pro Woche nur für dich blocken",
    "Etwas anfangen, das niemand sehen muss",
    "Eine Sache im Alltag streichen, die du aus Gewohnheit machst",
  ],
};

export const areaName = (id: string) => AREAS.find((a) => a.id === id)?.name ?? id;

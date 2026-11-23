export interface Frage { id: string; text: string }
export interface Area { id: string; name: string; short: string; fragen: Frage[]; tiefer: string }

// Acht Lebensbereiche mit mehreren Fragen. Gefragt wird nach dem Erleben
// der letzten Wochen, nicht nach einem einzelnen Tag.
export const AREAS: Area[] = [
  {
    id: "sport", name: "Sport und Bewegung", short: "Sport",
    tiefer: "Welche Bewegung würde mir gerade guttun?",
    fragen: [
      { id: "spo1", text: "Wie zufrieden bist du mit der Bewegung in deinem Alltag?" },
      { id: "spo2", text: "Hast du das Gefühl, ausreichend Energie für deinen Alltag zu haben?" },
      { id: "spo3", text: "Wie gut gelingt es dir, auf die Signale und Bedürfnisse deines Körpers zu hören?" },
    ],
  },
  {
    id: "ernaehrung", name: "Ernährung und Kochen", short: "Ernährung",
    tiefer: "Was würde mir das Essen im Alltag leichter machen?",
    fragen: [
      { id: "ern1", text: "Wie zufrieden bist du damit, wie du dich zurzeit ernährst?" },
      { id: "ern2", text: "Nimmst du dir Zeit zum Kochen und Essen?" },
      { id: "ern3", text: "Fühlst du dich nach dem Essen meistens gut versorgt?" },
    ],
  },
  {
    id: "mental", name: "Mentale Gesundheit und innere Balance", short: "Mental",
    tiefer: "Was beschäftigt mich innerlich am häufigsten?",
    fragen: [
      { id: "men1", text: "Wie zufrieden bist du mit deinem aktuellen mentalen Wohlbefinden?" },
      { id: "men2", text: "Wie gut gelingt es dir, mit Stress und schwierigen Situationen umzugehen?" },
      { id: "men3", text: "Hast du das Gefühl, ausreichend Ruhe und Ausgeglichenheit in deinem Alltag zu finden?" },
    ],
  },
  {
    id: "liebe", name: "Liebe", short: "Liebe",
    tiefer: "Was wünsche ich mir in diesem Bereich gerade am meisten?",
    fragen: [
      { id: "lie1", text: "Wie zufrieden bist du mit deinem Liebesleben?" },
      { id: "lie2", text: "Hast du das Gefühl, emotional die Nähe und Verbundenheit zu erleben, die du dir wünschst?" },
    ],
  },
  {
    id: "freundschaft", name: "Freundschaft und Verbindung", short: "Freundschaft",
    tiefer: "Welche Beziehung möchte ich mehr pflegen?",
    fragen: [
      { id: "fre1", text: "Wie zufrieden bist du mit der Qualität deiner sozialen Beziehungen?" },
      { id: "fre2", text: "Hast du Menschen in deinem Leben, auf die du dich verlassen kannst?" },
      { id: "fre3", text: "Hast du ausreichend Zeit für die Menschen, die dir wichtig sind?" },
      { id: "fre4", text: "Wie verbunden fühlst du dich mit anderen?" },
    ],
  },
  {
    id: "beruf", name: "Beruf und persönliche Erfüllung", short: "Beruf",
    tiefer: "Was müsste sich ändern, damit Arbeit sich leichter anfühlt?",
    fragen: [
      { id: "ber1", text: "Wie zufrieden bist du mit deiner aktuellen beruflichen Situation?" },
      { id: "ber2", text: "Hast du das Gefühl, dass deine Arbeit zu deinen Fähigkeiten und Interessen passt?" },
      { id: "ber3", text: "Erlebst du in deinem Alltag ausreichend Wertschätzung und Sinn in dem, was du tust?" },
    ],
  },
  {
    id: "finanzen", name: "Finanzen und Sicherheit", short: "Finanzen",
    tiefer: "Was würde mir hier mehr Sicherheit geben?",
    fragen: [
      { id: "fin1", text: "Wie zufrieden bist du mit deiner aktuellen finanziellen Situation?" },
      { id: "fin2", text: "Hast du das Gefühl, finanziell ausreichend abgesichert zu sein?" },
      { id: "fin3", text: "Kannst du dir die Dinge ermöglichen, die dir im Leben wichtig sind?" },
    ],
  },
  {
    id: "entwicklung", name: "Persönliche Entwicklung und Selbstliebe", short: "Entwicklung",
    tiefer: "Woran merke ich, dass ich mich übergehe?",
    fragen: [
      { id: "ent1", text: "Wie zufrieden bist du mit der Beziehung, die du zu dir selbst hast?" },
      { id: "ent2", text: "Hast du das Gefühl, dich persönlich weiterzuentwickeln und deinen eigenen Weg zu gehen?" },
      { id: "ent3", text: "Wie gut gelingt es dir, deine eigenen Bedürfnisse ernst zu nehmen und Grenzen zu setzen?" },
    ],
  },
  {
    id: "kreativitaet", name: "Kreativität", short: "Kreativität",
    tiefer: "Was hält mich davon ab, kreativ zu sein?",
    fragen: [
      { id: "kre1", text: "Wie viel Raum hat Kreativität gerade in deinem Leben?" },
      { id: "kre2", text: "Kommst du ins Tun, ohne dass ein Ergebnis zählen muss?" },
      { id: "kre3", text: "Wie zufrieden bist du mit deinem kreativen Ausdruck?" },
    ],
  },
  {
    id: "spiritualitaet", name: "Spiritualität", short: "Spiritualität",
    tiefer: "Was gibt mir gerade Halt?",
    fragen: [
      { id: "spi1", text: "Fühlst du dich mit etwas verbunden, das größer ist als du?" },
      { id: "spi2", text: "Nimmst du dir Zeit für Stille, Meditation oder Gebet?" },
      { id: "spi3", text: "Hast du das Gefühl, Sinn in deinem Leben zu spüren?" },
    ],
  },
  {
    id: "freizeit", name: "Freizeit und Lebensqualität", short: "Freizeit",
    tiefer: "Worauf möchte ich mich öfter freuen?",
    fragen: [
      { id: "frz1", text: "Wie zufrieden bist du mit deiner Freizeit und der Zeit, die dir für dich selbst bleibt?" },
      { id: "frz2", text: "Hast du ausreichend schöne Momente und Dinge in deinem Alltag, auf die du dich freust?" },
      { id: "frz3", text: "Hast du das Gefühl, dein Leben wirklich zu genießen und nicht nur zu funktionieren?" },
    ],
  },
];

export const VALUES: { id: string; name: string; questions: Frage[] }[] = [
  { id: "kreativitaet", name: "Kreativität", questions: [
    { id: "wert-kreativ-1", text: "Habe ich mir Raum für Kreativität genommen?" },
    { id: "wert-kreativ-2", text: "Gab es Momente, in denen ich ganz im Moment war?" } ] },
  { id: "verbundenheit", name: "Verbundenheit", questions: [
    { id: "wert-verb-1", text: "Habe ich mich mit mir selbst verbunden gefühlt?" },
    { id: "wert-verb-2", text: "Habe ich meine Beziehungen bewusst gepflegt?" } ] },
  { id: "wachstum", name: "Wachstum", questions: [
    { id: "wert-wachs-1", text: "Habe ich etwas Neues gelernt oder ausprobiert?" },
    { id: "wert-wachs-2", text: "Habe ich mich persönlich weiterentwickelt?" } ] },
];

export const VALUE_CHOICES = ["Gar nicht", "Wenig", "Teils", "Ziemlich", "Sehr"];

// Durchschnitt der beantworteten Fragen eines Bereichs, auf eine Nachkommastelle.
export function areaAverage(answers: Record<string, number>, area: Area): number | null {
  const vals = area.fragen.map((f) => answers[f.id]).filter((v): v is number => typeof v === "number");
  if (vals.length === 0) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

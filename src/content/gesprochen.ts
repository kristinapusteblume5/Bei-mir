// Hier schreibst du die Texte, die während einer Übung vorgelesen werden.
//
// So funktioniert es:
//   gesprochen: Jeder Satz wird einzeln gesprochen. Die Sätze verteilen sich
//               gleichmäßig über die Dauer der Übung. Fünf Sätze bei fünf
//               Minuten heißt also etwa alle sechzig Sekunden ein Satz.
//   stimme:     Optional. Pfad zu einer eigenen Aufnahme unter public/audio/stimme/.
//               Gibt es eine Aufnahme, wird sie statt der Gerätestimme gespielt.
//   musik:      Optional. Pfad zu Musik unter public/audio/. Sie startet mit dem Timer
//               und läuft leise im Hintergrund weiter.
//
// Du musst nichts ausfüllen. Was hier fehlt, nutzt die Schritte der Übung.

export interface Text {
  gesprochen?: string[];
  stimme?: string;
  musik?: string;
}

export const TEXTE: Record<string, Text> = {
  doppelseufzer: {
    gesprochen: [
      "Komm an. Setz oder stell dich so hin, wie es bequem ist.",
      "Atme durch die Nase ein. Und gleich noch einmal kurz nach.",
      "Jetzt lang und locker durch den Mund ausatmen.",
      "Noch einmal. Zweimal ein durch die Nase.",
      "Und lang aus. Lass die Schultern dabei sinken.",
      "Spür einen Moment nach, wie es sich jetzt anfühlt.",
    ],
    musik: "/audio/ruhe.mp3",
  },

  ruhigatmen: {
    gesprochen: [
      "Setz oder leg dich bequem hin.",
      "Atme so, wie du es gewohnt bist. Nichts muss sich ändern.",
      "Folge dem Atem ein paar Züge lang mit deiner Aufmerksamkeit.",
      "Wenn Gedanken kommen, lass sie vorbeiziehen.",
      "Komm sanft zum Atem zurück.",
      "Bleib noch einen Moment und komm dann in deinem Tempo zurück.",
    ],
    musik: "/audio/ruhe.mp3",
  },

  // Weitere Übungen nach demselben Muster, zum Beispiel:
  // schuetteln: { gesprochen: ["...", "..."], musik: "/audio/ruhe.mp3" },
};

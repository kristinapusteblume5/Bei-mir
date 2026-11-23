export type Group = "arousal" | "low" | "relax";
export interface Exercise {
  id: string; name: string; groups: Group[]; duration: number; // Sekunden
  desc: string; when: string; steps: string[]; breath?: boolean;
  // Optional: eigener Text zum Vorlesen, eigene Sprachaufnahme, eigene Musik.
  // Siehe content/gesprochen.ts
  gesprochen?: string[]; stimme?: string; musik?: string;
}
export interface Medium { label: string; url: string; hinweis?: string }
export interface State {
  id: string; label: string; icon: string; groups: Group[]; uebungen: string[];
  zuspruch?: string; // ruhiger Satz über den Vorschlägen
  frage?: string; // Rückfrage zum Nachspüren
  medien?: Medium[]; // Podcast, Playlist oder anderes zum Anhören
}

export const STATES: State[] = [
  {
    id: "unverbunden", label: "Unverbunden", icon: "circle", groups: ["low", "relax"],
    uebungen: ["umgebung", "butterfly", "spaziergang", "tageslicht", "ruhigatmen"],
    frage: "Mit wem oder was fühlst du dich gerade am wenigsten verbunden?",
    medien: [{
      label: "Folge zum Thema Verbundenheit",
      url: "https://open.spotify.com/episode/0GeQRFXtF1FgOJvZ6NrCbF",
      hinweis: "Podcast auf Spotify",
    }],
  },
  {
    id: "gestresst", label: "Gestresst", icon: "zap", groups: ["arousal"],
    uebungen: ["doppelseufzer", "ausatmen", "box", "schuetteln", "butterfly"],
  },
  {
    id: "ueberfordert", label: "Überfordert", icon: "layers", groups: ["arousal"],
    uebungen: ["doppelseufzer", "boden", "beinewand", "butterfly", "handyweg"],
    frage: "Was davon muss heute wirklich sein? Und was nicht?",
  },
  {
    id: "getrieben", label: "Getrieben", icon: "waves", groups: ["arousal"],
    uebungen: ["handyweg", "ruhepause", "boden", "ausatmen", "spaziergang"],
    zuspruch: "Du musst gerade nirgendwo hin.",
    frage: "Wovor läufst du gerade, und was würde passieren, wenn du stehen bleibst?",
  },
  {
    id: "wuetend", label: "Wütend", icon: "flame", groups: ["arousal"],
    uebungen: ["schreien", "schuetteln", "tanzen", "spaziergang", "abklopfen", "ausatmen"],
    frage: "Vielleicht liegt unter der Wut auch Traurigkeit. Magst du kurz hinschauen?",
  },
  {
    id: "erschoepft", label: "Erschöpft", icon: "battery", groups: ["low", "relax"],
    uebungen: ["beinehoch", "ruhepause", "ruhigatmen", "beinewand", "handyweg"],
    zuspruch: "Du bist genug. Du machst so viel für andere.",
  },
];

export const EXERCISES: Exercise[] = [
  { id: "doppelseufzer", name: "Physiologischer Seufzer (Doppelseufzer)", groups: ["arousal"], duration: 60, breath: true,
    desc: "Zwei kurze Einatmer durch die Nase, dann ein langes, weiches Ausatmen durch den Mund.",
    when: "Wenn du dich angespannt oder aufgedreht fühlst und kurz runterfahren möchtest.",
    steps: ["Setz oder stell dich bequem hin.", "Atme durch die Nase ein und gleich noch einmal kurz nach, ohne dazwischen auszuatmen.", "Atme lang und locker durch den Mund aus.", "Wiederhole das drei- bis fünfmal, in deinem eigenen Tempo."] },
  { id: "ausatmen", name: "Sanfte Atemübung mit verlängertem Ausatmen", groups: ["arousal"], duration: 120, breath: true,
    desc: "Du atmest ruhig ein und etwas länger aus, als du einatmest.",
    when: "Wenn Gedanken kreisen oder du zur Ruhe kommen möchtest.",
    steps: ["Setz dich bequem hin, eine Hand darf auf dem Bauch liegen.", "Atme in einem angenehmen Tempo durch die Nase ein.", "Atme etwas länger aus, zum Beispiel durch leicht geöffnete Lippen. Nichts muss erzwungen werden.", "Mach so weiter, bis du aufhören möchtest."] },
  { id: "box", name: "Box Breathing", groups: ["arousal"], duration: 120, breath: true,
    desc: "Gleich lange Phasen: ein, halten, aus, halten. Du wählst eine Länge, die sich leicht anfühlt.",
    when: "Wenn du einen klaren Rhythmus brauchst, an dem du dich festhalten kannst.",
    steps: ["Wähle eine Zahl, die sich mühelos anfühlt, zum Beispiel vier.", "Atme zählend ein, halte kurz an, atme zählend aus und halte wieder kurz an.", "Wenn Anhalten unangenehm ist, mach die Pausen kürzer oder lass sie weg.", "Wiederhole einige Runden und atme danach wieder, wie du magst."] },
  { id: "schreien", name: "Schreien oder laut ausatmen", groups: ["arousal"], duration: 60,
    desc: "Druck rauslassen, in ein Kissen oder draußen.",
    when: "Wenn Wut im Körper sitzt und raus möchte.",
    steps: ["Such dir einen Ort, an dem du ungestört bist.", "Nimm ein Kissen vor den Mund, wenn es leiser sein soll.", "Atme tief ein und lass den Ton raus, so laut wie er kommen mag.", "Zwei- bis dreimal. Danach ein paar ruhige Atemzüge.", "Wenn Schreien nicht geht: kräftig durch den Mund ausatmen, mit Geräusch."] },
  { id: "schuetteln", name: "Schütteln", groups: ["arousal"], duration: 60,
    desc: "Du schüttelst Arme, Beine und den ganzen Körper locker aus.",
    when: "Wenn sich Anspannung im Körper aufgestaut anfühlt.",
    steps: ["Stell dich hüftbreit hin, die Knie leicht gebeugt.", "Schüttle zuerst die Hände, dann Arme, Schultern und Beine.", "Es darf groß oder klein sein, ganz wie es sich gut anfühlt.", "Bleib danach einen Moment still stehen und spür nach."] },
  { id: "butterfly", name: "Butterfly Tapping", groups: ["arousal", "relax"], duration: 120,
    desc: "Du kreuzt die Arme vor der Brust und tippst abwechselnd links und rechts sanft auf die Oberarme.",
    when: "Wenn du dich aufgewühlt fühlst oder Halt suchst.",
    steps: ["Kreuze die Arme vor der Brust, die Hände liegen auf Schlüsselbein oder Oberarmen.", "Tippe langsam und abwechselnd mit der linken und der rechten Hand.", "Atme ruhig weiter und nimm wahr, was du spürst.", "Hör auf, wenn es sich genug anfühlt."] },
  { id: "boden", name: "Auf den Boden legen", groups: ["arousal"], duration: 180,
    desc: "Du legst dich flach hin und spürst, wie der Boden dich trägt.",
    when: "Wenn dir alles zu viel ist und du festen Untergrund spüren möchtest.",
    steps: ["Leg dich auf den Rücken, auf Teppich oder Matte.", "Lass Arme und Beine locker, die Augen dürfen offen oder geschlossen sein.", "Spür, wo dein Körper den Boden berührt.", "Bleib so lange, wie es sich gut anfühlt, und steh dann in Ruhe auf."] },
  { id: "beinewand", name: "Beine an der Wand hochlagern", groups: ["arousal"], duration: 300,
    desc: "Du legst die Beine entspannt an der Wand hoch.",
    when: "Wenn du dich schwer oder unruhig fühlst und etwas Ruhe möchtest.",
    steps: ["Leg dich auf den Rücken, mit dem Gesäß nah an einer Wand.", "Lagere die Beine an der Wand, sodass es bequem ist. Ein Kissen unter dem Becken ist erlaubt.", "Atme ruhig und lass die Arme locker liegen.", "Wenn dir etwas unangenehm wird, nimm die Beine einfach wieder herunter."] },
  { id: "tageslicht", name: "Tageslicht", groups: ["low"], duration: 300,
    desc: "Du gehst ans Fenster oder nach draußen und lässt Tageslicht auf dich wirken.",
    when: "Wenn du müde oder träge bist.",
    steps: ["Geh ans offene Fenster, auf den Balkon oder vor die Tür.", "Schau Richtung Himmel, nicht direkt in die Sonne.", "Atme ein paar Mal in Ruhe und spür die Luft.", "Bleib ein paar Minuten."] },
  { id: "bewegung", name: "Sanfte Bewegung", groups: ["low"], duration: 180,
    desc: "Du bewegst dich locker, zum Beispiel mit Kreisen von Schultern, Armen und Hüfte.",
    when: "Wenn du dich steif oder energielos fühlst.",
    steps: ["Steh auf und lass die Schultern langsam kreisen.", "Bewege Arme, Hüfte und Nacken in deinem Tempo.", "Probiere aus, was sich gerade angenehm anfühlt.", "Hör auf, wenn du genug hast."] },
  { id: "strecken", name: "Strecken und Gähnen", groups: ["low"], duration: 60,
    desc: "Du streckst dich ausgiebig und gähnst, wenn es kommt.",
    when: "Wenn du müde bist oder lange gesessen hast.",
    steps: ["Steh oder sitz aufrecht.", "Streck die Arme nach oben und mach dich lang.", "Gähne, wenn es kommt, oder tu einfach so, als ob.", "Lass die Arme sinken und spür kurz nach."] },
  { id: "abklopfen", name: "Körper abklopfen", groups: ["low"], duration: 120,
    desc: "Du klopfst mit lockeren Händen Arme, Beine und Rumpf sanft ab.",
    when: "Wenn du dich wacher und präsenter im Körper fühlen möchtest.",
    steps: ["Klopf mit lockerer Faust oder flacher Hand die Arme ab.", "Geh weiter über Schultern, Brust, Bauch und Beine.", "Wähle eine Stärke, die angenehm ist.", "Spür danach kurz nach."] },
  { id: "spaziergang", name: "Kurzer Spaziergang", groups: ["low"], duration: 600,
    desc: "Du gehst ohne Ziel eine kleine Runde.",
    when: "Wenn du frische Luft und etwas Abstand brauchst.",
    steps: ["Zieh dir Schuhe an und geh vor die Tür.", "Geh in deinem Tempo, ohne Ziel.", "Nimm Geräusche, Licht und Luft wahr.", "Dreh um, wann du möchtest."] },
  { id: "musik", name: "Aktivierende Musik", groups: ["low"], duration: 240,
    desc: "Du hörst ein Lied, das dich in Schwung bringt.",
    when: "Wenn du etwas Schwung brauchst.",
    steps: ["Such dir ein Lied, bei dem du gern in Bewegung kommst.", "Spiel es etwas lauter, wenn es für dich passt.", "Beweg dich dazu, so viel oder so wenig du magst.", "Hör auf, wenn es genug ist."] },
  { id: "tanzen", name: "Tanzen", groups: ["low"], duration: 240,
    desc: "Ein Lied lang tanzen, wie es gerade kommt.",
    when: "Wenn du Schwung brauchst oder etwas abschütteln möchtest.",
    steps: ["Such dir ein Lied, bei dem du in Bewegung kommst.", "Mach Platz und dreh es so laut auf, wie es passt.", "Beweg dich, wie es kommt. Niemand schaut zu.", "Bleib danach kurz stehen und spür nach."] },
  { id: "umgebung", name: "Bewusste Wahrnehmung der Umgebung", groups: ["low"], duration: 120,
    desc: "Du benennst, was du gerade siehst, hörst und fühlst.",
    when: "Wenn du dich leer oder weit weg fühlst.",
    steps: ["Schau dich um und benenne in Gedanken fünf Dinge, die du siehst.", "Nimm vier Dinge wahr, die du hören kannst.", "Spür drei Dinge, die du berührst, etwa Kleidung oder Untergrund.", "Atme dabei, wie du es gewohnt bist."] },
  { id: "beinehoch", name: "Beine hochlagern", groups: ["relax"], duration: 300,
    desc: "Du legst die Beine bequem hoch, zum Beispiel auf Sofa, Kissen oder Stuhl.",
    when: "Wenn du dich schwer fühlst oder dem Körper etwas Ruhe geben möchtest.",
    steps: ["Leg dich hin und lagere die Beine erhöht.", "Lass Schultern und Gesicht weich werden.", "Atme ruhig und bleib, solange es angenehm ist.", "Nimm die Beine langsam wieder herunter."] },
  { id: "ruhigatmen", name: "Ruhiges Atmen", groups: ["relax"], duration: 120, breath: true,
    desc: "Du lässt den Atem in seinem eigenen Rhythmus fließen und schaust ihm zu.",
    when: "Wenn du ankommen und dich sammeln möchtest.",
    steps: ["Setz oder leg dich bequem hin.", "Atme in deinem natürlichen Rhythmus.", "Folge dem Atem ein paar Züge lang mit deiner Aufmerksamkeit.", "Wenn Gedanken kommen, lass sie vorbeiziehen und kehre sanft zurück."] },
  { id: "dehnung", name: "Sanfte Dehnung", groups: ["relax"], duration: 180,
    desc: "Du dehnst eine Stelle, die sich verspannt anfühlt, langsam und nur so weit, wie es angenehm ist.",
    when: "Wenn Nacken, Schultern oder Rücken sich fest anfühlen.",
    steps: ["Wähle eine Stelle, die Zuwendung möchte, etwa Nacken oder Schultern.", "Dehne sie langsam und nur, bis es angenehm ist.", "Atme dabei weiter.", "Wechsle die Seite oder löse die Dehnung, sobald du magst."] },
  { id: "handyweg", name: "Handy weglegen", groups: ["relax"], duration: 300,
    desc: "Du legst das Handy bewusst beiseite und gönnst dir eine Pause ohne Bildschirm.",
    when: "Wenn du dich überreizt fühlst oder abschalten möchtest.",
    steps: ["Leg das Handy außer Reichweite, am besten in einen anderen Raum.", "Stell es auf lautlos, wenn du magst.", "Tu etwas ohne Bildschirm: Tee trinken oder aus dem Fenster schauen.", "Nimm danach wahr, wie sich das anfühlt."] },
  { id: "ruhepause", name: "Kurze Ruhepause", groups: ["relax"], duration: 300,
    desc: "Du setzt oder legst dich hin und musst gerade nichts tun.",
    when: "Wenn du eine kleine Auszeit brauchst.",
    steps: ["Such dir einen ruhigen Platz.", "Setz oder leg dich hin und schließ die Augen, wenn du magst.", "Du musst nichts tun und nichts erreichen.", "Komm in deinem Tempo wieder zurück."] },
];

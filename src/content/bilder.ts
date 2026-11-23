import type { Scene } from "../components/FloralArt";

// Welches Motiv hinter einer Kachel liegt.
//   "floral"  = gezeichnete Blumengrafik aus dem Code
//   ein Pfad  = dein eigenes Foto, zum Beispiel "/fotos/morgen.jpg"
// Deine alten Fotos liegen weiterhin unter public/fotos/ und lassen sich
// durch Ändern einer Zeile wieder einschalten.
export const MOTIVE: Record<Scene, "floral" | string> = {
  morgen: "/fotos/bilder/lila-strauss.png",
  abend: "/fotos/bilder/gruen-blumen.png",
  kettlebell: "/fotos/bilder/koralle-lavendel.png",
  stretching: "/fotos/bilder/rosa-sonnenblumen.png",
  koerper: "/fotos/bilder/gruen-blumen.png",
  auswertung: "/fotos/bilder/rosa-sonnenblumen.png",
  impuls: "/fotos/bilder/lila-strauss.png",
};

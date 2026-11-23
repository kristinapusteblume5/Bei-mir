import { useState } from "react";
import FloralArt, { type Scene } from "./FloralArt";
import { MOTIVE } from "../content/bilder";

export type { Scene };

// Zeigt die gezeichnete Blumengrafik oder, wenn in content/bilder.ts eingetragen,
// dein eigenes Foto. Fehlt die Datei, erscheint wieder die Grafik.
export default function Photo({ scene }: { scene: Scene }) {
  const motiv = MOTIVE[scene] ?? "floral";
  const [fehlt, setFehlt] = useState(false);
  if (motiv === "floral" || fehlt) return <FloralArt scene={scene} />;
  return (
    <div className="photo" aria-hidden="true">
      <img src={motiv} alt="" loading="lazy" onError={() => setFehlt(true)} />
    </div>
  );
}

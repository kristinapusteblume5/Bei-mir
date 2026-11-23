import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Trash2, Upload } from "lucide-react";
import {
  clearAll, dateiname, exportJson, importieren, letzteSicherung, loadData, sicherungNotiert,
} from "../lib/storage";

export default function Einstellungen() {
  const [stand, setStand] = useState(loadData());
  const [meldung, setMeldung] = useState("");
  const [fehler, setFehler] = useState("");
  const [loeschen, setLoeschen] = useState(false);
  const datei = useRef<HTMLInputElement | null>(null);
  const letzte = letzteSicherung();
  const tage = Object.keys(stand.checkins).length;

  function sichern() {
    try {
      const blob = new Blob([exportJson()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = dateiname();
      a.click();
      URL.revokeObjectURL(url);
      sicherungNotiert();
      setMeldung("Sicherung gespeichert. Leg die Datei an einen Ort, den du wiederfindest.");
      setFehler("");
    } catch {
      setFehler("Die Sicherung ließ sich nicht erzeugen.");
    }
  }

  async function einlesen(f: File) {
    try {
      const neu = importieren(await f.text());
      setStand({ ...neu });
      setMeldung("Daten eingelesen. Deine vorherigen Einträge wurden ersetzt.");
      setFehler("");
    } catch {
      setFehler("Diese Datei konnte nicht gelesen werden. Nimm eine Sicherung aus dieser App.");
    }
  }

  return (
    <>
      <h1>Einstellungen</h1>
      <p className="lead">Deine Daten liegen auf diesem Gerät. Niemand sonst kann sie sehen.</p>

      <h2 className="sub">Sicherung</h2>
      <p>
        {tage === 0
          ? "Noch keine Einträge."
          : `${tage} Tage erfasst.${letzte ? ` Zuletzt gesichert am ${new Date(letzte).toLocaleDateString("de-DE")}.` : " Noch nie gesichert."}`}
      </p>
      <p className="muted">
        Browser räumen gespeicherte Daten manchmal weg, besonders wenn du die App lange nicht öffnest.
        Eine Sicherung ab und zu schützt dich davor.
      </p>
      <div className="actions wrap">
        <button type="button" className="pill" onClick={sichern} disabled={tage === 0}>
          <Download size={16} strokeWidth={2.2} aria-hidden="true" /> Sicherung speichern
        </button>
        <button type="button" className="pill ghost" onClick={() => datei.current?.click()}>
          <Upload size={16} strokeWidth={2.2} aria-hidden="true" /> Sicherung einlesen
        </button>
        <input ref={datei} type="file" accept="application/json,.json" hidden
          onChange={(e) => { const f = e.target.files?.[0]; if (f) void einlesen(f); e.target.value = ""; }} />
      </div>

      <h2 className="sub">Auf dem Handy behalten</h2>
      <p className="muted">
        Leg die App auf deinen Startbildschirm. Dann behandelt das Handy sie wie eine echte App und
        löscht die Daten nicht von allein. In Safari: Teilen, dann „Zum Home-Bildschirm“.
      </p>

      <h2 className="sub">Alles löschen</h2>
      <p className="muted">
        Entfernt alle Check-ins, Routinen, Erkenntnisse und Lebensrad-Bewertungen von diesem Gerät.
        Das lässt sich nicht rückgängig machen.
      </p>
      {loeschen ? (
        <div className="actions wrap">
          <button type="button" className="pill ghost" onClick={() => setLoeschen(false)}>Abbrechen</button>
          <button type="button" className="pill loeschen" onClick={() => {
            clearAll();
            setStand({ ...loadData() });
            setLoeschen(false);
            setMeldung("Alle Daten wurden gelöscht.");
          }}>
            Ja, endgültig löschen
          </button>
        </div>
      ) : (
        <button type="button" className="pill ghost" onClick={() => setLoeschen(true)} disabled={tage === 0}>
          <Trash2 size={16} strokeWidth={2.2} aria-hidden="true" /> Alle Daten löschen
        </button>
      )}

      {meldung && <p role="status" className="hinweis">{meldung}</p>}
      {fehler && <p role="alert" className="error">{fehler}</p>}
      <p className="muted"><Link to="/" className="link">Zurück zu Heute</Link></p>
    </>
  );
}

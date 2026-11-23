import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { DEFAULT_CHECKLISTE } from "../content/checkliste";
import { loadData, saveData, type AppData, type ChecklistItem } from "../lib/storage";

// Eigene Punkte zum Abhaken, pro Tag neu. Die Liste selbst bleibt bestehen.
export default function Checkliste({ dayKey }: { dayKey: string }) {
  const [data, setData] = useState<AppData>(loadData);
  const [bearbeiten, setBearbeiten] = useState(false);
  const [neu, setNeu] = useState("");
  const [fehler, setFehler] = useState("");

  const liste: ChecklistItem[] = data.checkliste ?? DEFAULT_CHECKLISTE;
  const erledigt = data.checklistLog?.[dayKey] ?? [];
  const fertig = liste.filter((p) => erledigt.includes(p.id)).length;

  function commit(fn: (d: AppData) => void) {
    try {
      const d = loadData();
      fn(d);
      saveData(d);
      setData({ ...d });
      setFehler("");
    } catch {
      setFehler("Speichern hat nicht geklappt. Prüfe, ob dein Browser lokalen Speicher erlaubt.");
    }
  }
  const abhaken = (id: string) =>
    commit((d) => {
      const log = d.checklistLog ?? {};
      const bisher = log[dayKey] ?? [];
      log[dayKey] = bisher.includes(id) ? bisher.filter((x) => x !== id) : [...bisher, id];
      d.checklistLog = log;
    });
  const aendern = (fn: (l: ChecklistItem[]) => ChecklistItem[]) =>
    commit((d) => { d.checkliste = fn(d.checkliste ?? DEFAULT_CHECKLISTE); });

  return (
    <section className="checkliste">
      <div className="checkliste-kopf">
        <h2 className="sub">Heute abhaken</h2>
        <button type="button" className="linkbtn" onClick={() => setBearbeiten(!bearbeiten)}>
          {bearbeiten ? "Fertig" : "Bearbeiten"}
        </button>
      </div>

      {bearbeiten ? (
        <>
          <ul className="hakenliste">
            {liste.map((p) => (
              <li key={p.id}>
                <input className="textin" aria-label="Punkt" value={p.text}
                  onChange={(e) => aendern((l) => l.map((x) => (x.id === p.id ? { ...x, text: e.target.value } : x)))} />
                <button type="button" className="weg" aria-label={`${p.text} entfernen`}
                  onClick={() => aendern((l) => l.filter((x) => x.id !== p.id))}>
                  <X size={17} strokeWidth={2.4} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <form className="neuzeile" onSubmit={(e) => {
            e.preventDefault();
            const text = neu.trim();
            if (!text) return;
            aendern((l) => [...l, { id: `c${Date.now()}`, text }]);
            setNeu("");
          }}>
            <input className="textin" value={neu} placeholder="Neuer Punkt" aria-label="Neuer Punkt"
              onChange={(e) => setNeu(e.target.value)} />
            <button type="submit" className="pill small" disabled={!neu.trim()}>
              <Plus size={15} strokeWidth={2.6} aria-hidden="true" /> Hinzufügen
            </button>
          </form>
          <button type="button" className="linkbtn" onClick={() => aendern(() => DEFAULT_CHECKLISTE)}>
            Auf die Vorschläge zurücksetzen
          </button>
        </>
      ) : liste.length === 0 ? (
        <p className="muted">Keine Punkte. Über „Bearbeiten“ kannst du welche anlegen.</p>
      ) : (
        <>
          <ul className="hakenliste">
            {liste.map((p) => {
              const an = erledigt.includes(p.id);
              return (
                <li key={p.id}>
                  <button type="button" className={`haken${an ? " an" : ""}`} aria-pressed={an} onClick={() => abhaken(p.id)}>
                    <span className="kasten" aria-hidden="true">{an && <Check size={15} strokeWidth={3} />}</span>
                    <span>{p.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="muted">{fertig} von {liste.length} heute</p>
        </>
      )}
      {fehler && <p role="alert" className="error">{fehler}</p>}
    </section>
  );
}

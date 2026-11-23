import { useState } from "react";
import { STATES } from "../content/exercises";
import { AREAS } from "../content/lifewheel";
import { dateKey, loadData, updateData } from "../lib/storage";
import { activeDate } from "../lib/time";

const FEELINGS = STATES.map((s) => ({
  id: s.id,
  label: s.label.replace(/^Ich (bin|fühle mich|kann mich|möchte) ?/, "").replace(/\.$/, ""),
}));
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Eigene Erkenntnisse festhalten. Die Verschlagwortung ist freiwillig
// und wird in der Auswertung ausgezählt.
export default function InsightBox({ onSaved }: { onSaved?: () => void }) {
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const count = loadData().insights?.length ?? 0;
  const flip = (list: string[], set: (v: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  function save() {
    if (!text.trim()) return;
    try {
      updateData((d) => {
        d.insights = [...(d.insights ?? []), {
          id: `i${Date.now()}`, date: dateKey(activeDate()), text: text.trim(), feelings: tags, areas,
        }];
      });
      setText(""); setTags([]); setAreas([]); setSaved(true); setError("");
      onSaved?.();
    } catch {
      setError("Speichern hat nicht geklappt. Prüfe, ob dein Browser lokalen Speicher erlaubt.");
    }
  }

  return (
    <section className="insightbox">
      <h2 className="sub">Erkenntnis festhalten</h2>
      <label className="field">
        Was ist dir aufgefallen?
        <textarea rows={3} value={text} placeholder="Zum Beispiel: Nach dem Spaziergang war mein Kopf klarer."
          onChange={(e) => setText(e.target.value)} />
      </label>
      <p className="muted">Freiwillig: Womit hing es zusammen?</p>
      <div className="chips small">
        {FEELINGS.map((f) => (
          <button key={f.id} type="button" className={`chip${tags.includes(f.id) ? " on" : ""}`} aria-pressed={tags.includes(f.id)}
            onClick={() => flip(tags, setTags, f.id)}>{cap(f.label)}</button>
        ))}
      </div>
      <div className="chips small">
        {AREAS.map((a) => (
          <button key={a.id} type="button" className={`chip${areas.includes(a.id) ? " on" : ""}`} aria-pressed={areas.includes(a.id)}
            onClick={() => flip(areas, setAreas, a.id)}>{a.short}</button>
        ))}
      </div>
      {error && <p role="alert" className="error">{error}</p>}
      <div className="actions">
        <span className="muted">{saved ? "Gespeichert." : count ? `${count} gesammelt` : ""}</span>
        <button type="button" className="pill" onClick={save} disabled={!text.trim()}>Speichern</button>
      </div>
    </section>
  );
}

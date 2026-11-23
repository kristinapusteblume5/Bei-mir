import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SegmentScale from "../components/SegmentScale";
import { ChoiceRow } from "../components/inputs";
import { AREAS, VALUES, VALUE_CHOICES, areaAverage } from "../content/lifewheel";
import { dateKey, loadData, mondayOf, saveData } from "../lib/storage";

export default function LebensradBewerten() {
  const week = dateKey(mondayOf(new Date()));
  const existing = loadData().lifewheel[week];
  const nav = useNavigate();
  const [answers, setAnswers] = useState<Record<string, number>>(existing?.answers ?? {});
  const [focus, setFocus] = useState<string[]>(existing?.focus ?? []);
  const [values, setValues] = useState<Record<string, number>>(existing?.values ?? {});
  const [notes, setNotes] = useState<Record<string, string>>(existing?.notes ?? {});
  const [openValues, setOpenValues] = useState(false);
  const [error, setError] = useState("");
  const vorher = Object.keys(loadData().lifewheel).length > 0;
  const beantwortet = Object.keys(answers).length;

  const flipFocus = (id: string) => setFocus(focus.includes(id) ? focus.filter((x) => x !== id) : [...focus, id]);

  function save() {
    try {
      const d = loadData();
      // Der Bereichswert ist der Durchschnitt seiner beantworteten Fragen.
      const summary: Record<string, number> = {};
      for (const a of AREAS) {
        const avg = areaAverage(answers, a);
        if (avg !== null) summary[a.id] = avg;
      }
      d.lifewheel[week] = { week, answers, summary, focus, values, notes, savedAt: new Date().toISOString() };
      saveData(d);
      nav("/auswertung/lebensrad");
    } catch {
      setError("Speichern hat nicht geklappt. Prüfe, ob dein Browser lokalen Speicher erlaubt.");
    }
  }

  return (
    <>
      <h1>{vorher ? "Lebensrad neu kalibrieren" : "Lebensrad kalibrieren"}</h1>
      <p className="lead">
        Wie fühlen sich deine Lebensbereiche in den letzten Wochen an? Es geht um den großen Blick, nicht um heute.
        Alle paar Wochen reicht völlig.
        {vorher ? " Beim Nachkalibrieren kommt zu jedem Bereich eine offene Frage dazu." : ""}
      </p>

      {AREAS.map((a, i) => (
        <section key={a.id} className="wheelarea">
          <h2 className="sub">{i + 1}. {a.name}</h2>
          {a.fragen.map((f) => (
            <SegmentScale key={f.id} label={f.text} steps={5} value={answers[f.id]}
              ends={["gar nicht", "voll und ganz"]}
              onChange={(v) => setAnswers({ ...answers, [f.id]: v })} />
          ))}
          {vorher && (
            <label className="field sub-field">
              {a.tiefer}
              <textarea rows={2} value={notes[a.id] ?? ""} onChange={(e) => setNotes({ ...notes, [a.id]: e.target.value })} />
            </label>
          )}
        </section>
      ))}

      <h2 className="sub">Wo möchte ich Energie reinstecken?</h2>
      <p className="muted">Wähle ein bis drei Bereiche. Das ist ein Wunsch, keine Aufgabe.</p>
      <div className="chips">
        {AREAS.map((a) => (
          <button key={a.id} type="button" className={`chip${focus.includes(a.id) ? " on" : ""}`}
            aria-pressed={focus.includes(a.id)} onClick={() => flipFocus(a.id)}>{a.short}</button>
        ))}
      </div>

      <button type="button" className="disclosure" aria-expanded={openValues} onClick={() => setOpenValues(!openValues)}>
        Meine Werte reflektieren (freiwillig) {openValues ? "▴" : "▾"}
      </button>
      {openValues && VALUES.map((v) => (
        <div key={v.id}>
          <h2 className="sub">{v.name}</h2>
          {v.questions.map((q) => (
            <ChoiceRow key={q.id} label={q.text} options={VALUE_CHOICES} value={values[q.id]}
              onChange={(x) => setValues({ ...values, [q.id]: x })} />
          ))}
        </div>
      ))}

      {error && <p role="alert" className="error">{error}</p>}
      <div className="actions">
        <Link to="/auswertung/lebensrad" className="pill ghost">Abbrechen</Link>
        <button type="button" className="pill" onClick={save} disabled={beantwortet === 0}>Speichern</button>
      </div>
      {beantwortet === 0 && <p className="muted">Beantworte mindestens eine Frage, um zu speichern.</p>}
    </>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import DayBars from "../components/DayBars";
import { BAD, GOOD, HABITS } from "../content/checkin";
import { fmt } from "../lib/lifewheel";
import { METRICS, dayValue, factorCounts, habitDays, mean, weekKeys, type Metric } from "../lib/stats";
import { dateKey, loadData, mondayOf, saveData, type AppData, type Checkin } from "../lib/storage";

const QUESTIONS = [
  { id: "energie", text: "Was hat mir diese Woche Energie gegeben?" },
  { id: "kraft", text: "Was hat mich besonders viel Kraft gekostet?" },
  { id: "beibehalten", text: "Was möchte ich beibehalten?" },
  { id: "veraendern", text: "Was möchte ich verändern?" },
  { id: "brauche", text: "Was brauche ich nächste Woche?" },
];
const label = (list: { id: string; label: string }[], id: string) => list.find((o) => o.id === id)?.label ?? id;

export default function Wochenrueckblick() {
  const [data, setData] = useState<AppData>(loadData);
  const [error, setError] = useState("");
  const monday = mondayOf(new Date());
  const week = dateKey(monday);
  const days = weekKeys(monday).map((k) => data.checkins[k]);
  const present = days.filter((c): c is Checkin => Boolean(c));
  const series = (m: Metric) => days.map((c) => (c ? dayValue(c, m) : null));

  function saveReflection(id: string, text: string) {
    try {
      const d = loadData();
      d.reflections[week] = { ...d.reflections[week], [id]: text };
      saveData(d);
      setData({ ...d });
      setError("");
    } catch {
      setError("Speichern hat nicht geklappt. Prüfe, ob dein Browser lokalen Speicher erlaubt.");
    }
  }

  const done = Object.values(data.reflections[week] ?? {}).some((t) => t.trim());

  return (
    <>
      <h1>Wochenrückblick</h1>
      <p className="lead">Ein Blick auf die Woche ab Montag. Antworten sind freiwillig und werden gespeichert.</p>
      {present.length === 0 ? (
        <p className="muted">In dieser Woche gibt es noch keine Einträge.</p>
      ) : (
        <>
          <div className="statrow">
            {METRICS.map((m) => {
              const v = series(m.id).filter((x): x is number => x !== null);
              const a = mean(v);
              return (
                <div key={m.id} className="stat">
                  <span className="stat-label">{m.label}</span>
                  <span className="stat-value">{a === null ? "–" : fmt(a)}<span className="stat-max">/{m.max}</span></span>
                  <span className="muted">{v.length} Tage</span>
                </div>
              );
            })}
          </div>
          {METRICS.map((m) => <DayBars key={m.id} label={m.label} values={series(m.id)} max={m.max} />)}
          <p className="muted">Tageswert = Mittel aus Morgen und Abend, wenn beides erfasst wurde.</p>

          <h2 className="sub">Gewohnheiten</h2>
          <ul className="arealist">
            {HABITS.map((h) => {
              const { done, total } = habitDays(present, h.id);
              return <li key={h.id}><span>{h.label}</span><span className="muted">{total === 0 ? "–" : `${done} von ${total} Tagen`}</span></li>;
            })}
          </ul>

          <h2 className="sub">Gut und belastend</h2>
          {(["good", "bad"] as const).map((kind) => {
            const top = factorCounts(present, kind).slice(0, 3);
            return (
              <p key={kind}>
                <strong>{kind === "good" ? "Gut: " : "Belastend: "}</strong>
                {top.length === 0 ? "keine Angaben" : top.map((t) => `${label(kind === "good" ? GOOD : BAD, t.id)} (${t.count}×)`).join(", ")}
              </p>
            );
          })}
        </>
      )}

      <h2 className="sub">Fragen für diese Woche</h2>
      {true && (
        <div>
          {QUESTIONS.map((q) => (
            <label key={q.id} className="field">
              {q.text}
              <textarea rows={3} value={data.reflections[week]?.[q.id] ?? ""} onChange={(e) => saveReflection(q.id, e.target.value)} />
            </label>
          ))}
        </div>
      )}
      {error && <p role="alert" className="error">{error}</p>}
      <div className="actions">
        <Link to="/" className="pill ghost">Später</Link>
        <Link to="/" className="pill">{done ? "Fertig" : "Schließen"}</Link>
      </div>
      <p className="muted">Deine Antworten speichern sich beim Tippen.</p>
    </>
  );
}

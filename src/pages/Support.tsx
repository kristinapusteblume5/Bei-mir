import { useState } from "react";
import { Link } from "react-router-dom";
import Medienlink from "../components/Medienlink";
import Photo from "../components/Photo";
import type { Scene } from "../components/FloralArt";
import { EXERCISES, STATES } from "../content/exercises";

// Übungskacheln wechseln die Szene, damit nebeneinander stehende Kacheln sich unterscheiden.
const SZENEN: Scene[] = ["morgen", "abend", "kettlebell", "stretching"];

export default function Support() {
  const [pick, setPick] = useState<string | null>(null);
  const state = STATES.find((s) => s.id === pick);
  const list = state
    ? state.uebungen.map((id) => EXERCISES.find((e) => e.id === id)).filter((e): e is NonNullable<typeof e> => Boolean(e))
    : [];

  return (
    <>
      <h1>Support</h1>
      <p className="lead">Wie fühlst du dich gerade?</p>
      <div className="supportspace" />
      <div className="grid state-grid">
        {STATES.map((s, i) => (
          <button key={s.id} type="button" className="tile state-tile" aria-pressed={pick === s.id}
            onClick={() => setPick(pick === s.id ? null : s.id)}>
            <Photo scene={SZENEN[i % SZENEN.length]} />
            <div className="tile-in">
              <h2>{s.label}</h2>
            </div>
          </button>
        ))}
      </div>

      {state && (
        <>
          {state.zuspruch && <p className="zuspruch">{state.zuspruch}</p>}
          {state.frage && <p className="rueckfrage">{state.frage}</p>}
          {state.medien?.map((m) => <Medienlink key={m.url} medium={m} />)}

          <h2 className="sub">Das könnte jetzt guttun</h2>
          <p className="muted">Wähle, was sich stimmig anfühlt, oder nimm nichts davon.</p>
          <div className="grid support-liste">
            {list.map((e, i) => (
              <Link key={e.id} to={`/support/${state.id}/${e.id}`} className="tile">
                <Photo scene={SZENEN[i % SZENEN.length]} />
                <div className="tile-in">
                  <span className="eyebrow">Übung</span>
                  <h2>{e.name}</h2>
                  <p>ca. {Math.max(1, Math.round(e.duration / 60))} Min.</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}

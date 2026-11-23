import { useState } from "react";
import { Link } from "react-router-dom";
import Radar from "../components/Radar";
import { AREAS } from "../content/lifewheel";
import { fmt, weekLabel } from "../lib/lifewheel";
import { dateKey, loadData, mondayOf } from "../lib/storage";

const COLORS = ["var(--tinte)", "var(--akzent)", "#7fa6a0"];
const MAX_COMPARE = 3;

export default function Lebensrad() {
  const data = loadData();
  const weeks = Object.keys(data.lifewheel).sort().reverse();
  const [sel, setSel] = useState<string[]>(weeks.slice(0, 2));
  const thisWeek = dateKey(mondayOf(new Date()));
  const chosen = weeks.filter((w) => sel.includes(w)).reverse();
  const latest = weeks[0];
  const toggle = (w: string) =>
    setSel((s) => (s.includes(w) ? s.filter((x) => x !== w) : s.length >= MAX_COMPARE ? s : [...s, w]));
  const series = chosen.map((w, i) => ({
    label: weekLabel(w),
    color: COLORS[i],
    values: AREAS.map((a) => data.lifewheel[w].summary[a.id] ?? null),
  }));
  const current = latest ? data.lifewheel[latest] : undefined;
  const sorted = current
    ? AREAS.map((a) => ({ a, v: current.summary[a.id] })).filter((x) => typeof x.v === "number").sort((x, y) => (x.v as number) - (y.v as number))
    : [];

  return (
    <>
      <p className="lead">
        Der lange Blick auf acht Lebensbereiche. Er zeigt, wo gerade wenig Energie ankommt, und bewertet nichts davon.
      </p>
      <p><Link to="/lebensrad/bewerten" className="pill">{weeks.length ? "Lebensrad neu kalibrieren" : "Lebensrad kalibrieren"}</Link></p>

      {weeks.length === 0 ? (
        <p className="muted">Noch keine Bewertung gespeichert.</p>
      ) : (
        <>
          <Radar axes={AREAS.map((a) => a.short)} max={5} series={series} />
          {weeks.length > 1 && (
            <>
              <div className="chips" role="group" aria-label="Bewertungen vergleichen">
                {weeks.slice(0, 6).map((w) => {
                  const on = sel.includes(w);
                  return (
                    <button key={w} type="button" className={`chip${on ? " on" : ""}`} aria-pressed={on} onClick={() => toggle(w)}>
                      {on && <span className="swatch" style={{ background: COLORS[chosen.indexOf(w)] }} />}
                      {weekLabel(w)}
                    </button>
                  );
                })}
              </div>
              <p className="muted">Bis zu {MAX_COMPARE} Bewertungen übereinanderlegen.</p>
            </>
          )}

          {current && (
            <>
              <h2 className="sub">Wenig Energie zuerst</h2>
              <ul className="arealist">
                {sorted.map(({ a, v }) => (
                  <li key={a.id}>
                    <span>{a.name}{current.focus?.includes(a.id) ? " · Fokus" : ""}</span>
                    <span className="muted">{fmt(v as number)} / 5</span>
                  </li>
                ))}
              </ul>
              {current.focus && current.focus.length > 0 && (
                <p className="muted">
                  Energie reinstecken möchtest du bei: {current.focus.map((id) => AREAS.find((a) => a.id === id)?.short ?? id).join(", ")}.
                </p>
              )}
              <p className="muted">Zuletzt bewertet: {weekLabel(latest)}.</p>
            </>
          )}
        </>
      )}
    </>
  );
}

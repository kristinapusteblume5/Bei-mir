import { Link } from "react-router-dom";
import { AREA_IMPULSE } from "../content/areaImpulse";
import { AREAS } from "../content/lifewheel";
import { loadData } from "../lib/storage";

// Zeigt Ideen für die Bereiche, die in deiner letzten Kalibrierung am wenigsten Energie hatten
// oder die du selbst als Fokus gewählt hast.
export default function AuswertungImpulse() {
  const data = loadData();
  const weeks = Object.keys(data.lifewheel).sort().reverse();
  const current = weeks.length ? data.lifewheel[weeks[0]] : undefined;

  if (!current) {
    return (
      <>
        <p>Für Impulse brauche ich eine Lebensrad-Kalibrierung. Danach siehst du hier Ideen für die Bereiche, die gerade wenig Energie haben.</p>
        <p><Link to="/lebensrad/bewerten" className="pill">Lebensrad kalibrieren</Link></p>
      </>
    );
  }

  const rated = AREAS.map((a) => ({ a, v: current.summary[a.id] })).filter((x) => typeof x.v === "number");
  const focus = current.focus ?? [];
  const picked = [
    ...AREAS.filter((a) => focus.includes(a.id)),
    ...rated.sort((x, y) => (x.v as number) - (y.v as number)).map((x) => x.a).filter((a) => !focus.includes(a.id)),
  ].slice(0, 3);

  return (
    <>
      <p className="lead">Ideen, wie du diese Bereiche stärken kannst. Vorschläge, keine Aufgaben. Nimm, was passt.</p>
      {picked.map((a) => (
        <section key={a.id} className="impulsarea">
          <h2 className="sub">
            {a.name}
            {focus.includes(a.id) ? " · dein Fokus" : ""}
          </h2>
          <p className="muted">Deine Bewertung: {current.summary[a.id] ?? "–"} / 5</p>
          <ul className="ideas">
            {(AREA_IMPULSE[a.id] ?? []).map((t) => <li key={t}>{t}</li>)}
          </ul>
        </section>
      ))}
      <p className="muted">
        Die Auswahl richtet sich nach deiner letzten Kalibrierung und deinem Fokus. Die Ideen selbst sind allgemein,
        sie sagen nichts über deine Daten aus.
      </p>
    </>
  );
}

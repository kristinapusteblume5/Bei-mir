import { Link, useParams } from "react-router-dom";
import { EXERCISES, STATES } from "../content/exercises";

export default function StressState() {
  const { stateId } = useParams();
  const s = STATES.find((x) => x.id === stateId);
  if (!s) {
    return (
      <>
        <h1>Nicht gefunden</h1>
        <Link to="/support" className="pill">Zum Support</Link>
      </>
    );
  }
  const list = s.uebungen.map((id) => EXERCISES.find((e) => e.id === id)).filter((e): e is NonNullable<typeof e> => Boolean(e));
  return (
    <>
      <p className="date"><Link to="/support">Zurück</Link></p>
      <h1>{s.label}</h1>
      <p className="lead">Das könnte dir jetzt guttun. Wähle, was sich stimmig anfühlt, oder nimm nichts davon.</p>
      <div className="grid">
        {list.map((e) => (
          <Link key={e.id} to={`/support/${s.id}/${e.id}`} className="tile tile--sand">
            <h2>{e.name}</h2>
            <p className="muted">ca. {Math.max(1, Math.round(e.duration / 60))} Min.</p>
          </Link>
        ))}
      </div>
    </>
  );
}

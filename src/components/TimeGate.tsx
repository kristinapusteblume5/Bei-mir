import { Link } from "react-router-dom";

export default function TimeGate(p: { title: string; text: string; onOpen: () => void }) {
  return (
    <>
      <h1>{p.title}</h1>
      <p className="lead">{p.text}</p>
      <div className="actions">
        <Link to="/" className="pill ghost">Zurück</Link>
        <button type="button" className="pill" onClick={p.onOpen}>Trotzdem öffnen</button>
      </div>
    </>
  );
}

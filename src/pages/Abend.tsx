import { Link, useNavigate } from "react-router-dom";
import CheckinFields from "../components/CheckinFields";
import { dateKey } from "../lib/storage";
import { activeDate } from "../lib/time";

export default function Abend() {
  const nav = useNavigate();
  return (
    <>
      <h1>Abend-Review</h1>
      <p className="lead">Ein ruhiger Blick zurück: Was hing heute womit zusammen?</p>
      <div className="stepbody">
        <CheckinFields slot="evening" dayKey={dateKey(activeDate())} onSaved={() => nav("/")} />
      </div>
      <p><Link to="/" className="link">Abbrechen</Link></p>
    </>
  );
}

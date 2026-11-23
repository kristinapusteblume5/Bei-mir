import { Link, useNavigate } from "react-router-dom";
import CheckinFields from "../components/CheckinFields";
import { dateKey } from "../lib/storage";
import { activeDate } from "../lib/time";

export default function Morgen() {
  const nav = useNavigate();
  return (
    <>
      <h1>Check-in morgens</h1>
      <p className="lead">Außer Stimmung, Energie und Stress ist alles freiwillig.</p>
      <div className="stepbody">
        <CheckinFields slot="morning" dayKey={dateKey(activeDate())} onSaved={() => nav("/")} />
      </div>
      <p><Link to="/" className="link">Abbrechen</Link></p>
    </>
  );
}

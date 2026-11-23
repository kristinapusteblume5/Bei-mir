import { Link } from "react-router-dom";
import { Zweig } from "./Floral";
import { tippFuer } from "../content/vorschlaege";
import type { Morning } from "../lib/storage";

// Erscheint erst, wenn der Morgen-Check-in da ist. Dann weiß die App, wie der Tag startet.
export default function Vorschlag({ morning }: { morning: Morning }) {
  const tipp = tippFuer(morning);
  return (
    <section className="vorschlag">
      <Zweig className="zweig-ecke" width={120} />
      <span className="eyebrow">Vorschlag für heute</span>
      <h2>{tipp.ueberschrift}</h2>
      <p>{tipp.satz}</p>
      <div className="vorschlag-optionen">
        {tipp.optionen.map((o) => (
          <Link key={o.to + o.label} to={o.to} className="pill ghost small">{o.label}</Link>
        ))}
      </div>
    </section>
  );
}

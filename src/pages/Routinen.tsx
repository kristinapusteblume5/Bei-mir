import { Link } from "react-router-dom";
import Photo from "../components/Photo";
import { EVENING_FROM, MORNING_FROM, isOpen } from "../lib/time";

const CARDS = [
  { id: "morning", to: "/routine/morgen", scene: "morgen" as const, label: "Morgens", title: "Deine Morgenroutine", text: "", from: MORNING_FROM },
  { id: "evening", to: "/routine/abend", scene: "abend" as const, label: "Abends", title: "Deine Abendroutine", text: "", from: EVENING_FROM },
  { id: "kettlebell", to: "/routine/kettlebell", scene: "kettlebell" as const, label: "Training", title: "Kettlebell-Workout", text: "" },
  { id: "stretching", to: "/routine/stretching", scene: "stretching" as const, label: "Beweglichkeit", title: "Stretching", text: "" },
];

export default function Routinen() {
  const now = new Date();
  return (
    <>
      <h1>Routinen</h1>
      <p className="lead">Feste Abläufe. Du gehst sie Schritt für Schritt durch, ohne Druck.</p>
      <div className="grid">
        {CARDS.map((c) => (
          <Link key={c.id} to={c.to} className="tile tall">
            <Photo scene={c.scene} />
            <div className="tile-in">
              <span className="eyebrow">{c.label}</span>
              <h2>{c.title}</h2>
              {c.text && <p className="muted">{c.text}</p>}
              {c.from !== undefined && !isOpen(c.id === "morning" ? "morning" : "evening", now) && (
                <p className="muted">Ab {c.from} Uhr</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

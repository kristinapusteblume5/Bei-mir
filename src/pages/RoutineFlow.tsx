import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import CheckinFields from "../components/CheckinFields";
import Photo from "../components/Photo";
import RoutineVideo from "../components/RoutineVideo";
import StepPlayer from "../components/StepPlayer";
import { DEFAULT_ROUTINES, DEFAULT_VIDEOS } from "../content/routines";
import { EXERCISES } from "../content/exercises";
import { dateKey, loadData, saveData, type AppData } from "../lib/storage";
import { EVENING_FROM, MORNING_FROM, activeDate, isOpen, type Slot } from "../lib/time";

const SLOTS: Record<string, string> = { morgen: "morning", abend: "evening", kettlebell: "kettlebell", stretching: "stretching" };
const TITLES: Record<string, string> = { morning: "Deine Morgenroutine", evening: "Deine Abendroutine", kettlebell: "Kettlebell-Workout", stretching: "Stretching" };
const FROM: Record<string, number> = { morning: MORNING_FROM, evening: EVENING_FROM };
const MUSIK: Record<string, string> = { morning: "Jazzige Entspannungsmusik", evening: "Ruhige Klaviermusik" };

export default function RoutineFlow() {
  const { slotName } = useParams();
  const slot = SLOTS[slotName ?? ""];
  const nav = useNavigate();
  const day = dateKey(activeDate());
  const [data, setData] = useState<AppData>(loadData);
  const [i, setI] = useState(-1); // -1 = Überblick
  const [error, setError] = useState("");
  const [forced, setForced] = useState(false);

  if (!slot) return <><h1>Routine nicht gefunden</h1><Link to="/routinen" className="pill">Zu den Routinen</Link></>;

  const steps = data.routines[slot] ?? DEFAULT_ROUTINES[slot];
  const doneIds = data.routineLog[day]?.[slot] ?? [];
  const scene = slot === "morning" ? "morgen" : slot === "evening" ? "abend" : slot === "kettlebell" ? "kettlebell" : "stretching";

  function commit(fn: (d: AppData) => void) {
    try {
      const d = loadData();
      fn(d);
      saveData(d);
      setData({ ...d });
      setError("");
    } catch {
      setError("Speichern hat nicht geklappt. Prüfe, ob dein Browser lokalen Speicher erlaubt.");
    }
  }
  const markDone = (id: string) =>
    commit((d) => {
      const log = d.routineLog[day] ?? {};
      const bisher = log[slot] ?? [];
      if (!bisher.includes(id)) log[slot] = [...bisher, id];
      d.routineLog[day] = log;
    });
  // Nach Morgen- und Abendroutine folgt der Check-in, die anderen enden auf der Heute-Seite.
  const danach = slot === "morning" ? "/check-in/morgen" : slot === "evening" ? "/check-in/abend" : "/";
  const next = () => (i + 1 < steps.length ? setI(i + 1) : nav(danach));

  const zeitgebunden = slot === "morning" || slot === "evening";
  if (zeitgebunden && !isOpen(slot as Slot, new Date()) && !forced) {
    return (
      <>
        <h1>{TITLES[slot]}</h1>
        <p className="lead">Diese Routine ist für die Zeit ab {FROM[slot]} Uhr gedacht. Du kannst sie trotzdem jetzt machen.</p>
        <div className="actions">
          <Link to="/" className="pill ghost">Zurück</Link>
          <button type="button" className="pill" onClick={() => setForced(true)}>Trotzdem starten</button>
        </div>
      </>
    );
  }

  // Überblick vor dem Start
  if (i < 0) {
    return (
      <>
        <h1>{TITLES[slot]}</h1>
        <p className="lead">{steps.length} Schritte, in deinem Tempo. Du kannst jeden überspringen.</p>
        <section className="stepcard">
          <Photo scene={scene} />
          <div className="stepcard-in">
            <span className="eyebrow">Überblick</span>
            <ol className="overview">
              {steps.map((s) => (
                <li key={s.id} className={doneIds.includes(s.id) ? "ist-fertig" : ""}>
                  <strong>{s.text}</strong>
                  {s.hint && <span className="muted"> · {s.hint}</span>}
                </li>
              ))}
            </ol>
          </div>
        </section>
        <div className="actions">
          <Link to="/" className="pill ghost">Zurück</Link>
          <button type="button" className="pill" onClick={() => setI(0)}>
            {doneIds.length ? "Weitermachen" : "Starten"}
          </button>
        </div>
        <p className="muted">{doneIds.length} von {steps.length} Schritten heute erledigt.</p>
      </>
    );
  }

  const step = steps[i];
  const exercise = step.exercise ? EXERCISES.find((e) => e.id === step.exercise) : undefined;
  const anleitung = step.anleitung ?? exercise?.steps;

  return (
    <>
      <p className="date">
        <button type="button" className="linkbtn" onClick={() => setI(-1)}>Überblick</button> · Schritt {i + 1} von {steps.length}
      </p>
      <div className="progress" aria-label={`Schritt ${i + 1} von ${steps.length}`}>
        <span style={{ width: `${((i + 1) / steps.length) * 100}%` }} />
      </div>

      <section className="stepcard">
        <Photo scene={scene} />
        <div className="stepcard-in">
          <span className="eyebrow">{TITLES[slot]}</span>
          <h1>{step.text}</h1>
          {step.hint && <p>{step.hint}</p>}
        </div>
      </section>

      <div className="stepbody">
        {step.kind === "video" && <RoutineVideo src={data.videos[slot] ?? DEFAULT_VIDEOS[slot] ?? ""} title={step.text} />}
        {step.impuls && <p className="impulsfrage">{step.impuls}</p>}
        {step.kind === "checkin" ? (
          <CheckinFields slot={slot === "evening" ? "evening" : "morning"} dayKey={day} onSaved={() => { markDone(step.id); next(); }} />
        ) : (
          <>
            {anleitung && <ol className="steps">{anleitung.map((s) => <li key={s}>{s}</li>)}</ol>}
            {(step.dauer ?? exercise?.duration) && (
              <StepPlayer seconds={step.dauer ?? exercise?.duration ?? 60} anleitung={anleitung}
                audio={step.audio} audioLabel={MUSIK[slot]} stimme={step.stimme} />
            )}
            <p className="muted">
              Mach nur, was sich gut anfühlt. Bei Schwindel oder Unwohlsein beende den Schritt jederzeit.
            </p>
          </>
        )}
      </div>

      {error && <p role="alert" className="error">{error}</p>}
      {step.kind !== "checkin" && (
        <div className="actions">
          {i > 0 ? <button type="button" className="pill ghost" onClick={() => setI(i - 1)}>Zurück</button> : <span />}
          <span className="actions wrap" style={{ margin: 0 }}>
            <button type="button" className="pill ghost" onClick={next}>Überspringen</button>
            <button type="button" className="pill" onClick={() => { markDone(step.id); next(); }}>
              <Check size={16} strokeWidth={2.4} aria-hidden="true" /> Erledigt
            </button>
          </span>
        </div>
      )}
      <p className="muted">{doneIds.length} von {steps.length} Schritten heute erledigt.</p>
    </>
  );
}

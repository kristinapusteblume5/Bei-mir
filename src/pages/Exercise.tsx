import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChoiceRow } from "../components/inputs";
import StepPlayer from "../components/StepPlayer";
import { EXERCISES, STATES } from "../content/exercises";
import { TEXTE } from "../content/gesprochen";
import { dateKey, updateData, type ExerciseLog } from "../lib/storage";
import { activeDate } from "../lib/time";

const OPTIONS = ["Besser", "Unverändert", "Schlechter"];
const OUTCOMES: ExerciseLog["outcome"][] = ["besser", "unveraendert", "schlechter"];

export default function ExercisePage() {
  const { stateId, exerciseId } = useParams();
  const ex = EXERCISES.find((e) => e.id === exerciseId);
  const [rated, setRated] = useState<number | undefined>();
  const [error, setError] = useState("");
  if (!ex) {
    return (
      <>
        <h1>Übung nicht gefunden</h1>
        <Link to="/support" className="pill">Zum Support</Link>
      </>
    );
  }
  const known = STATES.some((s) => s.id === stateId);

  function rate(v: number) {
    if (!ex) return;
    try {
      updateData((d) => {
        const outcome = OUTCOMES[v - 1];
        const last = d.exerciseLog[d.exerciseLog.length - 1];
        if (rated !== undefined && last && last.exerciseId === ex.id) last.outcome = outcome;
        else d.exerciseLog.push({ date: dateKey(activeDate()), exerciseId: ex.id, stateId: known ? stateId : undefined, outcome, at: new Date().toISOString() });
      });
      setRated(v);
      setError("");
    } catch {
      setError("Speichern hat nicht geklappt. Prüfe, ob dein Browser lokalen Speicher erlaubt.");
    }
  }

  return (
    <>
      <p className="date"><Link to={known ? `/support/${stateId}` : "/support"}>Zurück</Link></p>
      <h1>{ex.name}</h1>
      <p className="lead">{ex.desc}</p>
      <p><strong>Dauer:</strong> ca. {Math.max(1, Math.round(ex.duration / 60))} Min.</p>
      <p><strong>Wann es helfen könnte:</strong> {ex.when}</p>
      <h2 className="sub">So geht’s</h2>
      <ol className="steps">{ex.steps.map((s) => <li key={s}>{s}</li>)}</ol>
      <p className="muted">
        {ex.breath ? "Atme nur so, wie es sich angenehm anfühlt. " : ""}
        Mach nur, was sich gut anfühlt. Bei Schwindel oder Unwohlsein beende die Übung jederzeit.
      </p>
      <StepPlayer
        seconds={ex.duration}
        anleitung={TEXTE[ex.id]?.gesprochen ?? ex.gesprochen ?? ex.steps}
        stimme={TEXTE[ex.id]?.stimme ?? ex.stimme}
        audio={TEXTE[ex.id]?.musik ?? ex.musik}
        audioLabel="Hintergrundmusik"
      />
      <h2 className="sub">Wie fühle ich mich jetzt?</h2>
      <ChoiceRow label="Du kannst das ganz frei einschätzen." options={OPTIONS} value={rated} onChange={rate} />
      {rated !== undefined && <p role="status">Danke fürs Wahrnehmen.</p>}
      {error && <p role="alert" className="error">{error}</p>}
    </>
  );
}

import { useState } from "react";
import { Activity, BatteryCharging, Smile, Waves } from "lucide-react";
import SegmentScale from "./SegmentScale";
import { ToggleGrid } from "./inputs";
import { BAD, BODY, GOOD, HABITS, MOODS } from "../content/checkin";
import { saveDay, loadData, type Mood } from "../lib/storage";

// Gleiche Felder für den Check-in morgens und den Abend-Review,
// genutzt als eigene Seite und als Schritt innerhalb der Routine.
export default function CheckinFields({ slot, dayKey, onSaved }: { slot: "morning" | "evening"; dayKey: string; onSaved: () => void }) {
  const ex = loadData().checkins[dayKey]?.[slot];
  const evening = slot === "evening";
  const [mood, setMood] = useState<number | undefined>(ex?.mood);
  const [energy, setEnergy] = useState<number | undefined>(ex?.energy);
  const [stress, setStress] = useState<number | undefined>(ex?.stress);
  const [body, setBody] = useState<string[]>((ex && "body" in ex ? ex.body : []) ?? []);
  const [good, setGood] = useState<string[]>((ex && "good" in ex ? ex.good : []) ?? []);
  const [bad, setBad] = useState<string[]>((ex && "bad" in ex ? ex.bad : []) ?? []);
  const [habits, setHabits] = useState<string[]>((ex && "habits" in ex ? ex.habits : []) ?? []);
  const [note, setNote] = useState(ex?.note ?? "");
  const [error, setError] = useState("");
  const ready = mood !== undefined && energy !== undefined && stress !== undefined;

  function save() {
    if (mood === undefined || energy === undefined || stress === undefined) return;
    try {
      saveDay(dayKey, evening
        ? { evening: { mood: mood as Mood, energy, stress, good, bad, habits, note } }
        : { morning: { mood: mood as Mood, energy, stress, body, note } });
      onSaved();
    } catch {
      setError("Speichern hat nicht geklappt. Prüfe, ob dein Browser lokalen Speicher erlaubt.");
    }
  }

  return (
    <>
      <SegmentScale label={evening ? "Wie geht es mir jetzt?" : "Wie geht es mir heute?"} steps={5} value={mood}
        icon={<Smile size={22} strokeWidth={1.6} />} ends={[MOODS[0], MOODS[4]]} onChange={setMood} />
      <SegmentScale label="Wie viel Energie habe ich gerade?" steps={5} value={energy}
        icon={<BatteryCharging size={22} strokeWidth={1.6} />} ends={["wenig", "viel"]} onChange={setEnergy} />
      <SegmentScale label="Wie gestresst fühle ich mich gerade?" steps={5} value={stress}
        icon={<Waves size={22} strokeWidth={1.6} />} ends={["gar nicht", "sehr"]} onChange={setStress} />
      {evening ? (
        <>
          <ToggleGrid label="Was war heute gut für mich?" options={GOOD} selected={good} onChange={setGood} />
          <ToggleGrid label="Was war heute nicht gut für mich?" options={BAD} selected={bad} onChange={setBad} />
          <ToggleGrid label="Meine Gewohnheiten heute" options={HABITS} selected={habits} onChange={setHabits} tiles />
        </>
      ) : (
        <ToggleGrid label="Wie fühlt sich mein Körper heute an?" options={BODY} selected={body} onChange={setBody} />
      )}
      <label className="field">
        {evening ? "Was ist mir heute aufgefallen? Was hing womit zusammen?" : "Möchte ich noch etwas festhalten?"}
        <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      {error && <p role="alert" className="error">{error}</p>}
      <button type="button" className="pill" onClick={save} disabled={!ready}>
        <Activity size={0} aria-hidden="true" style={{ display: "none" }} />
        Speichern
      </button>
      {!ready && <p className="muted">Wähle Stimmung, Energie und Stress, um zu speichern.</p>}
    </>
  );
}

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { besteStimme, sprich, stimmeStoppen } from "../lib/stimme";

export function formatTime(s: number): string {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

// Ein Start für alles: Timer, Anleitung und Hintergrundmusik laufen zusammen.
// Gibt es eine eigene Sprachaufnahme, wird sie gespielt; sonst liest das Gerät vor.
export default function StepPlayer({ seconds, anleitung = [], audio, audioLabel, stimme }: {
  seconds: number; anleitung?: string[]; audio?: string; audioLabel?: string; stimme?: string;
}) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const [voice, setVoice] = useState(true);
  const [audioFehlt, setAudioFehlt] = useState(false);
  const [stimmeFehlt, setStimmeFehlt] = useState(false);
  const musikRef = useRef<HTMLAudioElement | null>(null);
  const stimmeRef = useRef<HTMLAudioElement | null>(null);
  const gesprochen = useRef(0);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const geraetestimme = typeof window !== "undefined" && "speechSynthesis" in window;
  const eigeneAufnahme = Boolean(stimme) && !stimmeFehlt;

  // Die Stimmenliste steht je nach Browser erst nach einem Moment bereit.
  useEffect(() => {
    if (!geraetestimme) return;
    const laden = () => { voiceRef.current = besteStimme(); };
    laden();
    window.speechSynthesis.addEventListener("voiceschanged", laden);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", laden);
  }, [geraetestimme]);

  useEffect(() => { setLeft(seconds); setRunning(false); gesprochen.current = 0; }, [seconds]);

  useEffect(() => () => {
    musikRef.current?.pause();
    stimmeRef.current?.pause();
    stimmeStoppen();
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setLeft((l) => {
        const next = l - 1;
        // Ohne eigene Aufnahme werden die Schritte gleichmäßig über die Zeit vorgelesen.
        if (!eigeneAufnahme && voice && anleitung.length > 0) {
          const vergangen = seconds - next;
          const proSchritt = seconds / anleitung.length;
          const faellig = Math.min(anleitung.length, Math.floor(vergangen / proSchritt) + 1);
          while (gesprochen.current < faellig) {
            sprich(anleitung[gesprochen.current], voiceRef.current);
            gesprochen.current += 1;
          }
        }
        if (next <= 0) {
          setRunning(false);
          musikRef.current?.pause();
          stimmeRef.current?.pause();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, voice, seconds, anleitung.length, eigeneAufnahme]);

  function start() {
    if (left === 0) { setLeft(seconds); gesprochen.current = 0; }
    setRunning(true);
    if (audio && musikRef.current) void musikRef.current.play().catch(() => setAudioFehlt(true));
    if (eigeneAufnahme && voice && stimmeRef.current) void stimmeRef.current.play().catch(() => setStimmeFehlt(true));
  }
  function pause() {
    setRunning(false);
    musikRef.current?.pause();
    stimmeRef.current?.pause();
    stimmeStoppen();
  }
  function zurueck() {
    pause();
    setLeft(seconds);
    gesprochen.current = 0;
    if (musikRef.current) musikRef.current.currentTime = 0;
    if (stimmeRef.current) stimmeRef.current.currentTime = 0;
  }

  const fertig = left === 0;
  const hatStimme = eigeneAufnahme || (geraetestimme && anleitung.length > 0);
  return (
    <div className="timer">
      <div className="timer-time" role="timer">{formatTime(left)}</div>
      {fertig && <p role="status">Geschafft. Nimm dir einen Moment zum Nachspüren.</p>}
      <div className="actions" style={{ justifyContent: "center" }}>
        <button type="button" className="pill" onClick={running ? pause : start}>
          {running ? <Pause size={16} strokeWidth={2.2} aria-hidden="true" /> : <Play size={16} strokeWidth={2.2} aria-hidden="true" />}
          {running ? "Pause" : fertig ? "Nochmal" : audio ? "Start mit Musik" : "Start"}
        </button>
        <button type="button" className="pill ghost" onClick={zurueck}>
          <RotateCcw size={16} strokeWidth={2.2} aria-hidden="true" /> Zurücksetzen
        </button>
      </div>
      {hatStimme && (
        <button type="button" className="linkbtn voicebtn" onClick={() => {
          if (voice) { stimmeStoppen(); stimmeRef.current?.pause(); }
          setVoice(!voice);
        }}>
          {voice ? <Volume2 size={15} strokeWidth={2} aria-hidden="true" /> : <VolumeX size={15} strokeWidth={2} aria-hidden="true" />}
          {voice ? "Stimme an" : "Stimme aus"}
        </button>
      )}
      {stimme && <audio ref={stimmeRef} src={stimme} preload="none" onError={() => setStimmeFehlt(true)} />}
      {audio && (
        <>
          <audio ref={musikRef} src={audio} loop preload="none" onError={() => setAudioFehlt(true)} />
          <p className="muted">
            {audioFehlt
              ? `Keine Musik gefunden. Lege eine Datei unter public${audio} ab, dann läuft sie beim Start mit.`
              : audioLabel}
          </p>
        </>
      )}
    </div>
  );
}

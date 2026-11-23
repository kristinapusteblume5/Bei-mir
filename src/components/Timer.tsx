import { useEffect, useState } from "react";

export function formatTime(s: number): string {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function Timer({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setLeft((l) => {
        if (l <= 1) { setRunning(false); return 0; }
        return l - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const done = left === 0;
  return (
    <div className="timer">
      <div className="timer-time" role="timer">{formatTime(left)}</div>
      {done && <p role="status">Geschafft. Nimm dir einen Moment zum Nachspüren.</p>}
      <div className="actions">
        <button type="button" className="pill" onClick={() => { if (done) setLeft(seconds); setRunning(!running || done); }}>
          {done ? "Nochmal" : running ? "Pause" : "Start"}
        </button>
        <button type="button" className="pill ghost" onClick={() => { setRunning(false); setLeft(seconds); }}>Zurücksetzen</button>
      </div>
    </div>
  );
}

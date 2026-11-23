import type { ReactNode } from "react";

// Bewertungsmuster: Symbol, Frage, darunter eine Leiste aus Segmenten zum Antippen.
export default function SegmentScale(p: {
  label: string; steps: number; value?: number; icon?: ReactNode;
  ends?: [string, string]; onChange: (v: number) => void;
}) {
  return (
    <fieldset className="rate">
      <legend className="rate-head">
        {p.icon && <span className="rate-icon">{p.icon}</span>}
        <span>{p.label}</span>
      </legend>
      <div className="segs">
        {Array.from({ length: p.steps }, (_, i) => i + 1).map((n) => (
          <button key={n} type="button" aria-label={`${n} von ${p.steps}`} aria-pressed={p.value === n}
            className={`seg-cell${p.value !== undefined && n <= p.value ? " fill" : ""}${p.value === n ? " edge" : ""}`}
            onClick={() => p.onChange(n)} />
        ))}
      </div>
      {p.ends && <div className="ends"><span>{p.ends[0]}</span><span>{p.ends[1]}</span></div>}
    </fieldset>
  );
}

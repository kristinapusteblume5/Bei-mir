import { fmt } from "../lib/lifewheel";

const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const W = 280, H = 60, BW = 28;

export default function DayBars({ label, values, max }: { label: string; values: (number | null)[]; max: number }) {
  const gap = (W - 7 * BW) / 6;
  const alt = values.map((v, i) => `${DAYS[i]} ${v === null ? "keine Angabe" : fmt(v)}`).join(", ");
  return (
    <figure className="bars">
      <figcaption>{label}</figcaption>
      <svg viewBox={`0 0 ${W} ${H + 16}`} role="img" aria-label={`${label}: ${alt}`}>
        {values.map((v, i) => {
          const h = v === null ? 0 : (v / max) * H;
          const x = i * (BW + gap);
          return (
            <g key={DAYS[i]}>
              <rect x={x} y={H - h} width={BW} height={h} rx={6} fill="var(--salbei)" />
              <text x={x + BW / 2} y={H + 13} textAnchor="middle" fontSize="10" fill="var(--weich)">{DAYS[i]}</text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

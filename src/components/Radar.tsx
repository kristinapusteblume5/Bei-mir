export interface Series { label: string; values: (number | null)[]; color: string }

const CX = 230, CY = 190, R = 108;

export default function Radar({ axes, series, max = 10 }: { axes: string[]; series: Series[]; max?: number }) {
  const n = axes.length;
  const pt = (i: number, v: number, extra = 0): [number, number] => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (v / max) * R + extra;
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  };
  const poly = (vals: (number | null)[]) => vals.map((v, i) => pt(i, v ?? 0).join(",")).join(" ");
  return (
    <svg viewBox="0 0 460 380" className="radar" role="img"
      aria-label={`Lebensrad mit ${n} Bereichen, ${series.length} Woche(n) im Vergleich`}>
      {Array.from({ length: 5 }, (_, i) => ((i + 1) * max) / 5).map((v) => (
        <polygon key={v} points={poly(axes.map(() => v))} fill="none" stroke="var(--linie)" />
      ))}
      {axes.map((_, i) => <line key={i} x1={CX} y1={CY} x2={pt(i, max)[0]} y2={pt(i, max)[1]} stroke="var(--linie)" />)}
      {axes.map((name, i) => {
        const [x, y] = pt(i, max, 14);
        const anchor = x < CX - 5 ? "end" : x > CX + 5 ? "start" : "middle";
        return <text key={name} x={x} y={y} textAnchor={anchor} dominantBaseline="middle" fontSize="11" fill="var(--tinte)">{name}</text>;
      })}
      {series.map((s) => (
        <polygon key={s.label} points={poly(s.values)} fill={s.color} fillOpacity="0.14" stroke={s.color} strokeWidth="2" strokeLinejoin="round" />
      ))}
    </svg>
  );
}

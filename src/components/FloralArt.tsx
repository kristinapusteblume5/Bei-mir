export type Scene = "morgen" | "abend" | "kettlebell" | "stretching" | "koerper" | "auswertung" | "impuls";
export type Ton = "lila" | "gruen" | "koralle";

// Jede Kachel bekommt einen Grundton mit Farbverlauf (CSS, siehe styles.css).
// Die Blumen darauf bleiben schwarz-weiß.
export const TON: Record<Scene, Ton> = {
  morgen: "lila",
  abend: "gruen",
  kettlebell: "koralle",
  stretching: "lila",
  koerper: "gruen",
  auswertung: "koralle",
  impuls: "lila",
};

const WEISS = "#fbfaf7";
const SCHWARZ = "#101512";

// Blütenblatt mit Form: unten schmal, nach oben gewölbt. Zeigt nach oben, Ursprung am Blütenboden.
function blattform(lang: number, breit: number) {
  return `M0 0 C ${-breit} ${-lang * 0.25} ${-breit * 1.05} ${-lang * 0.8} 0 ${-lang} C ${breit * 1.05} ${-lang * 0.8} ${breit} ${-lang * 0.25} 0 0 Z`;
}

// Rosenartige Blüte: zwei Blätterkränze übereinander, mit Licht und Schatten.
function Rose({ x, y, r, dreh, id }: { x: number; y: number; r: number; dreh: number; id: string }) {
  const aussen = [0, 72, 144, 216, 288];
  const innen = [36, 108, 180, 252, 324];
  return (
    <g transform={`translate(${x} ${y}) rotate(${dreh})`}>
      {aussen.map((g) => (
        <path key={`a${g}`} d={blattform(r, r * 0.62)} fill={`url(#${id}-blatt)`} stroke="#2b2b2b" strokeOpacity="0.25" strokeWidth="0.8" transform={`rotate(${g})`} />
      ))}
      {innen.map((g) => (
        <path key={`i${g}`} d={blattform(r * 0.68, r * 0.45)} fill={`url(#${id}-blatt)`} stroke="#2b2b2b" strokeOpacity="0.25" strokeWidth="0.8" transform={`rotate(${g})`} />
      ))}
      <circle r={r * 0.3} fill={`url(#${id}-mitte)`} />
    </g>
  );
}

// Anemone: lange, schmale Blätter mit dunkler Mitte und Staubfäden.
function Anemone({ x, y, r, dreh, id }: { x: number; y: number; r: number; dreh: number; id: string }) {
  const winkel = [0, 45, 90, 135, 180, 225, 270, 315];
  const staub = Array.from({ length: 14 }, (_, i) => (i / 14) * Math.PI * 2);
  return (
    <g transform={`translate(${x} ${y}) rotate(${dreh})`}>
      {winkel.map((g) => (
        <path key={g} d={blattform(r, r * 0.3)} fill={`url(#${id}-blatt)`} stroke="#2b2b2b" strokeOpacity="0.2" strokeWidth="0.7" transform={`rotate(${g})`} />
      ))}
      {staub.map((a, i) => (
        <circle key={i} cx={Math.cos(a) * r * 0.2} cy={Math.sin(a) * r * 0.2} r={r * 0.045} fill={SCHWARZ} />
      ))}
      <circle r={r * 0.13} fill={SCHWARZ} />
    </g>
  );
}

// Blatt mit Mittelrippe, dunkel verlaufend.
function Blatt({ x, y, laenge, dreh, id }: { x: number; y: number; laenge: number; dreh: number; id: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${dreh})`}>
      <path d={blattform(laenge, laenge * 0.3)} fill={`url(#${id}-laub)`} />
      <path d={`M0 0 L0 ${-laenge * 0.9}`} stroke="#4a4a4a" strokeWidth="0.9" strokeOpacity="0.8" />
    </g>
  );
}

// Schwarz-weiße Blumen, nur auf der rechten Seite. Der Farbgrund kommt aus CSS.
export default function FloralArt({ scene }: { scene: Scene }) {
  const ton = TON[scene] ?? "lila";
  const id = `fl-${scene}`;
  return (
    <div className={`floral ton-${ton}`} aria-hidden="true">
      <svg viewBox="0 0 400 500" preserveAspectRatio="xMaxYMid slice">
        <defs>
          <radialGradient id={`${id}-blatt`} cx="0.35" cy="0.3" r="0.9">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f1efec" />
            <stop offset="100%" stopColor="#a9a6a2" />
          </radialGradient>
          <radialGradient id={`${id}-mitte`} cx="0.4" cy="0.4" r="0.7">
            <stop offset="0%" stopColor="#5a5a5a" />
            <stop offset="100%" stopColor={SCHWARZ} />
          </radialGradient>
          <linearGradient id={`${id}-laub`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3a3f3c" />
            <stop offset="100%" stopColor={SCHWARZ} />
          </linearGradient>
        </defs>

        {/* ein großer heller Kreis hinter dem Strauß, wie in der Vorlage */}
        <circle cx="290" cy="230" r="150" fill={WEISS} fillOpacity="0.1" />

        {/* Stiele von unten rechts */}
        <g fill="none" stroke={SCHWARZ} strokeOpacity="0.75" strokeWidth="2.4" strokeLinecap="round">
          <path d="M300 510C298 430 292 360 268 292" />
          <path d="M344 510C346 420 336 340 326 262" />
          <path d="M392 510C384 440 378 380 372 340" />
        </g>

        <Blatt x={300} y={430} laenge={92} dreh={-48} id={id} />
        <Blatt x={292} y={398} laenge={78} dreh={32} id={id} />
        <Blatt x={352} y={404} laenge={80} dreh={14} id={id} />

        <Rose x={262} y={252} r={62} dreh={10} id={id} />
        <Anemone x={330} y={206} r={46} dreh={-12} id={id} />
        <Rose x={364} y={330} r={36} dreh={28} id={id} />
        <Anemone x={206} y={330} r={28} dreh={18} id={id} />
      </svg>
    </div>
  );
}

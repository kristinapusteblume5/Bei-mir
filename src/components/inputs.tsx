export function ScaleRow(p: { label: string; value?: number; ends?: [string, string]; onChange: (v: number) => void }) {
  return (
    <fieldset className="q">
      <legend>{p.label}</legend>
      <div className="scale">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button key={n} type="button" className={`scale-btn${p.value === n ? " on" : ""}`}
            aria-pressed={p.value === n} onClick={() => p.onChange(n)}>{n}</button>
        ))}
      </div>
      <div className="ends"><span>{p.ends?.[0] ?? "gar nicht"}</span><span>{p.ends?.[1] ?? "voll und ganz"}</span></div>
    </fieldset>
  );
}

export function ChoiceRow(p: { label: string; options: string[]; value?: number; onChange: (v: number) => void }) {
  return (
    <fieldset className="q">
      <legend>{p.label}</legend>
      <div className="chips">
        {p.options.map((o, i) => (
          <button key={o} type="button" className={`chip${p.value === i + 1 ? " on" : ""}`}
            aria-pressed={p.value === i + 1} onClick={() => p.onChange(i + 1)}>{o}</button>
        ))}
      </div>
    </fieldset>
  );
}

export function ToggleGrid(p: {
  label: string; options: { id: string; label: string }[]; selected: string[];
  onChange: (s: string[]) => void; tiles?: boolean;
}) {
  const flip = (id: string) =>
    p.onChange(p.selected.includes(id) ? p.selected.filter((x) => x !== id) : [...p.selected, id]);
  return (
    <fieldset className="q">
      <legend>{p.label}</legend>
      <div className={`chips${p.tiles ? " tiles" : ""}`}>
        {p.options.map((o) => {
          const on = p.selected.includes(o.id);
          return (
            <button key={o.id} type="button" className={`chip${on ? " on" : ""}`} aria-pressed={on} onClick={() => flip(o.id)}>
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

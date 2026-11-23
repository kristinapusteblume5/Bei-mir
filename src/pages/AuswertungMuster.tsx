import { BAD, HABITS } from "../content/checkin";
import { STATES } from "../content/exercises";
import { AREAS } from "../content/lifewheel";
import { MIN_DAYS, compareHabits, describeComparison, eligibleDays, factorCounts, habitDays } from "../lib/stats";
import { loadData } from "../lib/storage";

function countTags(values: string[][]): [string, number][] {
  const m = new Map<string, number>();
  for (const list of values) for (const id of list) m.set(id, (m.get(id) ?? 0) + 1);
  return Array.from(m).sort((a, b) => b[1] - a[1]).slice(0, 5);
}

const stateLabel = (id: string) =>
  STATES.find((s) => s.id === id)?.label.replace(/^Ich (bin|fühle mich|kann mich|möchte) ?/, "").replace(/\.$/, "") ?? id;
const areaLabel = (id: string) => AREAS.find((a) => a.id === id)?.name ?? id;

export default function AuswertungMuster() {
  const data = loadData();
  const all = Object.values(data.checkins);
  const eligible = eligibleDays(data);
  const comparisons = compareHabits(data);
  const badAll = factorCounts(all, "bad").slice(0, 3);
  const insights = data.insights ?? [];
  const feelingTop = countTags(insights.map((i) => i.feelings));
  const areaTop = countTags(insights.map((i) => i.areas));

  // Eigene Erkenntnisse: ausgezählt und als Liste, ohne sie zu deuten.
  const notes = (
    <>
      <h2 className="sub">Deine Erkenntnisse</h2>
      {insights.length === 0 ? (
        <p className="muted">Noch keine notiert. Du kannst sie auf der Heute-Seite festhalten.</p>
      ) : (
        <>
          <p className="muted">{insights.length} notiert.</p>
          {feelingTop.length > 0 && (
            <p><strong>Am häufigsten verknüpft mit: </strong>{feelingTop.map(([id, n]) => `${stateLabel(id)} (${n}×)`).join(", ")}</p>
          )}
          {areaTop.length > 0 && (
            <p><strong>Lebensbereiche: </strong>{areaTop.map(([id, n]) => `${areaLabel(id)} (${n}×)`).join(", ")}</p>
          )}
          <ul className="notelist">
            {[...insights].reverse().slice(0, 10).map((i) => (
              <li key={i.id}>
                <p>{i.text}</p>
                <p className="muted">
                  {new Date(i.date).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                  {i.feelings.length > 0 ? ` · ${i.feelings.map(stateLabel).join(", ")}` : ""}
                  {i.areas.length > 0 ? ` · ${i.areas.map(areaLabel).join(", ")}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );

  if (eligible < MIN_DAYS) {
    return (
      <>
        <p>Muster erscheinen ab {MIN_DAYS} Tagen mit Abend-Review.</p>
        <div className="progress" role="img" aria-label={`${eligible} von ${MIN_DAYS} Tagen`}>
          <span style={{ width: `${Math.min(100, (eligible / MIN_DAYS) * 100)}%` }} />
        </div>
        <p className="muted">{eligible} von {MIN_DAYS} Tagen erfasst</p>
        {notes}
      </>
    );
  }

  return (
    <>
      <p className="muted">Auf Basis von {eligible} Tagen mit Abend-Review. Verglichen werden Abend-Werte an Tagen mit und ohne Gewohnheit.</p>
      {HABITS.map((h) => {
        const { done, total } = habitDays(all, h.id);
        const rows = comparisons.filter((c) => c.habitId === h.id);
        return (
          <div key={h.id} className="insight">
            <h3>{h.label}</h3>
            <p className="muted">An {done} von {total} Tagen erledigt.</p>
            {rows.length === 0 ? <p className="muted">Zu wenige Tage mit und ohne, um zu vergleichen.</p> : rows.map((c) => <p key={c.metric}>{describeComparison(c)}</p>)}
          </div>
        );
      })}
      {badAll.length > 0 && (
        <p><strong>Am häufigsten als belastend markiert: </strong>{badAll.map((t) => `${BAD.find((b) => b.id === t.id)?.label ?? t.id} (${t.count}×)`).join(", ")}</p>
      )}
      <p className="muted">Das sind Zusammenhänge in deinen Daten, keine Ursachen. Viele andere Dinge spielen mit hinein.</p>
      {notes}
    </>
  );
}

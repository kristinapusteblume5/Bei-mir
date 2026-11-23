import { Link } from "react-router-dom";
import Checkliste from "../components/Checkliste";
import { Halme, Zweig } from "../components/Floral";
import Photo from "../components/Photo";
import { EXERCISES } from "../content/exercises";
import InsightBox from "../components/InsightBox";
import Vorschlag from "../components/Vorschlag";
import { impulsFor } from "../content/impulse";
import { DEFAULT_FAVORITES, DEFAULT_ROUTINES } from "../content/routines";
import { MIN_DAYS, eligibleDays, topInsight } from "../lib/stats";
import { dateKey, loadData, mondayOf, sicherungFaellig } from "../lib/storage";
import { EVENING_FROM, MORNING_FROM, activeDate, eveningTile, isOpen } from "../lib/time";

// Die Schnellübungen wechseln das Bild, damit keine zwei Kacheln gleich aussehen.
const FAV_SZENEN = ["abend", "kettlebell", "stretching"] as const;

const MOODS = { 1: "Schlecht", 2: "Eher schlecht", 3: "Okay", 4: "Gut", 5: "Sehr gut" } as const;

export default function Heute() {
  const now = new Date();
  const day = activeDate(now);
  const key = dateKey(day);
  const data = loadData();
  const today = data.checkins[key];
  const evening = eveningTile(now);
  const hour = now.getHours();
  const gruss = hour < 11 ? "Starte gut in deinen Tag," : hour < 18 ? "Hallo" : "Guten Abend,";
  const insight = topInsight(data);
  const sicherung = sicherungFaellig();
  const slot = evening ? "evening" : "morning";
  const steps = (data.routines[slot] ?? DEFAULT_ROUTINES[slot]).length;
  const doneSteps = (data.routineLog[key]?.[slot] ?? []).length;
  const favorites = (data.favorites ?? DEFAULT_FAVORITES)
    .map((id) => EXERCISES.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .slice(0, 2);

  const early = !evening && !isOpen("morning", now);
  const morningDone = !evening && steps > 0 && doneSteps >= steps;

  // Ab 17 Uhr löst die Abendroutine die Morgenroutine ab, auch wenn diese offen blieb.
  // Ist die Morgenroutine durch, verschwindet sie schon vorher.
  const hero = evening
    ? {
        to: "/routine/abend", scene: "morgen" as const, title: "Deine Abendroutine",
        text: doneSteps
          ? `${doneSteps} von ${steps} Schritten`
          : hour < EVENING_FROM ? `${steps} Schritte. Der Review öffnet ab ${EVENING_FROM} Uhr.` : `${steps} Schritte, in deinem Tempo.`,
        cta: doneSteps ? "Weitermachen" : "Starten",
      }
    : early
      ? { to: "/support", scene: "morgen" as const, title: "Noch früh", text: `Die Morgenroutine öffnet ab ${MORNING_FROM} Uhr.`, cta: "Zum Support" }
      : morningDone
        ? null
        : { to: "/routine/morgen", scene: "morgen" as const, title: "Deine Morgenroutine", text: "", cta: doneSteps ? "Weitermachen" : "Starten" };

  // Sonntags steht der Wochenrückblick hier, sonst taucht er nirgends auf.
  const sunday = day.getDay() === 0;
  const weekKey = dateKey(mondayOf(day));
  const reviewDone = Object.values(data.reflections[weekKey] ?? {}).some((t) => t.trim());

  const mood = today?.evening?.mood ?? today?.morning?.mood;
  const stress = today?.evening?.stress ?? today?.morning?.stress;

  return (
    <div className="screen-gruen">
      <p className="date">
        {now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
        {" · "}
        <Link to="/einstellungen" className="link">Einstellungen</Link>
      </p>
      <h1 className="gruss">
        <span className="gruss-teil">{gruss}</span>
        <span className="gruss-name">
          Krissi
        </span>
      </h1>

      {hero && (
        <Link to={hero.to} className="hero">
          <Photo scene={hero.scene} />
          <div className="hero-in">
            <h2>{hero.title}</h2>
            {hero.text && <p>{hero.text}</p>}
            <span className="pill">{hero.cta}</span>
          </div>
        </Link>
      )}

      <section className="impuls-neutral">
        <Zweig className="zweig-ecke" width={130} />
        <span className="eyebrow">Impuls des Tages</span>
        <p>{impulsFor(key).text}</p>
      </section>


      {(mood || stress) && (
        <p className="today-line">
          Heute: <strong>{mood ? MOODS[mood] : "–"}</strong>
          {stress ? <> · Stress <strong>{stress}/5</strong></> : null}
        </p>
      )}

      {sunday && (
        <Link to="/wochenrueckblick" className="card-flat weekcard">
          <span className="eyebrow">Sonntag</span>
          <p><strong>Wochenrückblick</strong></p>
          <p className="muted">{reviewDone ? "Du hast schon etwas notiert. Du kannst jederzeit ergänzen." : "Ein Blick auf die Woche, fünf Fragen, nichts davon ist Pflicht."}</p>
        </Link>
      )}

      {sicherung && (
        <Link to="/einstellungen" className="card-flat hinweiskarte">
          <span className="eyebrow">Sicherung</span>
          <p>Deine Einträge liegen nur auf diesem Gerät. Eine Sicherungsdatei schützt sie.</p>
        </Link>
      )}

      {today?.morning && <Vorschlag morning={today.morning} />}

      <Checkliste dayKey={key} />

      <Halme className="halme-fuss" width={120} />

      <InsightBox />

      {favorites.length > 0 && (
        <>
          <h2 className="sub">Schnell zur Übung</h2>
          <div className="faves">
            {favorites.map((e, i) => (
              <Link key={e.id} to={`/support/alle/${e.id}`} className="bar">
                <Photo scene={FAV_SZENEN[i % FAV_SZENEN.length]} />
                <span className="bar-in">
                  <strong>{e.name}</strong>
                  <span className="pfeil">›</span>
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      <Link to="/auswertung/muster" className="card-flat">
        <span className="eyebrow">Erkenntnis</span>
        {insight ? (
          <>
            <p>{insight.text}</p>
            <p className="muted">Beruht auf {insight.n} Tagen. Ein Zusammenhang, keine Ursache.</p>
          </>
        ) : (
          <>
            <p>Erkenntnisse erscheinen ab {MIN_DAYS} Tagen mit Abend-Review.</p>
            <p className="muted">{eligibleDays(data)} von {MIN_DAYS} Tagen erfasst</p>
          </>
        )}
      </Link>
    </div>
  );
}

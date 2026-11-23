export default function Placeholder({ title, phase }: { title: string; phase?: number }) {
  return (
    <>
      <h1>{title}</h1>
      <p className="lead">
        {phase ? `Dieser Bereich wird in Phase ${phase} gebaut.` : "Nutze die Navigation, um zurückzugehen."}
      </p>
    </>
  );
}

import { NavLink, Outlet } from "react-router-dom";

const TABS = [
  { to: "/auswertung", label: "Impulse", end: true },
  { to: "/auswertung/lebensrad", label: "Lebensrad" },
  { to: "/auswertung/muster", label: "Muster" },
];

export default function Auswertung() {
  return (
    <>
      <h1>Auswertung</h1>
      <div className="tabs" role="tablist">
        {TABS.map((t) => <NavLink key={t.to} to={t.to} end={t.end} className="tab">{t.label}</NavLink>)}
      </div>
      <Outlet />
    </>
  );
}

import { NavLink, Outlet, Route, Routes } from "react-router-dom";
import { BarChart3, Home, Sunrise, Wind } from "lucide-react";
import Abend from "./pages/Abend";
import Auswertung from "./pages/Auswertung";
import Einstellungen from "./pages/Einstellungen";
import AuswertungImpulse from "./pages/AuswertungImpulse";
import AuswertungMuster from "./pages/AuswertungMuster";
import Wochenrueckblick from "./pages/Wochenrueckblick";
import ExercisePage from "./pages/Exercise";
import Heute from "./pages/Heute";
import Lebensrad from "./pages/Lebensrad";
import LebensradBewerten from "./pages/LebensradBewerten";
import Morgen from "./pages/Morgen";
import Placeholder from "./pages/Placeholder";
import RoutineFlow from "./pages/RoutineFlow";
import Routinen from "./pages/Routinen";
import Support from "./pages/Support";
import StressState from "./pages/StressState";

const NAV = [
  { to: "/", label: "Heute", Icon: Home },
  { to: "/routinen", label: "Routinen", Icon: Sunrise },
  { to: "/support", label: "Support", Icon: Wind },
  { to: "/auswertung", label: "Auswertung", Icon: BarChart3 },
];

function Layout() {
  return (
    <>
      <nav className="nav" aria-label="Hauptnavigation">
        <div className="brand">Bei mir</div>
        {NAV.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} end={to === "/"}>
            <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <main>
        <div className="page"><Outlet /></div>
      </main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Heute />} />
        <Route path="routinen" element={<Routinen />} />
        <Route path="routine/:slotName" element={<RoutineFlow />} />
        <Route path="check-in/morgen" element={<Morgen />} />
        <Route path="check-in/abend" element={<Abend />} />
        <Route path="support" element={<Support />} />
        <Route path="support/:stateId" element={<StressState />} />
        <Route path="support/:stateId/:exerciseId" element={<ExercisePage />} />
        <Route path="lebensrad/bewerten" element={<LebensradBewerten />} />
        <Route path="wochenrueckblick" element={<Wochenrueckblick />} />
        <Route path="auswertung" element={<Auswertung />}>
          <Route index element={<AuswertungImpulse />} />
          <Route path="lebensrad" element={<Lebensrad />} />
          <Route path="muster" element={<AuswertungMuster />} />
        </Route>
        <Route path="einstellungen" element={<Einstellungen />} />
        <Route path="*" element={<Placeholder title="Seite nicht gefunden" />} />
      </Route>
    </Routes>
  );
}

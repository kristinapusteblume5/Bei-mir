// Kleine Zierformen: ein Funkeln und eine geschwungene Linie.
// Sie sind rein dekorativ und werden Vorlesehilfen nicht angesagt.

export function Funkeln({ className = "", size = 26 }: { className?: string; size?: number }) {
  return (
    <svg className={`deko ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0c.6 6.2 5.2 10.8 12 12-6.8 1.2-11.4 5.8-12 12-.6-6.2-5.2-10.8-12-12C6.8 10.8 11.4 6.2 12 0z"
        fill="currentColor" />
    </svg>
  );
}

export function Schwung({ className = "", width = 120 }: { className?: string; width?: number }) {
  return (
    <svg className={`deko ${className}`} width={width} height={width * 0.38} viewBox="0 0 120 46" aria-hidden="true" fill="none">
      <path d="M2 30C14 6 30 2 40 14c8 10-6 20-12 13C21 19 35 6 52 10c14 3 18 18 30 20 10 2 20-4 36-16"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

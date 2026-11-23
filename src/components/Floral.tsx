// Florale Zierformen. Rein dekorativ, Vorlesehilfen überspringen sie.

export function Zweig({ className = "", width = 150 }: { className?: string; width?: number }) {
  return (
    <svg className={`deko ${className}`} width={width} height={width * 0.62} viewBox="0 0 150 93" fill="none" aria-hidden="true">
      <path d="M8 88C30 72 52 52 70 30c10-12 22-22 38-26" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M36 62c-8-6-10-16-4-23 7 3 11 13 4 23zM44 54c10-2 18 3 19 11-8 3-17-2-19-11z"
        fill="currentColor" opacity="0.9" />
      <path d="M62 38c-7-7-7-17 0-23 6 5 7 15 0 23zM70 32c10-3 18 1 20 9-8 4-17 0-20-9z"
        fill="currentColor" opacity="0.75" />
      <path d="M90 16c-5-7-3-16 4-20 4 6 3 15-4 20z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function Bluete({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg className={`deko ${className}`} width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      {[0, 60, 120, 180, 240, 300].map((grad) => (
        <ellipse key={grad} cx="20" cy="10.5" rx="5.4" ry="9" fill="currentColor" opacity="0.85"
          transform={`rotate(${grad} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="4.4" fill="var(--papier)" />
    </svg>
  );
}

// Geschwungene Linie mit Schlaufe, wie unter einer Überschrift.
export function Schwung({ className = "", width = 120 }: { className?: string; width?: number }) {
  return (
    <svg className={`deko schwung ${className}`} width={width} height={width * 0.42} viewBox="0 0 120 50" fill="none" aria-hidden="true">
      <path d="M4 34C22 8 48 4 56 20c6 12-8 22-14 12-5-9 9-18 26-8 14 8 22-2 30-14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function Halme({ className = "", width = 110 }: { className?: string; width?: number }) {
  return (
    <svg className={`deko ${className}`} width={width} height={width * 0.52} viewBox="0 0 110 57" fill="none" aria-hidden="true">
      <path d="M12 56C12 36 20 20 36 8M40 56C40 38 46 22 60 10M68 56c0-16 6-30 18-40" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="36" cy="7" r="4.2" fill="currentColor" />
      <circle cx="60" cy="9" r="3.4" fill="currentColor" opacity="0.8" />
      <circle cx="86" cy="15" r="3.8" fill="currentColor" opacity="0.65" />
    </svg>
  );
}

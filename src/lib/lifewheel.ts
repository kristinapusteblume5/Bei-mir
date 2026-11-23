export function weekLabel(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("de-DE", { day: "numeric", month: "short" });
}

export const fmt = (n: number): string => n.toLocaleString("de-DE", { maximumFractionDigits: 1 });

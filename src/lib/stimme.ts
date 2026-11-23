// Sucht die beste deutsche Stimme des Geräts. Reihenfolge: hochwertige Varianten zuerst.
const GUT = ["premium", "enhanced", "neural", "siri", "google", "anna", "petra", "markus", "yannick"];

export function besteStimme(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const alle = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("de"));
  if (alle.length === 0) return null;
  const punkte = (v: SpeechSynthesisVoice) => {
    const name = v.name.toLowerCase();
    let p = GUT.findIndex((g) => name.includes(g));
    if (p < 0) p = GUT.length;
    return p + (v.localService ? 0 : 0.5); // lokale Stimmen klingen ohne Verzögerung
  };
  return [...alle].sort((a, b) => punkte(a) - punkte(b))[0];
}

// Spricht einen Satz ruhig und mit kleiner Pause danach.
export function sprich(text: string, stimme: SpeechSynthesisVoice | null): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text.endsWith(".") ? text : `${text}.`);
  u.lang = "de-DE";
  u.rate = 0.82;
  u.pitch = 0.98;
  u.volume = 1;
  if (stimme) u.voice = stimme;
  window.speechSynthesis.speak(u);
}

export function stimmeStoppen(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

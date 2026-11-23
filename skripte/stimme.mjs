#!/usr/bin/env node
// Erzeugt Sprachaufnahmen aus den Texten in src/content/gesprochen.ts.
//
// Aufruf:   node skripte/stimme.mjs
//           node skripte/stimme.mjs --stimme Anna --musik public/audio/ruhe.mp3
//
// Auf dem Mac nutzt das Skript die eingebaute Sprachausgabe (Befehl "say").
// Lade dir vorher unter Systemeinstellungen > Bedienungshilfen > Gesprochene Inhalte
// eine hochwertige deutsche Stimme herunter, zum Beispiel "Anna (Premium)".
//
// Liegt ffmpeg vor, wird die Stimme zusätzlich mit Musik gemischt.
// Ohne ffmpeg entstehen reine Sprachdateien, das reicht für die App.

import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const stimme = opt("stimme", "Anna");
const musik = opt("musik", null);
const pause = Number(opt("pause", "2")); // Sekunden Stille zwischen den Sätzen
const ziel = "public/audio/stimme";

function hat(cmd) {
  try { execSync(`command -v ${cmd}`, { stdio: "ignore" }); return true; } catch { return false; }
}

if (process.platform !== "darwin") {
  console.error("Dieses Skript nutzt die Sprachausgabe von macOS. Auf anderen Systemen");
  console.error("nimm die Texte selbst auf und lege sie als MP3 unter public/audio/stimme/ ab.");
  process.exit(1);
}
if (!hat("say")) { console.error("Der Befehl 'say' wurde nicht gefunden."); process.exit(1); }
const ffmpeg = hat("ffmpeg");
if (!ffmpeg) console.warn("Hinweis: ffmpeg fehlt. Es entstehen AIFF-Dateien ohne Musik.\n");

// Texte aus der TypeScript-Datei lesen, ohne sie auszuführen.
const quelle = readFileSync("src/content/gesprochen.ts", "utf8");
const bloecke = [...quelle.matchAll(/(\w+):\s*\{\s*gesprochen:\s*\[([\s\S]*?)\]/g)];
if (bloecke.length === 0) {
  console.error("Keine Texte gefunden. Trage sie in src/content/gesprochen.ts ein.");
  process.exit(1);
}

mkdirSync(ziel, { recursive: true });
const tmp = ".stimme-tmp";
mkdirSync(tmp, { recursive: true });

for (const [, id, inhalt] of bloecke) {
  const saetze = [...inhalt.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  if (saetze.length === 0) continue;

  // Stille zwischen den Sätzen entsteht über Pausen im Text selbst.
  const text = saetze.join(`${"[[slnc " + pause * 1000 + "]]"} `);
  const aiff = join(tmp, `${id}.aiff`);
  execFileSync("say", ["-v", stimme, "-r", "150", "-o", aiff, text]);

  if (!ffmpeg) {
    execFileSync("cp", [aiff, join(ziel, `${id}.aiff`)]);
    console.log(`✓ ${ziel}/${id}.aiff`);
    continue;
  }
  const mp3 = join(ziel, `${id}.mp3`);
  if (musik && existsSync(musik)) {
    // Musik leise unter die Stimme legen und auf deren Länge kürzen.
    execFileSync("ffmpeg", ["-y", "-i", aiff, "-i", musik, "-filter_complex",
      "[1:a]volume=0.18[m];[0:a][m]amix=inputs=2:duration=first:dropout_transition=3[a]",
      "-map", "[a]", "-codec:a", "libmp3lame", "-q:a", "4", mp3], { stdio: "ignore" });
  } else {
    execFileSync("ffmpeg", ["-y", "-i", aiff, "-codec:a", "libmp3lame", "-q:a", "4", mp3], { stdio: "ignore" });
  }
  console.log(`✓ ${mp3}  (${saetze.length} Sätze)`);
}

rmSync(tmp, { recursive: true, force: true });
console.log("\nFertig. Trage die Dateien in src/content/gesprochen.ts als \"stimme\" ein, zum Beispiel:");
console.log('  doppelseufzer: { stimme: "/audio/stimme/doppelseufzer.mp3" }');

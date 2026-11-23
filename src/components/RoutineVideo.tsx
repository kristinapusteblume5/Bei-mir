import { useState } from "react";

const DATEI = /\.(mp4|webm|ogv|ogg|mov)(\?.*)?$/i;

// Erkennt YouTube- und Vimeo-Links und baut daraus eine Einbettung
// ohne Werbe-Cookies (youtube-nocookie bzw. dnt bei Vimeo).
function embedUrl(src: string): string | null {
  try {
    const u = new URL(src);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}?rel=0`;
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v") ?? u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null;
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}?dnt=1` : null;
    }
    return null;
  } catch {
    return null;
  }
}

export default function RoutineVideo({ src, title }: { src: string; title: string }) {
  const [fehlt, setFehlt] = useState(false);
  const eigeneDatei = src.startsWith("/") || DATEI.test(src);
  const embed = eigeneDatei ? null : embedUrl(src);

  if (embed) {
    return (
      <div className="videowrap">
        <iframe
          className="video" src={embed} title={title} loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
        />
      </div>
    );
  }
  if (!eigeneDatei && src) {
    return (
      <p className="videonote">
        <a href={src} target="_blank" rel="noreferrer" className="pill">Video öffnen</a>
        <span className="muted"> Öffnet beim Anbieter in einem neuen Tab.</span>
      </p>
    );
  }
  if (fehlt) {
    return (
      <p className="videonote muted">
        Video nicht gefunden. Lege es unter <code>public{src}</code> ab oder trage unter „Bearbeiten“ einen Link ein.
      </p>
    );
  }
  return (
    <div className="videowrap">
      <video className="video" controls preload="metadata" playsInline title={title} onError={() => setFehlt(true)}>
        <source src={src} />
        Dein Browser kann dieses Video nicht abspielen.
      </video>
    </div>
  );
}

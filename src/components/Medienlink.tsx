import { ExternalLink, Headphones } from "lucide-react";
import type { Medium } from "../content/exercises";

// Spotify-Folgen werden als Player eingebettet, alles andere als Link geöffnet.
function spotifyEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.endsWith("spotify.com")) return null;
    const teile = u.pathname.split("/").filter(Boolean);
    const art = teile[0];
    const id = teile[1];
    if (!id || !["episode", "show", "track", "playlist", "album"].includes(art)) return null;
    return `https://open.spotify.com/embed/${art}/${id}`;
  } catch {
    return null;
  }
}

export default function Medienlink({ medium }: { medium: Medium }) {
  const embed = spotifyEmbed(medium.url);
  if (embed) {
    return (
      <div className="medien">
        <iframe
          className="spotify" src={embed} title={medium.label} loading="lazy"
          allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <p className="muted">
          <Headphones size={14} strokeWidth={2} aria-hidden="true" /> {medium.hinweis ?? "Zum Anhören"}
          {" · "}
          <a href={medium.url} target="_blank" rel="noreferrer" className="link">in der App öffnen</a>
        </p>
      </div>
    );
  }
  return (
    <p className="medien">
      <a href={medium.url} target="_blank" rel="noreferrer" className="pill">
        <ExternalLink size={16} strokeWidth={2.2} aria-hidden="true" /> {medium.label}
      </a>
      {medium.hinweis && <span className="muted"> {medium.hinweis}</span>}
    </p>
  );
}

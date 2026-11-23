// Dauerhafte Ablage in IndexedDB. Der Browser räumt sie deutlich seltener weg
// als localStorage, besonders in Safari. localStorage bleibt als Spiegel
// bestehen, damit die App auch beim allerersten Bild sofort Daten hat.
const DB = "bei-mir";
const STORE = "daten";
const KEY = "app";

function offen(): Promise<IDBDatabase> {
  return new Promise((ok, fehler) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => ok(req.result);
    req.onerror = () => fehler(req.error);
  });
}

export async function dbLesen<T>(): Promise<T | null> {
  if (typeof indexedDB === "undefined") return null;
  try {
    const db = await offen();
    return await new Promise<T | null>((ok) => {
      const req = db.transaction(STORE, "readonly").objectStore(STORE).get(KEY);
      req.onsuccess = () => ok((req.result as T) ?? null);
      req.onerror = () => ok(null);
    });
  } catch {
    return null;
  }
}

export async function dbSchreiben(daten: unknown): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  try {
    const db = await offen();
    await new Promise<void>((ok) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(daten, KEY);
      tx.oncomplete = () => ok();
      tx.onerror = () => ok();
    });
  } catch {
    // Schlägt das Schreiben fehl, bleibt der localStorage-Spiegel bestehen.
  }
}

export async function dbLeeren(): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  try {
    const db = await offen();
    await new Promise<void>((ok) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(KEY);
      tx.oncomplete = () => ok();
      tx.onerror = () => ok();
    });
  } catch {
    // ignorieren
  }
}

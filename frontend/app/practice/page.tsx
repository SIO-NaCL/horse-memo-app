"use client";

import { useEffect, useState } from "react";

type Horse = { id: number; name: string };
type Note = {
  id: number;
  horse: number; // DRF側が "horse" で返す想定（horse_idじゃなく）
  title: string;
  body: string;
  url: string;
  created_at: string;
  updated_at: string;
};

// 配列 or ページネーション({results: [...]})の両方に対応
function normalizeList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];

  if (typeof data === "object" && data !== null && "results" in data) {
    const results = (data as { results?: unknown }).results;
    if (Array.isArray(results)) return results as T[];
  }

  return [];
}

export default function PracticePage() {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [horseId, setHorseId] = useState<string>("1");

  const [horsesStatus, setHorsesStatus] = useState<string>("idle");
  const [notesStatus, setNotesStatus] = useState<string>("idle");
  const [error, setError] = useState<string | null>(null);

  // 起動時にHorse一覧をGET
  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setHorsesStatus("loading...");
        const res = await fetch("/api/memo/horses/");
        if (!res.ok) {
          throw new Error(`GET /api/horses/ failed: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setHorses(normalizeList<Horse>(data));
        setHorsesStatus("ok");
      } catch (e) {
        setHorsesStatus("error");
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
  }, []);

  // ボタンでNote一覧をGET
  const fetchNotes = async () => {
    try {
      setError(null);
      setNotesStatus("loading...");
      const res = await fetch(`/api/memo/notes/?horse=${encodeURIComponent(horseId)}`);
      if (!res.ok) {
        throw new Error(`GET /api/notes/?horse=... failed: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setNotes(normalizeList<Note>(data));
      setNotesStatus("ok");
    } catch (e) {
      setNotesStatus("error");
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <main style={{ padding: 16, fontFamily: "sans-serif" }}>
      <h1>API疎通テスト（practice）</h1>

      <section style={{ marginTop: 16 }}>
        <h2>1) Horses: GET /api/horses/</h2>
        <div>Status: {horsesStatus}</div>
        <ul>
          {horses.map((h) => (
            <li key={h.id}>
              {h.id}: {h.name}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 16 }}>
        <h2>2) Notes: GET /api/notes/?horse=ID</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label>
            horseId:{" "}
            <input
              value={horseId}
              onChange={(e) => setHorseId(e.target.value)}
              style={{ width: 80 }}
            />
          </label>
          <button onClick={fetchNotes}>Fetch Notes</button>
          <span>Status: {notesStatus}</span>
        </div>

        <ol>
          {notes.map((n) => (
            <li key={n.id} style={{ marginTop: 8 }}>
              <div>
                <b>{n.title}</b>（id={n.id} / horse={n.horse}）
              </div>
              <div style={{ whiteSpace: "pre-wrap" }}>{n.body}</div>
              <div>
                url: {n.url ? <a href={n.url} target="_blank" rel="noreferrer">{n.url}</a> : "(none)"}
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                created_at: {n.created_at} / updated_at: {n.updated_at}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {error && (
        <section style={{ marginTop: 16, color: "crimson" }}>
          <h2>Error</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>
        </section>
      )}
    </main>
  );
}

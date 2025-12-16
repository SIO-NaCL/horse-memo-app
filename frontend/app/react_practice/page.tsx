"use client";
import { useState } from "react";

type Item = { id: string; label: string; content: string };

const items: Item[] = [
  { id: "home", label: "Home", content: "ここはHomeです" },
  { id: "about", label: "About", content: "ここはAboutです" },
  { id: "settings", label: "Settings", content: "ここはSettingsです" },
  { id: "settings2", label: "Settings2", content: "ここはSettings2です" },
];

export default function Page() {
  return <TwoColumnLayout items={items} />;
}

function TwoColumnLayout({ items }: { items: Item[] }) {
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");

  const selected = items.find((x) => x.id === selectedId) ?? items[0];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", height: "100vh" }}>
      <Sidebar items={items} selectedId={selectedId} onSelect={setSelectedId} />
      <Main item={selected} />
    </div>
  );
}

function Sidebar({
  items,
  selectedId,
  onSelect,
}: {
  items: Item[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside style={{ borderRight: "1px solid #ccc", padding: 12 }}>
      <h3>Menu</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((it) => (
          <li key={it.id}>
            <button
              onClick={() => onSelect(it.id)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "8px 10px",
                marginBottom: 6,
                fontWeight: it.id === selectedId ? 700 : 400,
              }}
            >
              {it.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function Main({ item }: { item?: Item }) {
  return (
    <main style={{ padding: 16 }}>
      <h1>{item?.label}</h1>
      <p>{item?.content}</p>
    </main>
  );
}

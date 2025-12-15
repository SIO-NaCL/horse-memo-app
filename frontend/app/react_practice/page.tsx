"use client";
import { useMemo, useState } from "react";

type Values = { name: string; email: string; note: string };
type Errors = Partial<Record<keyof Values, string>>;

export default function Page() {
  const [v, setV] = useState<Values>({ name: "", email: "", note: "" });
  const [submitted, setSubmitted] = useState(false);

  const errors: Errors = useMemo(() => {
    const e: Errors = {};
    if (!v.name.trim()) e.name = "名前は必須です";
    if (!v.email.trim()) e.email = "メールは必須です";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "メール形式が不正です";
    if (v.note.trim().length < 10) e.note = "メモは10文字以上で入力してください";
    return e;
  }, [v]);

  const isValid = Object.keys(errors).length === 0;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    alert("送信OK: " + JSON.stringify(v, null, 2));
  };

  const showError = (key: keyof Values) => submitted && errors[key];

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 520 }}>
      <h1>必須チェック付きフォーム（最小）</h1>

      
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <div>
          <label>
            名前（必須）
            <input
              value={v.name}
              onChange={(e) => setV({ ...v, name: e.target.value })}
              style={{ display: "block", width: "100%", padding: 8 }}
            />
          </label>
          {showError("name") && <p style={{ color: "crimson", margin: "6px 0 0" }}>{errors.name}</p>}
        </div>

        <div>
          <label>
            メール（必須）
            <input
              value={v.email}
              onChange={(e) => setV({ ...v, email: e.target.value })}
              style={{ display: "block", width: "100%", padding: 8 }}
            />
          </label>
          {showError("email") && <p style={{ color: "crimson", margin: "6px 0 0" }}>{errors.email}</p>}
        </div>

        <div>
          <label>
            メモ（10文字以上）
            <textarea
              value={v.note}
              onChange={(e) => setV({ ...v, note: e.target.value })}
              style={{ display: "block", width: "100%", padding: 8, minHeight: 90 }}
            />
          </label>
          {showError("note") && <p style={{ color: "crimson", margin: "6px 0 0" }}>{errors.note}</p>}
        </div>

        <button type="submit" disabled={!isValid} style={{ padding: 10 }}>
          送信
        </button>

        {!isValid && submitted && (
          <p style={{ color: "#666" }}>未入力/不正な項目があります。赤いメッセージを確認してください。</p>
        )}
      </form>
    </main>
  );
}

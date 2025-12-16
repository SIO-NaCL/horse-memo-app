import type { Horse, Note } from "./types";

export const DUMMY_HORSES: Horse[] = [
  { id: 1, name: "イクイノックス" },
  { id: 2, name: "ドウデュース" },
  { id: 3, name: "ソールオリエンス" },
];

export const DUMMY_NOTES: Note[] = [
  {
    id: 1,
    horse_id: 1,
    title: "東京2000強い",
    body: "上がり性能が高いので府中の長い直線が合う。",
    url: "",
    created_at: "2025-12-01T10:00:00+09:00",
    updated_at: "2025-12-02T09:00:00+09:00",
  },
  {
    id: 2,
    horse_id: 1,
    title: "右回りは要確認",
    body: "右回りでのパフォーマンスは要チェック。",
    url: "https://example.com",
    created_at: "2025-12-03T12:00:00+09:00",
    updated_at: "2025-12-04T08:30:00+09:00",
  },
  {
    id: 3,
    horse_id: 2,
    title: "気性面メモ",
    body: "パドックでの入れ込み具合を要観察。",
    url: "",
    created_at: "2025-12-02T15:00:00+09:00",
    updated_at: "2025-12-05T16:00:00+09:00",
  },
];

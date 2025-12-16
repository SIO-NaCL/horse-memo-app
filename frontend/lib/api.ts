// frontend/lib/api.ts

/**----------------------------------------------------------------------------------------------------------
 * GET専用の共通関数
 * - path: 例 "/api/memo/horses/"
 * - signal: AbortControllerのsignal（画面遷移/アンマウント時にリクエストを中断したい時に使う）
 */
export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  // fetchでAPIを呼び出す
  // cache: "no-store" は開発中にキャッシュで古いデータが表示されるのを避けるため
  // signal を渡すと、AbortController.abort() でこのリクエストを中断できる
  const res = await fetch(path, { cache: "no-store", signal });

  // HTTPステータスが 200-299 以外ならエラー扱いにする
  // これにより呼び出し元は try/catch で統一的にエラー処理できる
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status} ${res.statusText}`);
  }

  // レスポンスをJSONとしてパースして返す
  // 呼び出し側で apiGet<YourType>(...) のように型を指定して受け取る
  return (await res.json()) as T;
}


/**----------------------------------------------------------------------------------------------------------
 * POST共通関数（JSON送信）
 * - path: 例 "/api/memo/notes/"
 * - body: 送るJSON（例: { horse: 1, title: "...", body: "...", url: "..." })
 */
export async function apiPost<TResponse, TBody extends object>(
  path: string,
  body: TBody,
  signal?: AbortSignal
): Promise<TResponse> {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal,
  });

  if (!res.ok) {
    // DRFのバリデーションエラー等を読める範囲でメッセージ化
    let detail = "";
    try {
      const data = (await res.json()) as unknown;
      detail = JSON.stringify(data);
    } catch {
      // JSONじゃない場合は無視
    }
    throw new Error(
      `POST ${path} failed: ${res.status} ${res.statusText}${detail ? ` ${detail}` : ""}`
    );
  }

  return (await res.json()) as TResponse;
}



/**----------------------------------------------------------------------------------------------------------
 * APIの一覧レスポンスを「配列」に正規化する関数
 * - DRFでページネーションOFFの場合: [ {...}, {...} ]
 * - DRFでページネーションONの場合: { count, next, previous, results: [ {...}, {...} ] }
 *
 * 上のどちらで返ってきても、最終的に `T[]` に揃えて扱えるようにする。
 */
export function normalizeList<T>(data: unknown): T[] {
  // すでに配列ならそのまま配列として扱う
  if (Array.isArray(data)) return data as T[];

  // オブジェクトで、かつ "results" キーを持っている場合（ページネーションONの形式）
  if (typeof data === "object" && data !== null && "results" in data) {
    // results の中身は unknown として取り出して安全にチェックする
    const results = (data as { results?: unknown }).results;

    // results が配列ならそれを返す
    if (Array.isArray(results)) return results as T[];
  }

  // どちらでもなければ「一覧として扱えない」ので空配列を返す
  return [];
}

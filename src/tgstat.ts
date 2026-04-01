export type TgstatPostStat = {
  postId: number;
  viewsCount: number;
  sharesCount: number;
  commentsCount: number;
  reactionsCount: number;
};

function asNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export async function fetchTgstatPostsStats(params: {
  apiKey: string;
  channelId: string;
  postIds: number[];
}): Promise<Map<number, TgstatPostStat>> {
  const url = new URL("https://api.tgstat.ru/posts/stat-multi");
  url.searchParams.set("token", params.apiKey);
  url.searchParams.set("channelId", params.channelId);

  // По документации параметр называется postsIds
  url.searchParams.set("postsIds", params.postIds.join(","));

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`TGStat stat-multi failed: ${res.status} ${body}`);
  }

  const json: unknown = await res.json();

  // Примерная форма ответа TGStat: { ok: true, result: [...] }
  // Не завязываемся на точные типы, парсим аккуратно
  const obj = json as { ok?: boolean; result?: unknown };
  if (obj.ok !== true) {
    throw new Error(`TGStat stat-multi returned ok=false: ${JSON.stringify(json)}`);
  }

  const result = Array.isArray(obj.result) ? obj.result : [];
  const map = new Map<number, TgstatPostStat>();

  for (const item of result) {
    const it = item as Record<string, unknown>;

    const postId = asNumber(it.postId ?? it.messageId ?? it.id);
    if (postId <= 0) continue;

    const stat: TgstatPostStat = {
      postId,
      viewsCount: asNumber(it.viewsCount),
      sharesCount: asNumber(it.sharesCount),
      commentsCount: asNumber(it.commentsCount),
      reactionsCount: asNumber(it.reactionsCount)
    };

    map.set(postId, stat);
  }

  return map;
}

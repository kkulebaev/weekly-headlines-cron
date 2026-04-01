export type TelemetrMessageViews = {
  views: number;
  forwards_count: number;
  comments_count: number;
  reactions_count: number;
};

function asNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export async function fetchTelemetrMessageViews(params: {
  apiKey: string;
  channelInternalId: string;
  messageId: number;
  aggregation?: "day" | "hour";
}): Promise<TelemetrMessageViews> {
  const url = new URL("https://api.telemetr.io/v1/messages/views");
  url.searchParams.set("internal_id", params.channelInternalId);
  url.searchParams.set("message_id", String(params.messageId));
  url.searchParams.set("aggregation", params.aggregation ?? "day");

  const res = await fetch(url, {
    headers: {
      "X-API-Key": params.apiKey
    }
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Telemetr messages/views failed: ${res.status} url=${url.toString()} ${body}`
    );
  }

  const json: unknown = await res.json();
  const obj = json as Record<string, unknown>;

  return {
    views: asNumber(obj.views),
    forwards_count: asNumber(obj.forwards_count),
    comments_count: asNumber(obj.comments_count),
    reactions_count: asNumber(obj.reactions_count)
  };
}

export async function fetchTelemetrStatsForMessages(params: {
  apiKey: string;
  channelInternalId: string;
  messageIds: number[];
  concurrency?: number;
}): Promise<Map<number, TelemetrMessageViews>> {
  const concurrency = Math.max(1, params.concurrency ?? 5);

  const results = new Map<number, TelemetrMessageViews>();
  let idx = 0;

  async function worker(): Promise<void> {
    while (idx < params.messageIds.length) {
      const current = params.messageIds[idx];
      idx += 1;
      if (typeof current !== "number" || current <= 0) continue;

      const stat = await fetchTelemetrMessageViews({
        apiKey: params.apiKey,
        channelInternalId: params.channelInternalId,
        messageId: current
      });

      results.set(current, stat);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, params.messageIds.length) }, () => worker());
  await Promise.all(workers);

  return results;
}

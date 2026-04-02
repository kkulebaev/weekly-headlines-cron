import { SQL } from "bun";

export type WeeklyPost = {
  messageId: number;
  postUrl: string;
  headline: string;
};

export async function fetchWeeklyPosts(params: {
  databaseUrl: string;
  maxItems: number;
}): Promise<WeeklyPost[]> {
  // Bun встроенно поддерживает PostgreSQL через `bun:sql`
  const db = new SQL(params.databaseUrl);

  const rows = await db<{
    messageId: number | null;
    postUrl: string | null;
    headline: string | null;
  }>`
    select
      "messageId" as "messageId",
      "postUrl" as "postUrl",
      headline as headline
    from "TelegramPost"
    where "createdAt" >= now() - interval '7 days'
    order by "createdAt" desc
    limit ${params.maxItems}
  `;

  // Закрываем соединение явно, чтобы в Railway не висели хэндлы
  await db.close();

  return rows
    .map((r) => ({
      messageId: r.messageId ?? 0,
      postUrl: r.postUrl ?? "",
      headline: r.headline ?? ""
    }))
    .filter((p) => p.messageId > 0)
    .filter((p) => p.postUrl.trim().length > 0)
    .filter((p) => p.headline.trim().length > 0);
}

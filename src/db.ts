import { Client } from "pg";

export type WeeklyPost = {
  messageId: number;
  postUrl: string;
  headline: string;
};

export async function fetchWeeklyPosts(params: {
  databaseUrl: string;
  maxItems: number;
}): Promise<WeeklyPost[]> {
  // Простой вариант без ORM: подключаемся по DATABASE_URL Railway
  const client = new Client({ connectionString: params.databaseUrl });
  await client.connect();

  try {
    const query = `
      select
        "messageId" as "messageId",
        "postUrl" as "postUrl",
        headline as headline
      from "TelegramPost"
      where "createdAt" >= now() - interval '7 days'
      order by "createdAt" desc
      limit $1
    `;

    const result = await client.query<{
      messageId: number | null;
      postUrl: string | null;
      headline: string | null;
    }>(query, [params.maxItems]);

    return result.rows
      .map((r) => ({
        messageId: r.messageId ?? 0,
        postUrl: r.postUrl ?? "",
        headline: r.headline ?? ""
      }))
      .filter((p) => p.messageId > 0)
      .filter((p) => p.postUrl.trim().length > 0)
      .filter((p) => p.headline.trim().length > 0);
  } finally {
    await client.end();
  }
}

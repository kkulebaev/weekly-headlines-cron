import { Client } from "pg";

export async function fetchWeeklyTexts(params: {
  databaseUrl: string;
  maxItems: number;
}): Promise<string[]> {
  // Простой вариант без ORM: подключаемся по DATABASE_URL Railway
  const client = new Client({ connectionString: params.databaseUrl });
  await client.connect();

  try {
    const query = `
      select headline as text
      from "TelegramPost"
      where "createdAt" >= now() - interval '7 days'
      order by "createdAt" desc
      limit $1
    `;

    const result = await client.query<{ text: string | null }>(query, [params.maxItems]);
    return result.rows
      .map((r) => r.text ?? "")
      .filter((t) => t.trim().length > 0);
  } finally {
    await client.end();
  }
}

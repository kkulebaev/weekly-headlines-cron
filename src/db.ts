import { Client } from "pg";

export async function fetchWeeklyTexts(params: {
  databaseUrl: string;
  table: string;
  textColumn: string;
  createdAtColumn: string;
  maxItems: number;
}): Promise<string[]> {
  // Простой вариант без ORM: подключаемся по DATABASE_URL Railway
  const client = new Client({ connectionString: params.databaseUrl });
  await client.connect();

  try {
    // Важно: имена таблицы/колонок нельзя передавать параметрами SQL.
    // Тут оставляем как есть, но полагаемся, что значения приходят из env (trusted).
    const query = `
      select ${params.textColumn} as text
      from ${params.table}
      where ${params.createdAtColumn} >= now() - interval '7 days'
      order by ${params.createdAtColumn} desc
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

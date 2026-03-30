import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_CHAT_ID: z.string().min(1),

  // Например: "notes". Используется для простого SELECT.
  HEADLINES_TABLE: z.string().min(1).default("headlines"),

  // Поле, из которого берём текст
  TEXT_COLUMN: z.string().min(1).default("text"),

  // Поле для фильтра по дате
  CREATED_AT_COLUMN: z.string().min(1).default("created_at"),

  // Сколько слов брать из text
  WORDS_PER_ITEM: z.coerce.number().int().positive().default(6),

  // Сколько строк максимум в одном сообщении
  MAX_ITEMS: z.coerce.number().int().positive().default(50)
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      `Invalid env: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`
    );
  }
  return parsed.data;
}

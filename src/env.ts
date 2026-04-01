import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_CHAT_ID: z.string().min(1),

  // Таблица/колонки зафиксированы под схему проекта

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

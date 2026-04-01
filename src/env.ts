export type Env = {
  DATABASE_URL: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;

  TELEMETR_API_KEY: string;
  TELEMETR_CHANNEL_INTERNAL_ID: string;
};

function requireEnv(name: keyof Env): string {
  const value = process.env[name];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

export function getEnv(): Env {
  return {
    DATABASE_URL: requireEnv("DATABASE_URL"),
    TELEGRAM_BOT_TOKEN: requireEnv("TELEGRAM_BOT_TOKEN"),
    TELEGRAM_CHAT_ID: requireEnv("TELEGRAM_CHAT_ID"),

    TELEMETR_API_KEY: requireEnv("TELEMETR_API_KEY"),
    TELEMETR_CHANNEL_INTERNAL_ID: requireEnv("TELEMETR_CHANNEL_INTERNAL_ID")
  };
}

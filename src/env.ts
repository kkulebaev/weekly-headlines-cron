export type Env = {
  DATABASE_URL: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
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
    TELEGRAM_CHAT_ID: requireEnv("TELEGRAM_CHAT_ID")
  };
}

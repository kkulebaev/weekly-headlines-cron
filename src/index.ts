import "dotenv/config";

import { getEnv } from "./env.js";
import { fetchWeeklyTexts } from "./db.js";
import { formatWeeklyMessage } from "./format.js";
import { sendTelegramMessage } from "./telegram.js";

async function main(): Promise<void> {
  const env = getEnv();

  const texts = await fetchWeeklyTexts({
    databaseUrl: env.DATABASE_URL,
    maxItems: env.MAX_ITEMS
  });

  const message = formatWeeklyMessage(texts, env.WORDS_PER_ITEM);

  await sendTelegramMessage({
    token: env.TELEGRAM_BOT_TOKEN,
    chatId: env.TELEGRAM_CHAT_ID,
    text: message
  });

  // eslint-disable-next-line no-console
  console.log("Weekly message sent.");
}

main().catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

import { getEnv } from "./env.js";
import { fetchWeeklyPosts } from "./db.js";
import { formatWeeklyMessage } from "./format.js";
import { DEFAULT_DIGEST_LIMIT, pickTopPosts } from "./rank.js";
import { sendTelegramMessage } from "./telegram.js";
import { fetchTgstatPostsStats } from "./tgstat.js";

function formatDateRu(d: Date): string {
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getUTCFullYear());
  return `${dd}.${mm}.${yyyy}`;
}

async function main(): Promise<void> {
  const env = getEnv();

  const weeklyPosts = await fetchWeeklyPosts({
    databaseUrl: env.DATABASE_URL,
    maxItems: 200
  });

  const postIds = weeklyPosts.map((p) => p.messageId);

  const statsByPostId = await fetchTgstatPostsStats({
    apiKey: env.TGSTAT_API_KEY,
    channelId: env.TGSTAT_CHANNEL_ID,
    postIds
  });

  const topPosts = pickTopPosts({
    posts: weeklyPosts,
    statsByPostId,
    limit: DEFAULT_DIGEST_LIMIT
  });

  const dateTo = new Date();
  const dateFrom = new Date(dateTo.getTime() - 7 * 24 * 60 * 60 * 1000);

  const message = formatWeeklyMessage({
    dateFrom: formatDateRu(dateFrom),
    dateTo: formatDateRu(dateTo),
    posts: topPosts
  });

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

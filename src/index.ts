import { fetchWeeklyPosts } from "./db.js";
import { getEnv } from "./env.js";
import { formatWeeklyMessage } from "./format.js";
import { log, logError } from "./log.js";
import { DEFAULT_DIGEST_LIMIT, calcInterestScore, pickTopPosts } from "./rank.js";
import { sendTelegramMessage } from "./telegram.js";
import { fetchTelemetrStatsForMessages } from "./telemetr.js";

function formatDateRu(d: Date): string {
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getUTCFullYear());
  return `${dd}.${mm}.${yyyy}`;
}

async function main(): Promise<void> {
  const env = getEnv();

  const dateTo = new Date();
  const dateFrom = new Date(dateTo.getTime() - 7 * 24 * 60 * 60 * 1000);

  const dateFromStr = formatDateRu(dateFrom);
  const dateToStr = formatDateRu(dateTo);

  log("info", "Weekly digest run started", {
    period: `${dateFromStr}–${dateToStr}`
  });

  const weeklyPosts = await fetchWeeklyPosts({
    databaseUrl: env.DATABASE_URL,
    maxItems: 200
  });

  log("info", "Fetched weekly posts from DB", {
    count: weeklyPosts.length
  });

  if (weeklyPosts.length > 0) {
    log("debug", "Weekly posts preview", {
      items: weeklyPosts.slice(0, 20).map((p) => ({
        messageId: p.messageId,
        headline: p.headline,
        postUrl: p.postUrl
      }))
    });
  }

  const messageIds = weeklyPosts.map((p) => p.messageId);

  log("info", "Fetching Telemetr stats", {
    messages: messageIds.length,
    channelInternalId: env.TELEMETR_CHANNEL_INTERNAL_ID
  });

  const statsByMessageId = await fetchTelemetrStatsForMessages({
    apiKey: env.TELEMETR_API_KEY,
    channelInternalId: env.TELEMETR_CHANNEL_INTERNAL_ID,
    messageIds
  });

  log("info", "Telemetr stats fetched", {
    found: statsByMessageId.size
  });

  const topPosts = pickTopPosts({
    posts: weeklyPosts,
    statsByMessageId,
    limit: DEFAULT_DIGEST_LIMIT
  });

  const topPreview = topPosts.map((p, idx) => {
    const stat = statsByMessageId.get(p.messageId);
    const score = stat ? calcInterestScore(stat) : 0;

    return {
      rank: idx + 1,
      score,
      messageId: p.messageId,
      views: stat?.views ?? 0,
      forwards: stat?.forwards_count ?? 0,
      comments: stat?.comments_count ?? 0,
      reactions: stat?.reactions_count ?? 0,
      headline: p.headline,
      postUrl: p.postUrl
    };
  });

  log("info", "Top posts selected", {
    limit: DEFAULT_DIGEST_LIMIT,
    items: topPreview
  });

  const message = formatWeeklyMessage({
    dateFrom: dateFromStr,
    dateTo: dateToStr,
    posts: topPosts
  });

  log("info", "Sending Telegram message", {
    chatId: env.TELEGRAM_CHAT_ID,
    length: message.length
  });

  await sendTelegramMessage({
    token: env.TELEGRAM_BOT_TOKEN,
    chatId: env.TELEGRAM_CHAT_ID,
    text: message
  });

  log("info", "Weekly digest sent successfully");
}

main().catch((err: unknown) => {
  logError("Weekly digest failed", err);
  process.exitCode = 1;
});

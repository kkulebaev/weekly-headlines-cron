import { DEFAULT_DIGEST_LIMIT } from "./rank.js";
import type { WeeklyPost } from "./db.js";

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function formatWeeklyMessage(params: {
  dateFrom: string;
  dateTo: string;
  posts: WeeklyPost[];
}): string {
  const title = `🔥 <b>Самое интересное за неделю</b> <i>(${params.dateFrom}–${params.dateTo})</i>`;
  const subtitle = `<i>Топ-${DEFAULT_DIGEST_LIMIT} постов недели по вовлечению: что смотрели, обсуждали и репостили чаще всего.</i>`;

  if (params.posts.length === 0) {
    return `${title}\n\n${subtitle}\n\nЗа последнюю неделю постов не нашлось.`;
  }

  const lines = params.posts.map((p) => {
    const safeHeadline = escapeHtml(p.headline.trim());
    const safeUrl = escapeHtml(p.postUrl.trim());
    return `— <a href="${safeUrl}">${safeHeadline}</a>`;
  });

  return `${title}\n\n${subtitle}\n\n${lines.join("\n")}`;
}

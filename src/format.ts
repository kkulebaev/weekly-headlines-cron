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
  if (params.posts.length === 0) {
    return `🗞 Дайджест за неделю (${params.dateFrom}–${params.dateTo})\n\nЗа последнюю неделю постов не нашлось.`;
  }

  const lines = params.posts.map((p, idx) => {
    const title = escapeHtml(p.headline.trim());
    const url = escapeHtml(p.postUrl.trim());
    return `${idx + 1}) <a href="${url}">${title}</a>`;
  });

  return `🗞 Дайджест за неделю (${params.dateFrom}–${params.dateTo})\n\n${lines.join("\n")}`;
}

import type { WeeklyPost } from "./db.js";
import type { TgstatPostStat } from "./tgstat.js";

export const DEFAULT_DIGEST_LIMIT = 10;

// Веса захардкожены по договорённости
const WEIGHT_VIEWS = 1;
const WEIGHT_SHARES = 5;
const WEIGHT_COMMENTS = 8;
const WEIGHT_REACTIONS = 3;

export function calcInterestScore(stat: TgstatPostStat): number {
  return (
    stat.viewsCount * WEIGHT_VIEWS +
    stat.sharesCount * WEIGHT_SHARES +
    stat.commentsCount * WEIGHT_COMMENTS +
    stat.reactionsCount * WEIGHT_REACTIONS
  );
}

export function pickTopPosts(params: {
  posts: WeeklyPost[];
  statsByPostId: Map<number, TgstatPostStat>;
  limit: number;
}): WeeklyPost[] {
  const scored = params.posts
    .map((p) => {
      const stat = params.statsByPostId.get(p.messageId);
      const score = stat ? calcInterestScore(stat) : 0;
      return { post: p, score };
    })
    // сначала по score, затем по свежести (в исходном списке уже desc по createdAt)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, params.limit).map((s) => s.post);
}

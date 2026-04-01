import type { WeeklyPost } from "./db.js";
import type { TelemetrMessageViews } from "./telemetr.js";

export const DEFAULT_DIGEST_LIMIT = 10;

// Веса захардкожены по договорённости
const WEIGHT_VIEWS = 1;
const WEIGHT_SHARES = 5;
const WEIGHT_COMMENTS = 8;
const WEIGHT_REACTIONS = 3;

export function calcInterestScore(stat: TelemetrMessageViews): number {
  return (
    stat.views * WEIGHT_VIEWS +
    stat.forwards_count * WEIGHT_SHARES +
    stat.comments_count * WEIGHT_COMMENTS +
    stat.reactions_count * WEIGHT_REACTIONS
  );
}

export function pickTopPosts(params: {
  posts: WeeklyPost[];
  statsByMessageId: Map<number, TelemetrMessageViews>;
  limit: number;
}): WeeklyPost[] {
  const scored = params.posts
    .map((p) => {
      const stat = params.statsByMessageId.get(p.messageId);
      const score = stat ? calcInterestScore(stat) : 0;
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, params.limit).map((s) => s.post);
}

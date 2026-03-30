export function takeWords(text: string, words: number): string {
  return text
    .trim()
    .split(/\s+/)
    .slice(0, words)
    .join(" ");
}

export function formatWeeklyMessage(items: string[], wordsPerItem: number): string {
  if (items.length === 0) {
    return "За последнюю неделю записей не нашлось.";
  }

  const lines = items.map((t, idx) => {
    const snippet = takeWords(t, wordsPerItem);
    return `${idx + 1}. ${snippet}`;
  });

  return `Заголовки за неделю (${items.length}):\n\n${lines.join("\n")}`;
}

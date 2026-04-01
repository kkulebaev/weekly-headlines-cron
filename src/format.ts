export function formatWeeklyMessage(items: string[]): string {
  if (items.length === 0) {
    return "За последнюю неделю записей не нашлось.";
  }

  const lines = items.map((t, idx) => `${idx + 1}. ${t.trim()}`);

  return `Заголовки за неделю (${items.length}):\n\n${lines.join("\n")}`;
}

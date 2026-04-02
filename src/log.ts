export type LogLevel = "debug" | "info" | "warn" | "error";

const levelOrder: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

function getLogLevel(): LogLevel {
  const raw = process.env.LOG_LEVEL;
  if (raw === "debug" || raw === "info" || raw === "warn" || raw === "error") {
    return raw;
  }
  return "info";
}

function shouldLog(level: LogLevel): boolean {
  return levelOrder[level] >= levelOrder[getLogLevel()];
}

function nowIso(): string {
  return new Date().toISOString();
}

function fmtContext(ctx: Record<string, unknown> | undefined): string {
  if (!ctx) return "";

  const parts: string[] = [];
  for (const [k, v] of Object.entries(ctx)) {
    if (v === undefined) continue;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      parts.push(`${k}=${v}`);
    } else {
      parts.push(`${k}=${JSON.stringify(v)}`);
    }
  }

  return parts.length > 0 ? ` { ${parts.join(" ")} }` : "";
}

export function log(level: LogLevel, message: string, ctx?: Record<string, unknown>): void {
  if (!shouldLog(level)) return;

  const line = `[${level.toUpperCase()}] ${nowIso()} ${message}${fmtContext(ctx)}`;
  // eslint-disable-next-line no-console
  console.log(line);
}

export function logError(message: string, err: unknown, ctx?: Record<string, unknown>): void {
  const extra: Record<string, unknown> = {
    ...ctx,
    err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err
  };
  log("error", message, extra);
}

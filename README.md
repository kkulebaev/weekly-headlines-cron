# Weekly Headlines Cron

<p align="center">
  <img alt="Weekly Headlines Cron banner" src="https://capsule-render.vercel.app/api?type=waving&color=0:111827,100:2563eb&height=180&section=header&text=Weekly%20Headlines%20Cron&fontSize=42&fontColor=ffffff" />
</p>

<p align="center">
  <img alt="Platform" src="https://img.shields.io/badge/platform-Railway-7B3FE4" />
  <img alt="Language" src="https://img.shields.io/badge/language-TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img alt="Runtime" src="https://img.shields.io/badge/runtime-Bun-000000?logo=bun&logoColor=white" />
  <img alt="Database" src="https://img.shields.io/badge/database-PostgreSQL-4169E1?logo=postgresql&logoColor=white" />
</p>

A tiny **Railway Scheduler** job that runs once a week:

1. Connects to Postgres via `DATABASE_URL`
2. Fetches posts for the last 7 days from your DB
3. Ranks them by engagement (Telemetr stats)
4. Publishes a digest post to a Telegram channel

## Runtime

This project runs on **Bun**:

- No build step
- Runs TypeScript directly (`bun run`)
- Uses Bun built-in Postgres client (`bun:sql`)

## Environment variables

See `.env.example`.

Required:

- `DATABASE_URL` — Postgres connection string
- `TELEGRAM_BOT_TOKEN` — Telegram bot token
- `TELEGRAM_CHAT_ID` — target chat/channel id (e.g. `-100...`)
- `TELEMETR_API_KEY` — Telemetr API key
- `TELEMETR_CHANNEL_INTERNAL_ID` — Telemetr channel internal id (e.g. `1zHTOo`)

> Note: Telemetr internal id is **not** the Telegram `-100...` id.
> Use `GET /v1/utils/resolve_telegram_id` in Telemetr API docs to convert.

## Local run

```bash
cp .env.example .env
# fill values
bun run src/index.ts
```

## Railway deployment (Scheduler)

1. Create a new Railway project from this repo
2. Configure a Bun runtime (Railway template / Nixpacks)
3. Add environment variables (see above)
4. Add a **Cron / Scheduler** job with the command:

```bash
bun run src/index.ts
```

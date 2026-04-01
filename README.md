# Weekly Headlines Cron

<p align="center">
  <img alt="Weekly Headlines Cron banner" src="https://capsule-render.vercel.app/api?type=waving&color=0:111827,100:2563eb&height=180&section=header&text=Weekly%20Headlines%20Cron&fontSize=42&fontColor=ffffff" />
</p>

<p align="center">
  <a href="https://github.com/kkulebaev/weekly-headlines-cron/actions/workflows/ci.yml">
    <img alt="CI" src="https://img.shields.io/github/actions/workflow/status/kkulebaev/weekly-headlines-cron/ci.yml?branch=main" />
  </a>
  <img alt="Node" src="https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white" />
  <img alt="License" src="https://img.shields.io/github/license/kkulebaev/weekly-headlines-cron" />
</p>

A tiny **Railway Scheduler** job that runs once a week:

1. Connects to Postgres via `DATABASE_URL`
2. Fetches the last 7 days of posts from `"TelegramPost"` (ordered by `"createdAt"`)
3. Sends a Telegram digest containing the list of `headline` values

## Requirements

- Node.js 20+
- A Postgres database (Railway Postgres works great)
- A Telegram bot token + target chat id

## Environment variables

See `.env.example`.

Minimal required:

- `DATABASE_URL`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## Local run

```bash
cp .env.example .env
# fill values
npm i
npm run start
```

## Railway deployment (Scheduler)

1. Create a new Railway project from this repo
2. Add environment variables (see above)
3. Add a **Cron / Scheduler** job with the command:

```bash
npm run start
```

## Notes

- The query reads from `"TelegramPost"` and uses `"createdAt" >= now() - interval '7 days'`.
- The digest is limited to **20** posts.

---

Made by @kkulebaev

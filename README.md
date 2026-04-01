# Weekly Headlines Cron

<p align="center">
  <img alt="Weekly Headlines Cron banner" src="https://capsule-render.vercel.app/api?type=waving&color=0:111827,100:2563eb&height=180&section=header&text=Weekly%20Headlines%20Cron&fontSize=42&fontColor=ffffff" />
</p>

<p align="center">
  <img alt="Platform" src="https://img.shields.io/badge/platform-Railway-7B3FE4" />
  <img alt="Language" src="https://img.shields.io/badge/language-TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img alt="Runtime" src="https://img.shields.io/badge/runtime-Node.js-339933?logo=node.js&logoColor=white" />
</p>

A tiny **Railway Scheduler** job that runs once a week:

1. Connects to Postgres via `DATABASE_URL`
2. Fetches posts for the last 7 days
3. Sends a Telegram digest with headlines

## Environment variables

See `.env.example`.

Required:

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
2. Add environment variables
3. Add a **Cron / Scheduler** job with the command:

```bash
npm run start
```


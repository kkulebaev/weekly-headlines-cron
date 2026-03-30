# weekly-headlines-bot

Небольшой сервис/скрипт для Railway Scheduler: раз в неделю берёт записи за последние 7 дней из Postgres и отправляет список «заголовков» (несколько слов из `text`) в Telegram.

## Переменные окружения

Смотри `.env.example`.

Минимально нужно:
- `DATABASE_URL`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

И подстрой под свою схему:
- `HEADLINES_TABLE`
- `TEXT_COLUMN`
- `CREATED_AT_COLUMN`

## Локальный запуск

```bash
cp .env.example .env
# заполни значения
npm i
npm run weekly
```

## Railway

1. Создай новый проект из этого репо
2. Добавь Variables (env): как в `.env.example`
3. Scheduler/Cron: запускай команду

```bash
npm run weekly
```

(Периодичность — раз в неделю, как тебе нужно.)

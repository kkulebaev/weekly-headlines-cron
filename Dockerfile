# syntax=docker/dockerfile:1

# Лёгкий образ с Bun (официальный)
FROM oven/bun:1.3.11-alpine

WORKDIR /app

# Код
COPY . .

# По умолчанию запускаем прод-сборку
CMD ["bun", "run", "start"]

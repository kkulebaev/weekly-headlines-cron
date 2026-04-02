# syntax=docker/dockerfile:1

# Лёгкий образ с Bun (официальный)
FROM oven/bun:1.2.22-alpine

WORKDIR /app

# Код
COPY . .

# По умолчанию запускаем прод-сборку
CMD ["bun", "run", "start"]

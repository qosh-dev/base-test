# Task Manager API

## Инструкция по запуску

### 1. Запуск PostgreSQL

Из директории `base` выполнить:

```bash
cd docker
docker compose up -d
cd ..
```

### 2. Установка зависимостей

```bash
cd api
npm install
```

### 3. Подготовка переменных окружения

Если нужно, скопировать пример файла окружения:

```bash
cp .env.example .env
```

По умолчанию в проекте уже есть локальный `.env` для разработки.

### 4. Генерация Prisma Client

```bash
npx prisma generate
```

### 5. Применение схемы базы данных

Для локального запуска:

```bash
npx prisma db push
```

Если нужен запуск через миграции:

```bash
npx prisma migrate dev
```

### 6. Запуск приложения

```bash
npm run dev
```

После запуска сервис будет доступен по адресу:

- `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`

## Полезные команды

Сборка проекта:

```bash
npm run build
```

Запуск тестов:

```bash
npm test
```

Для тестов нужен запущенный Docker, так как используется Testcontainers.
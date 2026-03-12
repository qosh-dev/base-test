# Task Manager Nest API

## Инструкция по запуску

### 1. Запуск PostgreSQL

Из директории `nest` выполнить:

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

### 4. Применение миграций

```bash
npm run db:migration:up
```

Для отката миграций:

```bash
npm run db:migration:down <migration-name>
```

Для создания новой миграции:

```bash
npm run db:migration:create <migration-name>
```

### 5. Генерация типизированных SQL-запросов (pgtyped)

```bash
npm run sql:generate
```

Запускается в watch-режиме. После изменения `.sql` файлов автоматически пересоздаёт `.queries.ts`.

### 6. Запуск приложения

```bash
npm run dev
```

После запуска сервис будет доступен по адресу:

- `http://localhost:3001`
- Swagger: `http://localhost:3001/explorer`

## Полезные команды

Сборка проекта:

```bash
npm run build
```

Проверка типов:

```bash
npm run lint:types
```

Запуск тестов:

```bash
npm test
```

Для тестов нужен запущенный Docker, так как используется Testcontainers.

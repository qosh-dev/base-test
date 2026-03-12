# Task Manager Nest API

Task Manager API implemented in the style of the Editory-Press backend architecture.

## Stack

- NestJS
- Fastify
- PostgreSQL
- pgtyped-style SQL layer
- JWT authentication
- Swagger
- class-validator / class-transformer

## Structure

```text
nest/
├── api/
│   ├── .github/instructions/
│   ├── migrations/
│   ├── scripts/
│   ├── src/
│   │   ├── config/
│   │   ├── core/
│   │   ├── libs/
│   │   └── modules/
│   ├── .env.example
│   ├── migrat.config.cjs
│   ├── package.json
│   └── pgtyped.json
└── docker/
    └── docker-compose.yml
```

## Run

```bash
cd nest/docker
docker compose up -d

cd ../api
npm install
npm run db:migration:up
npm run dev
```

## Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /health`
- `GET /explorer`
```

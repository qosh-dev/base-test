# Task Manager API

REST API service for task management built with **Node.js**, **Express.js**, **TypeScript**, **PostgreSQL**, and **Prisma**.

## Features

- User registration and JWT-based authentication
- Full CRUD operations for tasks
- Tasks are scoped to users — each user can only see/modify their own tasks
- Soft delete for tasks
- Input validation with Zod
- Pagination and filtering
- Swagger API documentation
- Integration tests with Testcontainers

## Project Structure

```
base/
├── docker/
│   └── docker-compose.yml        # PostgreSQL for development
└── api/
    ├── prisma/
    │   └── schema.prisma          # Database schema
    ├── src/
    │   ├── config/
    │   │   ├── env.ts             # Environment variables validation
    │   │   └── swagger.ts         # Swagger/OpenAPI configuration
    │   ├── lib/
    │   │   └── prisma.ts          # Prisma client singleton
    │   ├── middleware/
    │   │   ├── auth.ts            # JWT authentication middleware
    │   │   ├── errorHandler.ts    # Global error handler
    │   │   └── validate.ts        # Zod validation middleware
    │   ├── modules/
    │   │   ├── auth/
    │   │   │   ├── auth.controller.ts
    │   │   │   ├── auth.routes.ts
    │   │   │   ├── auth.schema.ts
    │   │   │   ├── auth.service.ts
    │   │   │   └── auth.types.ts
    │   │   └── tasks/
    │   │       ├── task.controller.ts
    │   │       ├── task.routes.ts
    │   │       ├── task.schema.ts
    │   │       ├── task.service.ts
    │   │       └── task.types.ts
    │   ├── app.ts                 # Express app factory
    │   └── index.ts               # Server entry point
    ├── tests/
    │   ├── setup.ts               # Testcontainers setup
    │   ├── auth.test.ts           # Auth integration tests
    │   └── tasks.test.ts          # Tasks integration tests
    ├── .env.example
    ├── package.json
    ├── tsconfig.json
    └── vitest.config.ts
```

## Prerequisites

- **Node.js** >= 18
- **Docker** and **Docker Compose** (for PostgreSQL)
- **Docker** (for running tests with Testcontainers)

## Getting Started

### 1. Start PostgreSQL

```bash
cd base/docker
docker compose up -d
```

### 2. Install dependencies

```bash
cd base/api
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env if needed (defaults work with docker-compose)
```

### 4. Run database migrations

```bash
npm run db:migrate
```

### 5. Start the development server

```bash
npm run dev
```

The server will start at `http://localhost:3000`.

Swagger docs available at `http://localhost:3000/api-docs`.

## API Endpoints

| Method | Endpoint          | Auth     | Description            |
|--------|-------------------|----------|------------------------|
| POST   | /auth/register    | No       | Register a new user    |
| POST   | /auth/login       | No       | Login and get JWT      |
| POST   | /tasks            | Required | Create a task          |
| GET    | /tasks            | Required | List tasks (paginated) |
| GET    | /tasks/:id        | Required | Get a single task      |
| PUT    | /tasks/:id        | Required | Update a task          |
| DELETE | /tasks/:id        | Required | Soft-delete a task     |

## Running Tests

Tests use **Testcontainers** to spin up a real PostgreSQL instance in Docker.

```bash
npm test
```

## Environment Variables

| Variable       | Description                    | Default                                                         |
|----------------|--------------------------------|-----------------------------------------------------------------|
| PORT           | Server port                    | 3000                                                            |
| DATABASE_URL   | PostgreSQL connection string   | postgresql://taskmanager:taskmanager@localhost:5432/taskmanager  |
| JWT_SECRET     | Secret key for JWT signing     | *(required)*                                                    |
| JWT_EXPIRES_IN | JWT token expiration           | 7d                                                              |

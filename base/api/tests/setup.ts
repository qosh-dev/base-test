import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { createApp } from "../src/app";
import express from "express";
import { beforeAll, afterAll, beforeEach } from "vitest";
import { setPrismaClient, resetPrismaClient } from "../src/lib/prisma";

let container: StartedPostgreSqlContainer;
let prisma: PrismaClient;
let app: express.Express;

export const getApp = () => app;
export const getPrisma = () => prisma;

export const setupTestEnvironment = () => {
  beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:16-alpine").start();

    const databaseUrl = container.getConnectionUri();
    process.env.DATABASE_URL = databaseUrl;
    process.env.JWT_SECRET = "test-secret-key-for-testing";
    process.env.JWT_EXPIRES_IN = "1h";

    execSync("npx prisma db push --skip-generate", {
      env: { ...process.env, DATABASE_URL: databaseUrl },
      cwd: process.cwd(),
    });

    prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
    await prisma.$connect();

    setPrismaClient(prisma);

    app = createApp();
  });

  afterAll(async () => {
    await prisma?.$disconnect();
    resetPrismaClient();
    await container?.stop();
  });

  beforeEach(async () => {
    // Clean tables in correct order (foreign keys)
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  });
};

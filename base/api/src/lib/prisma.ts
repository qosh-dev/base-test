import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";

const createPrismaClient = (databaseUrl: string): PrismaClient =>
	new PrismaClient({
		datasources: {
			db: {
				url: databaseUrl,
			},
		},
	});

export let prisma: PrismaClient = createPrismaClient(env.DATABASE_URL);

export const setPrismaClient = (client: PrismaClient): void => {
	prisma = client;
};

export const resetPrismaClient = (): void => {
	prisma = createPrismaClient(env.DATABASE_URL);
};


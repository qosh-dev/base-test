import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

const main = async () => {
  const app = createApp();

  await prisma.$connect();
  console.log("Connected to database");

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
    console.log(`Swagger docs: http://localhost:${env.PORT}/api-docs`);
  });
};

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

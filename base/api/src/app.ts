import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import taskRoutes from "./modules/tasks/task.routes";

export const createApp = () => {
  const app = express();

  // Global middleware
  app.use(cors());
  app.use(express.json());

  // Swagger documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Routes
  app.use("/auth", authRoutes);
  app.use("/tasks", taskRoutes);

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Error handling
  app.use(errorHandler);

  return app;
};

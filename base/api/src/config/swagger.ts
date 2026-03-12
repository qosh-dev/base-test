import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description:
        "REST API service for task management. Allows users to register, authenticate, and manage personal tasks.",
    },
    servers: [
      {
        url: "/",
        description: "Current server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token obtained from POST /auth/login",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Human-readable error message",
              example: "Validation error",
            },
            errors: {
              type: "array",
              description: "Detailed validation errors (if applicable)",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                    description: "Name of the field that failed validation",
                    example: "email",
                  },
                  message: {
                    type: "string",
                    description: "Validation error message for this field",
                    example: "Invalid email format",
                  },
                },
              },
            },
          },
          required: ["message"],
        },
        RegisterRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email address (must be unique)",
              example: "user@test.com",
            },
            password: {
              type: "string",
              minLength: 6,
              description: "User password (minimum 6 characters)",
              example: "123456",
            },
          },
        },
        RegisterResponse: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique user identifier",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
            email: {
              type: "string",
              format: "email",
              description: "Registered email address",
              example: "user@test.com",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
              example: "2026-03-12T10:00:00.000Z",
            },
          },
          required: ["id", "email", "createdAt"],
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "Registered user email address",
              example: "user@test.com",
            },
            password: {
              type: "string",
              description: "User password",
              example: "123456",
            },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              description: "JWT access token for authenticating subsequent requests",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
          required: ["token"],
        },
        CreateTaskRequest: {
          type: "object",
          required: ["title", "status"],
          properties: {
            title: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              description: "Task title",
              example: "Buy milk",
            },
            description: {
              type: "string",
              maxLength: 1000,
              description: "Detailed task description (optional)",
              example: "Buy milk in supermarket",
            },
            status: {
              type: "string",
              enum: ["pending", "done"],
              description: "Current task status",
              example: "pending",
            },
          },
        },
        UpdateTaskRequest: {
          type: "object",
          properties: {
            title: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              description: "Updated task title",
              example: "Buy organic milk",
            },
            description: {
              type: "string",
              maxLength: 1000,
              description: "Updated task description",
              example: "Buy organic milk from the farmers market",
            },
            status: {
              type: "string",
              enum: ["pending", "done"],
              description: "Updated task status",
              example: "done",
            },
          },
        },
        TaskResponse: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique task identifier",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
            title: {
              type: "string",
              description: "Task title",
              example: "Buy milk",
            },
            description: {
              type: "string",
              nullable: true,
              description: "Task description (may be null)",
              example: "Buy milk in supermarket",
            },
            status: {
              type: "string",
              enum: ["pending", "done"],
              description: "Current task status",
              example: "pending",
            },
            userId: {
              type: "string",
              format: "uuid",
              description: "ID of the user who owns this task",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Task creation timestamp",
              example: "2026-03-12T10:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
              example: "2026-03-12T12:00:00.000Z",
            },
          },
          required: [
            "id",
            "title",
            "description",
            "status",
            "userId",
            "createdAt",
            "updatedAt",
          ],
        },
        TaskListResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              description: "Array of task objects",
              items: {
                $ref: "#/components/schemas/TaskResponse",
              },
            },
            meta: {
              type: "object",
              description: "Pagination metadata",
              properties: {
                page: {
                  type: "integer",
                  description: "Current page number",
                  example: 1,
                },
                limit: {
                  type: "integer",
                  description: "Number of items per page",
                  example: 10,
                },
                total: {
                  type: "integer",
                  description: "Total number of matching tasks",
                  example: 25,
                },
                totalPages: {
                  type: "integer",
                  description: "Total number of pages",
                  example: 3,
                },
              },
              required: ["page", "limit", "total", "totalPages"],
            },
          },
          required: ["data", "meta"],
        },
      },
    },
  },
  apis: ["./src/modules/**/*.routes.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

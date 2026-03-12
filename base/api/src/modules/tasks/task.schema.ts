import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title must not be empty")
    .max(255, "Title must be at most 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),
  status: z.enum(["pending", "done"], {
    required_error: "Status is required",
    invalid_type_error: 'Status must be either "pending" or "done"',
  }),
});

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title must not be empty")
      .max(255, "Title must be at most 255 characters")
      .optional(),
    description: z
      .string()
      .max(1000, "Description must be at most 1000 characters")
      .optional(),
    status: z
      .enum(["pending", "done"], {
        invalid_type_error: 'Status must be either "pending" or "done"',
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const taskIdParamSchema = z.object({
  id: z.string().uuid("Invalid task ID format"),
});

export const taskListQuerySchema = z.object({
  status: z
    .enum(["pending", "done"], {
      invalid_type_error: 'Status filter must be "pending" or "done"',
    })
    .optional(),
  page: z.coerce
    .number()
    .int("Page must be an integer")
    .min(1, "Page must be at least 1")
    .default(1),
  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(100, "Limit must be at most 100")
    .default(10),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskIdParam = z.infer<typeof taskIdParamSchema>;
export type TaskListQuery = z.infer<typeof taskListQuerySchema>;

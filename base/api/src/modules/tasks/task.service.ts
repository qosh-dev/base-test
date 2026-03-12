import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/errorHandler";
import { CreateTaskInput, UpdateTaskInput, TaskListQuery } from "./task.schema";
import { TaskResponseDto, TaskListResponseDto } from "./task.types";

const taskSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const createTask = async (
  userId: string,
  input: CreateTaskInput
): Promise<TaskResponseDto> => {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
      userId,
    },
    select: taskSelect,
  });
};

export const listTasks = async (
  userId: string,
  query: TaskListQuery
): Promise<TaskListResponseDto> => {
  const { page, limit, status } = query;
  const skip = (page - 1) * limit;

  const where = {
    userId,
    deletedAt: null,
    ...(status && { status }),
  };

  const [data, total] = await Promise.all([
    prisma.task.findMany({
      where,
      select: taskSelect,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTaskById = async (
  taskId: string,
  userId: string
): Promise<TaskResponseDto> => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, deletedAt: null },
    select: { ...taskSelect, userId: true },
  });

  if (!task) {
    const error: AppError = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  if (task.userId !== userId) {
    const error: AppError = new Error("Access denied. You can only view your own tasks.");
    error.statusCode = 403;
    throw error;
  }

  return task;
};

export const updateTask = async (
  taskId: string,
  userId: string,
  input: UpdateTaskInput
): Promise<TaskResponseDto> => {
  await getTaskById(taskId, userId);

  return prisma.task.update({
    where: { id: taskId },
    data: input,
    select: taskSelect,
  });
};

export const deleteTask = async (
  taskId: string,
  userId: string
): Promise<void> => {
  await getTaskById(taskId, userId);

  await prisma.task.update({
    where: { id: taskId },
    data: { deletedAt: new Date() },
  });
};

import { Request, Response, NextFunction } from "express";
import * as taskService from "./task.service";
import { CreateTaskInput, UpdateTaskInput, TaskListQuery, TaskIdParam } from "./task.schema";

export const create = async (
  req: Request<unknown, unknown, CreateTaskInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await taskService.createTask(req.user!.userId, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const list = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as unknown as TaskListQuery;
    const result = await taskService.listTasks(req.user!.userId, query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getById = async (
  req: Request<TaskIdParam>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await taskService.getTaskById(req.params.id, req.user!.userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: Request<TaskIdParam, unknown, UpdateTaskInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await taskService.updateTask(
      req.params.id,
      req.user!.userId,
      req.body
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: Request<TaskIdParam>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await taskService.deleteTask(req.params.id, req.user!.userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

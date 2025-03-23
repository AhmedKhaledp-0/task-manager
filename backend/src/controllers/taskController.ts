import * as service from "../services/taskService";
import { RegularMiddleware } from "../types/expressMiddleware";
import { ObjectId } from "mongodb";
import { TaskModel } from "../types/schemas";

export const createTaskPost: RegularMiddleware = async (req, res, next) => {
  try {
    const { projectId, task } = req.body;

    if (!task) throw new Error("task data's not provided");
    if (!projectId) throw new Error("project credentials are not existed");

    const createdTask: TaskModel | undefined = await service.createTask(task);

    res.status(201).json({
      status: "success",
      message: "task created successfully",
      data: createdTask,
    });
  } catch (error) {
    console.error(error);

    res.json({ status: "fail", message: "failed to create task" });
    next(error);
  }
};

export const getTaskGet: RegularMiddleware = async (req, res, next) => {
  try {
    if (!req.params.id) throw new Error("task id is not existed");

    const taskId = ObjectId.createFromHexString(req.params.id);

    const task: TaskModel | undefined = await service.getTask(taskId);

    if (!task)
      res.status(404).json({ status: "fail", message: "task not found!" });

    res.status(200).json({ data: task });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateTaskPost: RegularMiddleware = async (req, res, next) => {
  try {
    const { newData } = req.body;
    const taskId = ObjectId.createFromHexString(req.params.id);

    if (!newData) throw new Error("task data's not provided");
    if (!taskId) throw new Error("task credentials are not existed");

    await service.updateTask(taskId, newData);

    res.status(200).json({
      status: "success",
      message: "task updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.json({ status: "fail", message: "failed to update task" });
    next(error);
  }
};

export const deleteTaskPost: RegularMiddleware = async (req, res, next) => {
  try {
    const taskId = ObjectId.createFromHexString(req.params.id);
    if (!taskId) throw new Error("task credentials are not existed");

    await service.deleteTask(taskId);

    res.status(204).json({
      status: "success",
      message: "task deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.json({ status: "fail", message: "failed to delete task" });
    next(error);
  }
};

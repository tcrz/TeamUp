import { Request, Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { getOwnedProject } from "../services/projects";
import { TaskStatus } from "../generated/prisma/client";
import { parseId } from "../lib/utils";
import { buildResponse } from "../lib/response";
import { HttpError } from "../lib/httpError";

const tasksRouter = Router();

tasksRouter.post(
  "/:projectId/tasks",
  asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const { title, description, assigneeId } = req.body;
    const parsedProjectId = parseId(projectId);
    await getOwnedProject(parsedProjectId, req.user!.id);
    const assignee = assigneeId ? await prisma.user.findUnique({ where: { id: assigneeId } }) : null;
    if (assigneeId && !assignee) {
      throw new HttpError(404, "Assignee not found");
    }
    if (!title) {
      throw new HttpError(400, "Title is required");
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        assigneeId,
        projectId: parsedProjectId,
      },
    });

    return res.status(201).json(buildResponse("Task created successfully", task));
  }),
);

tasksRouter.get(
  "/:projectId/tasks",
  asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const parsedProjectId = parseId(projectId);
    await getOwnedProject(parsedProjectId, req.user!.id);
    const tasks = await prisma.task.findMany({
      where: { projectId: parsedProjectId },
    });
    return res.status(200).json(buildResponse("Tasks retrieved successfully", tasks));
  }),
);

tasksRouter.patch(
  "/:projectId/tasks/:taskId",
  asyncHandler(async (req: Request, res: Response) => {
    const { projectId, taskId } = req.params;
    const { title, description, status, assigneeId } = req.body;
    const parsedProjectId = parseId(projectId);
    const parsedTaskId = parseId(taskId);
    if (!title && !description && !status) {
      throw new HttpError(400, "At least one field is required to update");
    }
    if(status && !(Object.values(TaskStatus).includes(status))) {
      throw new HttpError(400, "Invalid status value");
    }
    await getOwnedProject(parsedProjectId, req.user!.id);
    const assignee = assigneeId ? await prisma.user.findUnique({ where: { id: assigneeId } }) : null;
    if (assigneeId && !assignee) {
      throw new HttpError(404, "Assignee not found");
    }
    const task = await prisma.task.findUnique({
      where: { id: parsedTaskId, projectId: parsedProjectId },
    });
    if (!task) {
      throw new HttpError(404, "Task not found");
    }
    const updatedTask = await prisma.task.update({
      where: { id: parsedTaskId },
      data: { title, description, status, 
        assigneeId: assigneeId !== undefined ? assigneeId : task.assigneeId },
    });

    return res.status(200).json(buildResponse("Task updated successfully", updatedTask));
  }),
)

tasksRouter.delete(
  "/:projectId/tasks/:taskId",
  asyncHandler(async (req: Request, res: Response) => {
    const { projectId, taskId } = req.params;
    const parsedProjectId = parseId(projectId);
    const parsedTaskId = parseId(taskId);
    await getOwnedProject(parsedProjectId, req.user!.id);
    const task = await prisma.task.findUnique({
      where: { id: parsedTaskId, projectId: parsedProjectId },
    });
    if (!task) {
      throw new HttpError(404, "Task not found");
    }
    await prisma.task.delete({
      where: { id: parsedTaskId },
    });

    return res.status(200).json(buildResponse("Task deleted successfully"));
  }),
);

export default tasksRouter;

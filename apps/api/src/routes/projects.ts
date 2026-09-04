import { Response, Request, Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { getOwnedProject } from "../services/projects";
import { parseId } from "../lib/utils";
import { buildResponse } from "../lib/response";
import { HttpError } from "../lib/httpError";

const projectsRouter = Router();

projectsRouter.post("/", asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { name, description } = req.body;
    if (!name) {
      throw new HttpError(400, "Name is required");
    }

    const project = await prisma.project.create({
      data: { ownerId: userId, name, description },
    });

    return res.status(201).json(buildResponse("Project created successfully", project));
}));

projectsRouter.get("/", asyncHandler(async (req: Request, res: Response) => {
  const userId = req?.user!.id;
  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
  });
  return res.status(200).json(buildResponse("Projects retrieved successfully", projects));
}));

projectsRouter.get("/:id", asyncHandler(async (req: Request, res: Response) => {
  const userId = req?.user!.id;
  const { id } = req.params;
  const parsedId = parseId(id);
  const project = await getOwnedProject(parsedId, userId);
  return res.status(200).json(buildResponse("Project retrieved successfully", project));
}));

projectsRouter.patch("/:id", asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name && !description) {
    throw new HttpError(400, "At least one of name or description must be provided");
  }
  const parsedId = parseId(id);
  await getOwnedProject(parsedId, userId);
  const updatedProject = await prisma.project.update({
    where: { id: parsedId },
    data: { name, description },
  });

  return res.status(200).json(buildResponse("Project updated successfully", updatedProject));
}));

projectsRouter.delete("/:id", asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const parsedId = parseId(id);
  await getOwnedProject(parsedId, userId);
  await prisma.project.delete({
    where: { id: parsedId },
  });
  return res.status(200).json(buildResponse("Project deleted successfully"));
}));
export default projectsRouter;

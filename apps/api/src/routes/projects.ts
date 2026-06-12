import { Router, Response, Request } from "express";
import { prisma } from "../lib/prisma";
import { Project } from "../generated/prisma/client";
import { asyncHandler } from "../lib/asyncHandler";

async function getProject(projectId: number, userId: number, res: Response) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project) {
    res.status(404).json({
      message: "Project not found",
    });
    return null;
  } else if (project.ownerId !== userId) {
    res.status(403).json({
      message: "Access denied",
    });
    return null;
  }

  return project as Project;
}

const projectsRouter = Router();

projectsRouter.post("/", asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({
        name: "Name is required",
      });
    }

    const project = await prisma.project.create({
      data: { ownerId: userId, name, description },
    });

    return res.status(201).json({
      message: "Project created successfully",
      data: project,
    });
}));

projectsRouter.get("/", asyncHandler(async (req: Request, res: Response) => {
  const userId = req?.user!.id;
  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
  });
  return res.status(200).json({
    message: "Projects retrieved successfully",
    data: projects,
  });
}));

projectsRouter.get("/:id", asyncHandler(async (req: Request, res: Response) => {
  const userId = req?.user!.id;
  const { id } = req.params;
  const project = await getProject(Number(id), userId, res);
  if (!project) return;
  return res.status(200).json({
    message: "Project retrieved successfully",
    data: project,
  });
}));

projectsRouter.patch("/:id", asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name && !description) {
    return res.status(400).json({
      message: "Name or description is required",
    });
  }
  const project = await getProject(Number(id), userId, res);
  if (!project) return;
  const updatedProject = await prisma.project.update({
    where: { id: Number(id) },
    data: { name, description },
  });

  return res.status(200).json({
    message: "Project updated successfully",
    data: updatedProject,
  });
}));

projectsRouter.delete("/:id", asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const project = await getProject(Number(id), userId, res);
  if (!project) return;
  await prisma.project.delete({
    where: { id: Number(id) },
  });
  return res.status(200).json({
    message: "Project deleted successfully",
  });
}));
export default projectsRouter;

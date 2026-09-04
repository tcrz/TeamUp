import { Project } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { HttpError } from "../lib/httpError";

export async function getOwnedProject(
  projectId: number,
  userId: number,
): Promise<Project> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project) {
    throw new HttpError(404, "Project not found");
  } else if (project.ownerId !== userId) {
    throw new HttpError(403, "You do not have permission to access this project");
  }

  return project;
}
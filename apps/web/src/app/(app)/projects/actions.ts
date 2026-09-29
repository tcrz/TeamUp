"use server";

import { revalidatePath } from "next/cache";
import { ApiError, projects, tasks, type TaskStatus } from "@/lib/api";

/** `okAt` changes on every success, which is how a form knows to reset or close. */
export type FormState = { error?: string; okAt?: number };

function message(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export async function createProject(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!name) return { error: "Give the project a name." };

  try {
    await projects.create({ name, description: description || undefined });
  } catch (error) {
    return { error: message(error, "Could not create the project.") };
  }

  revalidatePath("/projects");
  return { okAt: Date.now() };
}

export async function deleteProject(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await projects.remove(id);
  revalidatePath("/projects");
}

export async function createTask(_prev: FormState, formData: FormData): Promise<FormState> {
  const projectId = Number(formData.get("projectId"));
  const title = String(formData.get("title") ?? "").trim();
  if (!Number.isInteger(projectId)) return { error: "Unknown project." };
  if (!title) return { error: "Give the task a title." };

  try {
    await tasks.create(projectId, { title });
  } catch (error) {
    return { error: message(error, "Could not add the task.") };
  }

  revalidatePath(`/projects/${projectId}`);
  return { okAt: Date.now() };
}

/** Moves a task to the next status — the board's only interaction. */
export async function moveTask(formData: FormData): Promise<void> {
  const projectId = Number(formData.get("projectId"));
  const taskId = Number(formData.get("taskId"));
  const status = String(formData.get("status") ?? "") as TaskStatus;
  if (!Number.isInteger(projectId) || !Number.isInteger(taskId)) return;
  if (!["TODO", "IN_PROGRESS", "DONE"].includes(status)) return;

  await tasks.update(projectId, taskId, { status });
  revalidatePath(`/projects/${projectId}`);
}

export async function deleteTask(formData: FormData): Promise<void> {
  const projectId = Number(formData.get("projectId"));
  const taskId = Number(formData.get("taskId"));
  if (!Number.isInteger(projectId) || !Number.isInteger(taskId)) return;

  await tasks.remove(projectId, taskId);
  revalidatePath(`/projects/${projectId}`);
}

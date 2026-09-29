import "server-only";

import { auth } from "@/auth";

const API_URL = process.env.API_URL ?? "http://localhost:3001/api";

/** Every API response has this shape — see the convention in CLAUDE.md. */
export type ApiResponse<T> = { message: string; data: T | null };

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Calls the API as the signed-in user. Refreshing is handled upstream by the
 * `jwt` callback in `auth.ts`, so by the time a request gets here the token is
 * already current.
 */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = await auth();
  const token = session?.accessToken;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });

  const body = (await res.json().catch(() => null)) as ApiResponse<T> | null;
  if (!res.ok) throw new ApiError(res.status, body?.message ?? "Request failed");
  return body?.data as T;
}

/* ---- Domain types, mirroring the Prisma schema ---- */

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Project = {
  id: number;
  name: string;
  description: string | null;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  projectId: number;
  assigneeId: number | null;
  createdAt: string;
  updatedAt: string;
};

/* ---- Endpoints ---- */

export const projects = {
  list: () => api<Project[]>("/projects"),
  get: (id: number) => api<Project>(`/projects/${id}`),
  create: (input: { name: string; description?: string }) =>
    api<Project>("/projects", { method: "POST", body: JSON.stringify(input) }),
  update: (id: number, input: { name?: string; description?: string }) =>
    api<Project>(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
  remove: (id: number) => api<null>(`/projects/${id}`, { method: "DELETE" }),
};

export const tasks = {
  list: (projectId: number) => api<Task[]>(`/projects/${projectId}/tasks`),
  create: (projectId: number, input: { title: string; description?: string }) =>
    api<Task>(`/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (
    projectId: number,
    taskId: number,
    input: { title?: string; description?: string; status?: TaskStatus },
  ) =>
    api<Task>(`/projects/${projectId}/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (projectId: number, taskId: number) =>
    api<null>(`/projects/${projectId}/tasks/${taskId}`, { method: "DELETE" }),
};

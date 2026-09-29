import { notFound } from "next/navigation";
import { ApiError, projects, tasks, type Task } from "@/lib/api";
import { NewTaskForm } from "../new-task-form";
import { IssueViews } from "./issue-views";

export default async function ProjectBoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = Number(id);
  if (!Number.isInteger(projectId) || projectId <= 0) notFound();

  let project;
  let list: Task[];
  try {
    [project, list] = await Promise.all([projects.get(projectId), tasks.list(projectId)]);
  } catch (error) {
    // 404 (missing) and 403 (someone else's) both mean "not yours to see".
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) notFound();
    throw error;
  }

  const done = list.filter((t) => t.status === "DONE").length;
  const progress = list.length === 0 ? 0 : Math.round((done / list.length) * 100);

  return (
    <div className="flex min-h-full flex-col">
      <header className="px-6 pt-10 pb-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="flex min-w-0 flex-col gap-3">
            <h1 className="display text-xl break-words text-ink">{project.name}</h1>
            {project.description ? (
              <p className="max-w-[64ch] text-base text-graphite">{project.description}</p>
            ) : null}

            {list.length > 0 ? (
              <div className="mt-1 flex items-center gap-3">
                <div
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Issues completed"
                  className="h-1.5 w-40 bg-field-deep"
                >
                  <div
                    className="h-full w-full origin-left bg-ink transition-transform duration-300 ease-(--ease-signal) motion-reduce:transition-none"
                    style={{ transform: `scaleX(${progress / 100})` }}
                  />
                </div>
                <span className="keyline text-[12px] text-slate">
                  {done} of {list.length} done
                </span>
              </div>
            ) : null}
          </div>

          <div className="w-full max-w-md">
            <NewTaskForm projectId={projectId} />
          </div>
        </div>
      </header>

      <IssueViews tasks={list} projectId={projectId} />
    </div>
  );
}

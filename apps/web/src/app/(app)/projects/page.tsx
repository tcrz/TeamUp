import Link from "next/link";
import { projects, tasks, type Task } from "@/lib/api";
import { NewProjectDialog } from "./new-project-dialog";
import { ProjectRowMenu } from "./project-row-menu";

export const metadata = { title: "Projects · TeamUp" };

export default async function ProjectsPage() {
  const list = await projects.list();

  /* Each row shows real progress, so counts are fetched per project in parallel.
     A single aggregate endpoint would replace this the moment the API has one. */
  const taskLists = await Promise.all(
    list.map((project) => tasks.list(project.id).catch((): Task[] => [])),
  );

  return (
    <div className="w-full max-w-5xl px-6 py-10 lg:px-10">
      <header className="mb-8 flex flex-wrap items-end gap-x-4 gap-y-3">
        <h1 className="display text-xl text-ink">Projects</h1>
        {/* The empty state carries its own call to action; one yellow button per screen. */}
        {list.length > 0 ? (
          <div className="ml-auto">
            <NewProjectDialog />
          </div>
        ) : null}
      </header>

      {list.length === 0 ? (
        <section className="rounded-md bg-surface px-8 py-16">
          <h2 className="display max-w-[20ch] text-lg text-ink">Start with one project.</h2>
          <p className="mt-3 max-w-[48ch] text-base text-graphite">
            A project holds a board. Name it after the thing you are shipping,
            then add the first issue — there is nothing to set up in between.
          </p>
          <div className="mt-8">
            <NewProjectDialog />
          </div>
        </section>
      ) : (
        <ul className="divide-y divide-rule overflow-hidden rounded-md bg-surface">
          {list.map((project, i) => {
            const projectTasks = taskLists[i] ?? [];
            const done = projectTasks.filter((t) => t.status === "DONE").length;
            const open = projectTasks.length - done;
            const progress =
              projectTasks.length === 0 ? 0 : Math.round((done / projectTasks.length) * 100);

            return (
              <li
                key={project.id}
                className="group relative flex items-center gap-6 px-6 py-5 transition-colors hover:bg-field/60"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Link
                    href={`/projects/${project.id}`}
                    className="display w-fit text-lg text-ink before:absolute before:inset-0"
                  >
                    {project.name}
                  </Link>
                  {project.description ? (
                    <span className="truncate text-[14px] text-graphite">{project.description}</span>
                  ) : null}
                </div>

                {/* What is left, then how far along. Open is the number a team acts on. */}
                <div className="hidden shrink-0 items-baseline gap-1.5 sm:flex">
                  <span className="display text-lg text-ink tabular-nums">{open}</span>
                  <span className="text-[13px] text-slate">open</span>
                </div>

                <div className="hidden w-28 shrink-0 flex-col gap-1.5 md:flex">
                  <div
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${project.name}: ${done} of ${projectTasks.length} issues done`}
                    className="h-1.5 w-full bg-field-deep"
                  >
                    <div
                      className="h-full w-full origin-left bg-ink transition-transform duration-300 ease-(--ease-signal) motion-reduce:transition-none"
                      style={{ transform: `scaleX(${progress / 100})` }}
                    />
                  </div>
                  <span className="keyline text-[11px] text-slate">
                    {done} of {projectTasks.length} done
                  </span>
                </div>

                <ProjectRowMenu project={project} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

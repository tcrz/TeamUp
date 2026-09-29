"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Columns3,
  LayoutList,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusIcon, STATUS_LABEL } from "@/components/app/status-icon";
import { KanbanBoard } from "./kanban-board";
import type { Task, TaskStatus } from "@/lib/api";
import { deleteTask, moveTask } from "../actions";

const FORWARD: Record<TaskStatus, TaskStatus | null> = {
  TODO: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: null,
};

const BACKWARD: Record<TaskStatus, TaskStatus | null> = {
  TODO: null,
  IN_PROGRESS: "TODO",
  DONE: "IN_PROGRESS",
};

const EMPTY: Record<TaskStatus, string> = {
  TODO: "Nothing queued",
  IN_PROGRESS: "Nothing in flight",
  DONE: "Nothing shipped yet",
};

/** Issue keys read like a tracker's: TU-12, derived from the task id. */
const keyOf = (task: Task) => `TU-${task.id}`;

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

function useTaskActions(projectId: number) {
  const [, startTransition] = useTransition();

  /* `before` runs inside the transition, which is where optimistic updates must happen. */
  const send = (
    action: (fd: FormData) => Promise<void>,
    taskId: number,
    extra: Record<string, string> = {},
    before?: () => void,
  ) => {
    const form = new FormData();
    form.set("projectId", String(projectId));
    form.set("taskId", String(taskId));
    for (const [k, v] of Object.entries(extra)) form.set(k, v);
    startTransition(async () => {
      before?.();
      await action(form);
    });
  };

  return { send };
}

function TaskMenu({
  task,
  onMove,
  onDelete,
  size = "md",
}: {
  task: Task;
  onMove: (to: TaskStatus) => void;
  onDelete: () => void;
  size?: "sm" | "md";
}) {
  const forward = FORWARD[task.status];
  const backward = BACKWARD[task.status];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Actions for ${task.title}`}
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "shrink-0 text-slate opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-[popup-open]:opacity-100",
              size === "sm" ? "size-7" : "size-8",
            )}
          />
        }
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {forward ? (
          <DropdownMenuItem onClick={() => onMove(forward)}>
            <ArrowRight className="size-4" />
            Move to {STATUS_LABEL[forward].toLowerCase()}
          </DropdownMenuItem>
        ) : null}
        {backward ? (
          <DropdownMenuItem onClick={() => onMove(backward)}>
            <ArrowLeft className="size-4" />
            Move to {STATUS_LABEL[backward].toLowerCase()}
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <Trash2 className="size-4" />
          Delete issue
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function IssueViews({ tasks, projectId }: { tasks: Task[]; projectId: number }) {
  const [view, setView] = useState<"board" | "list">("board");
  const [query, setQuery] = useState("");
  const { send } = useTaskActions(projectId);

  /* A deleted issue leaves the list the moment you choose Delete, not after the round trip. */
  const [visible, removeOptimistic] = useOptimistic(tasks, (state: Task[], id: number) =>
    state.filter((t) => t.id !== id),
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return visible;
    return visible.filter(
      (t) => t.title.toLowerCase().includes(q) || keyOf(t).toLowerCase().includes(q),
    );
  }, [visible, query]);

  const move = (task: Task) => (to: TaskStatus) => send(moveTask, task.id, { status: to });
  const remove = (task: Task) => () =>
    send(deleteTask, task.id, {}, () => removeOptimistic(task.id));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-y border-rule px-6 py-3 lg:px-10">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter issues…"
            aria-label="Filter issues"
            className="h-9 w-60 rounded-sm border border-edge bg-surface pr-3 pl-9 text-[14px] text-ink outline-none placeholder:text-slate focus-visible:border-ink focus-visible:shadow-[inset_0_0_0_1px_var(--color-ink)]"
          />
        </div>

        {query ? (
          <span className="keyline text-[12px] text-slate">
            {filtered.length} of {visible.length}
          </span>
        ) : null}

        {/* View switcher */}
        <div className="ml-auto flex items-center rounded-sm border border-ink">
          {(
            [
              { id: "board", label: "Board", icon: Columns3 },
              { id: "list", label: "List", icon: LayoutList },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setView(option.id)}
              aria-pressed={view === option.id}
              title={`${option.label} view`}
              className={cn(
                "flex h-8 items-center gap-1.5 px-3 text-[13px] font-semibold transition-colors",
                view === option.id
                  ? "bg-ink text-surface"
                  : "text-graphite hover:bg-field-deep hover:text-ink",
              )}
            >
              <option.icon className="size-3.5" />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="px-6 py-16 lg:px-10">
          <p className="display text-lg text-ink">No issues yet.</p>
          <p className="mt-2 text-base text-graphite">
            Type one into the box above. It lands in Todo, ready to move.
          </p>
        </div>
      ) : view === "board" ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <KanbanBoard tasks={tasks} projectId={projectId} query={query} />
        </div>
      ) : (
        <ul className="mx-6 my-6 divide-y divide-rule overflow-hidden rounded-md bg-surface lg:mx-10">
          {filtered.map((task) => (
            <li
              key={task.id}
              data-issue
              className="group flex items-center gap-4 px-5 py-3"
            >
              <StatusIcon status={task.status} />
              <span className="keyline w-14 shrink-0 text-[12px] text-slate">
                {keyOf(task)}
              </span>
              <span className="min-w-0 flex-1 truncate text-[15px] text-ink">
                {task.title}
              </span>
              <span className="keyline shrink-0 text-[12px] text-slate">
                {shortDate(task.createdAt)}
              </span>
              <TaskMenu task={task} onMove={move(task)} onDelete={remove(task)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

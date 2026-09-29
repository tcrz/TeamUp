"use client";

import { useEffect, useMemo, useOptimistic, useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusIcon, STATUS_LABEL, STATUS_ORDER } from "@/components/app/status-icon";
import type { Task, TaskStatus } from "@/lib/api";
import { deleteTask, moveTask } from "../actions";

const keyOf = (task: Task) => `TU-${task.id}`;

/** Controls that must keep working when they sit inside a draggable card. */
const INTERACTIVE = 'button, a, input, textarea, select, [role="menuitem"]';

/**
 * Lets the whole card start a drag, rather than a 14px handle, while leaving
 * the menu button clickable. The explicit handle is exempt so it still drags.
 */
class CardPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const,
      handler: ({ nativeEvent }: { nativeEvent: PointerEvent }) => {
        if (!nativeEvent.isPrimary || nativeEvent.button !== 0) return false;
        const target = nativeEvent.target as HTMLElement | null;
        if (!target) return false;
        if (target.closest("[data-drag-handle]")) return true;
        return !target.closest(INTERACTIVE);
      },
    },
  ];
}

/*
 * Each column is identified by a band across its top, the way a transit line is
 * identified by its colour: grey for waiting, the signal for in flight, black
 * for finished. It is the same light-mid-dark step as the status icons.
 */
const BAND: Record<TaskStatus, string> = {
  TODO: "border-status-todo",
  IN_PROGRESS: "border-status-progress",
  DONE: "border-status-done",
};

const EMPTY: Record<TaskStatus, string> = {
  TODO: "Drop an issue here",
  IN_PROGRESS: "Nothing in flight",
  DONE: "Nothing shipped yet",
};

function IssueCard({
  task,
  onDelete,
  dragging = false,
  overlay = false,
}: {
  task: Task;
  onDelete?: () => void;
  dragging?: boolean;
  overlay?: boolean;
}) {
  return (
    <article
      className={cn(
        "group flex flex-col gap-2 rounded-sm border bg-surface px-3 pt-2.5 pb-3",
        /* Lifted is the one state that earns a shadow: the card really is above the board. */
        overlay ? "rotate-1 cursor-grabbing border-ink shadow-float" : "border-transparent",
        !overlay && "cursor-grab select-none active:cursor-grabbing",
        dragging && "opacity-40",
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className="keyline text-[12px] text-slate">{keyOf(task)}</span>
        {onDelete ? (
          <span className="ml-auto flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={`Actions for ${task.title}`}
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="-my-1.5 -mr-1.5 size-7 shrink-0 text-slate opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-[popup-open]:opacity-100"
                  />
                }
              >
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                  <Trash2 className="size-4" />
                  Delete issue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
        ) : null}
      </div>
      <p className="text-[15px] leading-snug text-ink">{task.title}</p>
    </article>
  );
}

function SortableIssue({
  task,
  onDelete,
}: {
  task: Task;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { status: task.status },
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="relative"
      {...listeners}
    >
      {/*
        Pointer drags start anywhere on the card (see CardPointerSensor). This
        handle exists for keyboard users, who need a focusable target: tab to it,
        press space, arrow across, space again. It also signals the affordance.
      */}
      <button
        type="button"
        data-drag-handle
        {...attributes}
        {...listeners}
        aria-label={`Drag ${task.title}`}
        className="absolute top-2 right-8 z-10 touch-none rounded-sm p-0.5 text-slate opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      >
        <GripVertical className="size-3.5" />
      </button>
      <IssueCard task={task} onDelete={onDelete} dragging={isDragging} />
    </li>
  );
}

function Column({
  status,
  tasks,
  onDelete,
}: {
  status: TaskStatus;
  tasks: Task[];
  onDelete: (id: number) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status, data: { status } });

  return (
    <section
      aria-label={STATUS_LABEL[status]}
      className={cn("flex min-w-64 flex-col rounded-sm border-t-[3px] bg-field-deep", BAND[status])}
    >
      <header className="flex items-center gap-2 px-3 pt-3 pb-2">
        <StatusIcon status={status} />
        <h2 className="text-[14px] font-semibold text-ink">{STATUS_LABEL[status]}</h2>
        <span className="display ml-auto text-lg leading-none text-ink tabular-nums">
          {tasks.length}
        </span>
      </header>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-40 flex-1 flex-col gap-2 p-2 transition-colors duration-150",
          isOver && "bg-signal-wash",
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-2">
            {tasks.map((task) => (
              <SortableIssue key={task.id} task={task} onDelete={() => onDelete(task.id)} />
            ))}
          </ul>
        </SortableContext>

        {tasks.length === 0 ? (
          <p
            className={cn(
              "rounded-sm border border-dashed border-edge px-3 py-6 text-center text-[13px] text-slate",
              isOver && "border-ink text-ink",
            )}
          >
            {EMPTY[status]}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function KanbanBoard({
  tasks,
  projectId,
  query,
}: {
  tasks: Task[];
  projectId: number;
  query: string;
}) {
  const [, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<number | null>(null);

  /*
   * Moves and deletes land the instant you make them; the server action
   * reconciles after. Without this a dropped card snaps back to its old column,
   * and a deleted one lingers, until the round trip and revalidation finish.
   */
  const [optimistic, applyOptimistic] = useOptimistic(
    tasks,
    (state: Task[], change: { id: number; status: TaskStatus } | { id: number; removed: true }) =>
      "removed" in change
        ? state.filter((t) => t.id !== change.id)
        : state.map((t) => (t.id === change.id ? { ...t, status: change.status } : t)),
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return optimistic;
    return optimistic.filter(
      (t) => t.title.toLowerCase().includes(q) || keyOf(t).toLowerCase().includes(q),
    );
  }, [optimistic, query]);

  const sensors = useSensors(
    // 4px of movement separates a drag from a click on the card.
    useSensor(CardPointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const active = activeId ? optimistic.find((t) => t.id === activeId) ?? null : null;

  function onDragStart(event: DragStartEvent) {
    setActiveId(Number(event.active.id));
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active: a, over } = event;
    if (!over) return;

    const task = optimistic.find((t) => t.id === Number(a.id));
    if (!task) return;

    /* `over` is either a column (droppable) or another card; both carry status. */
    const target = (over.data.current?.status ?? over.id) as TaskStatus;
    if (!STATUS_ORDER.includes(target) || target === task.status) return;

    const form = new FormData();
    form.set("projectId", String(projectId));
    form.set("taskId", String(task.id));
    form.set("status", target);

    startTransition(() => {
      applyOptimistic({ id: task.id, status: target });
      void moveTask(form);
    });
  }

  function remove(id: number) {
    const form = new FormData();
    form.set("projectId", String(projectId));
    form.set("taskId", String(id));
    /* Awaited, so the optimistic removal holds until the revalidated list arrives. */
    startTransition(async () => {
      applyOptimistic({ id, removed: true });
      await deleteTask(form);
    });
  }

  return (
    <DndContext
      /*
       * A stable id is required under SSR: without it dnd-kit numbers its
       * generated `aria-describedby` ids from a counter that differs between
       * the server and client passes, which trips React's hydration check.
       */
      id="kanban-board"
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(null)}
      accessibility={{
        announcements: {
          onDragStart: ({ active: a }) => `Picked up issue ${a.id}.`,
          onDragOver: ({ over }) =>
            over ? `Moved over ${STATUS_LABEL[over.id as TaskStatus] ?? over.id}.` : "",
          onDragEnd: ({ over }) =>
            over ? `Dropped in ${STATUS_LABEL[over.id as TaskStatus] ?? over.id}.` : "Drop cancelled.",
          onDragCancel: () => "Drag cancelled.",
        },
      }}
    >
      <div className="grid gap-4 overflow-x-auto px-6 py-6 md:grid-cols-3 lg:px-10">
        {STATUS_ORDER.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={filtered.filter((t) => t.status === status)}
            onDelete={remove}
          />
        ))}
      </div>

      {/* The dragged card follows the cursor above everything else. */}
      <DragOverlay dropAnimation={{ duration: 180, easing: "cubic-bezier(0.2, 0, 0, 1)" }}>
        {active ? <IssueCard task={active} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/lib/api";

export const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

export const STATUS_ORDER: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

/**
 * Status as a drawn state: an empty dashed ring, a half-filled ring, and a
 * filled check. The shape carries the meaning, so it reads in greyscale.
 *
 * In progress is a black ring filled with the signal yellow. Yellow alone is
 * about 1.6:1 against white — too faint to be the only boundary of a mark —
 * so the ring supplies the contrast and the yellow supplies the signal.
 */
export function StatusIcon({
  status,
  className,
}: {
  status: TaskStatus;
  className?: string;
}) {
  const base = cn("size-3.5 shrink-0", className);

  if (status === "DONE") {
    return (
      <svg viewBox="0 0 14 14" className={base} aria-hidden>
        <circle cx="7" cy="7" r="6.5" fill="var(--color-status-done)" />
        <path
          d="M4.2 7.2 6.2 9.2 9.9 5.2"
          fill="none"
          stroke="#fff"
          strokeWidth="1.7"
          strokeLinecap="square"
        />
      </svg>
    );
  }

  if (status === "IN_PROGRESS") {
    return (
      <svg viewBox="0 0 14 14" className={base} aria-hidden>
        <circle cx="7" cy="7" r="6" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="1.5" />
        {/* Half-filled: the work is underway. */}
        <path d="M7 1.75A5.25 5.25 0 0 1 7 12.25Z" fill="var(--color-status-progress)" />
        <line x1="7" y1="1.75" x2="7" y2="12.25" stroke="var(--color-ink)" strokeWidth="1.2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 14 14" className={base} aria-hidden>
      <circle
        cx="7"
        cy="7"
        r="6"
        fill="none"
        stroke="var(--color-status-todo)"
        strokeWidth="1.5"
        strokeDasharray="2.4 1.8"
      />
    </svg>
  );
}

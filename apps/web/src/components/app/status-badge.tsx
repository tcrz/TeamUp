import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/lib/api";
import { STATUS_LABEL, StatusIcon } from "./status-icon";

export { STATUS_LABEL };

/*
 * Plates rather than pastel pills. The three states step through light, mid,
 * and dark — outline, yellow, black — so they stay distinct in greyscale and
 * for every kind of colour blindness, without a traffic-light palette.
 */
const PLATE: Record<TaskStatus, string> = {
  TODO: "border border-edge bg-surface text-graphite",
  IN_PROGRESS: "border border-transparent bg-signal text-ink",
  DONE: "border border-transparent bg-ink text-surface",
};

/** The status icon on its own, for column headers and dense rows. */
export function StatusDot({ status, className }: { status: TaskStatus; className?: string }) {
  return <StatusIcon status={status} className={className} />;
}

export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-sm px-1.5 text-[11px] leading-none font-semibold whitespace-nowrap",
        PLATE[status],
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

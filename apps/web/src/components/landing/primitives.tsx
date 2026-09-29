import { cn } from "@/lib/cn";
import { KEY_PREFIX } from "./brand";

export type Status = "todo" | "progress" | "done";

const STATUS: Record<Status, { label: string; dot: string }> = {
  todo: { label: "Todo", dot: "bg-dot-todo" },
  progress: { label: "In progress", dot: "bg-dot-progress" },
  done: { label: "Done", dot: "bg-dot-done" },
};

/** Pill badge: colored status dot plus label on a neutral chip fill. */
export function StatusPill({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  const s = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1.5 rounded-full bg-chip pr-2 pl-1.5 text-[11px] leading-none font-medium whitespace-nowrap text-fg-muted",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

/** A status dot on its own, for dense rows and column headers. */
export function StatusDot({ status, className }: { status: Status; className?: string }) {
  return (
    <span className={cn("size-2 shrink-0 rounded-full", STATUS[status].dot, className)} />
  );
}

/** Issue key in the monospace face trackers use for identifiers. */
export function IssueKey({ n, className }: { n: number; className?: string }) {
  return (
    <span
      className={cn(
        "shrink-0 font-mono text-[11px] text-fg-subtle tabular-nums",
        className,
      )}
    >
      {KEY_PREFIX}-{n}
    </span>
  );
}

/** 20–24px avatar: two initials on a soft indigo fill. */
export function Initials({
  name,
  size = 20,
}: {
  name: string;
  size?: 20 | 24;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent-strong",
        size === 20 ? "size-5 text-[9px]" : "size-6 text-[10px]",
      )}
    >
      {name}
    </span>
  );
}

/** Keyboard key, as shown next to palette actions. */
export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-line bg-surface px-1 font-mono text-[10px] text-fg-subtle">
      {children}
    </kbd>
  );
}

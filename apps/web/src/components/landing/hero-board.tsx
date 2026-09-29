import { cn } from "@/lib/cn";
import { StatusIcon } from "@/components/app/status-icon";
import type { TaskStatus } from "@/lib/api";
import { BRAND, KEY_PREFIX } from "./brand";

type Issue = { n: number; title: string; who: string };

/* Illustrative issues, drawn from the kind of work this product itself needed. */
const TODO: Issue[] = [
  { n: 139, title: "Fix the flaky login test in CI", who: "JD" },
  { n: 135, title: "Paginate the project list endpoint", who: "SK" },
  { n: 133, title: "Drop the unused sessions table", who: "AM" },
];

const IN_PROGRESS: Issue[] = [
  { n: 142, title: "Add rate limiting to the public API", who: "AM" },
  { n: 144, title: "Show the assignee on every card", who: "SK" },
];

const DONE: Issue[] = [
  { n: 137, title: "Migrate tasks to the new status enum", who: "TB" },
  { n: 128, title: "Return 400 for malformed IDs", who: "JD" },
];

/* The one issue that moves: it starts in In progress and ends in Done. */
const MOVER: Issue = { n: 131, title: "Rotate refresh tokens on every use", who: "TB" };

const BAND: Record<TaskStatus, string> = {
  TODO: "border-status-todo",
  IN_PROGRESS: "border-status-progress",
  DONE: "border-status-done",
};

function Card({ issue }: { issue: Issue }) {
  return (
    <div className="flex flex-col gap-2 rounded-sm bg-surface px-3 pt-2.5 pb-3">
      <div className="flex items-center justify-between">
        <span className="keyline text-[12px] text-slate">
          {KEY_PREFIX}-{issue.n}
        </span>
        <span className="keyline text-[11px] text-graphite">{issue.who}</span>
      </div>
      <p className="text-[14px] leading-snug text-ink sm:text-[15px]">{issue.title}</p>
    </div>
  );
}

/** A count that changes during the sequence: both values share one grid cell. */
function Count({ from, to }: { from?: number; to: number }) {
  if (from === undefined) {
    return <span className="display text-lg leading-none text-ink tabular-nums">{to}</span>;
  }
  return (
    <span className="display grid text-lg leading-none text-ink tabular-nums">
      <span className="swap-out col-start-1 row-start-1">{from}</span>
      <span className="swap-in col-start-1 row-start-1">{to}</span>
    </span>
  );
}

function Column({
  status,
  label,
  count,
  delay,
  className,
  children,
}: {
  status: TaskStatus;
  label: string;
  count: React.ReactNode;
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("settle flex flex-col rounded-sm border-t-[3px] bg-field-deep", BAND[status], className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <StatusIcon status={status} />
        <span className="text-[14px] font-semibold text-ink">{label}</span>
        <span className="ml-auto">{count}</span>
      </div>
      {/* Spacing lives inside each item (pb-2) so a collapsing item takes its gap with it. */}
      <div className="flex flex-col px-2 pb-0">{children}</div>
    </div>
  );
}

const Slot = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("pb-2", className)}>{children}</div>
);

/**
 * The hero's product surface: the board, not a screenshot of a whole app. It
 * is inert, so it is exposed to assistive technology as one labelled image.
 * On narrow screens Todo is dropped — the story is the move from In progress
 * to Done, and three columns would not fit legibly.
 */
export function HeroBoard({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label={`A ${BRAND} board with three columns — Todo, In progress, and Done. The issue “Rotate refresh tokens on every use” moves from In progress into Done.`}
      className={cn("grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4", className)}
    >
      <Column
        status="TODO"
        label="Todo"
        count={<Count to={TODO.length} />}
        delay={80}
        className="hidden md:flex"
      >
        {TODO.map((issue) => (
          <Slot key={issue.n}>
            <Card issue={issue} />
          </Slot>
        ))}
      </Column>

      <Column
        status="IN_PROGRESS"
        label="In progress"
        count={<Count from={IN_PROGRESS.length + 1} to={IN_PROGRESS.length} />}
        delay={200}
      >
        <Slot>
          <Card issue={IN_PROGRESS[0]} />
        </Slot>
        <Slot className="vacate">
          <Card issue={MOVER} />
        </Slot>
        {IN_PROGRESS.slice(1).map((issue) => (
          <Slot key={issue.n}>
            <Card issue={issue} />
          </Slot>
        ))}
      </Column>

      <Column
        status="DONE"
        label="Done"
        count={<Count from={DONE.length} to={DONE.length + 1} />}
        delay={320}
      >
        <Slot className="arrive">
          <Card issue={MOVER} />
        </Slot>
        {DONE.map((issue) => (
          <Slot key={issue.n}>
            <Card issue={issue} />
          </Slot>
        ))}
      </Column>
    </div>
  );
}

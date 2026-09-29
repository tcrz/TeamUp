import { cn } from "@/lib/cn";
import { BRAND } from "./brand";
import { BoardIcon, IssueIcon, PlusIcon, SearchIcon } from "./icons";
import { Initials, IssueKey, StatusPill, type Status } from "./primitives";

type Row = { n: number; title: string; status: Status; who: string; flips?: boolean };

/* Illustrative issues, drawn from the kind of work this product itself needed. */
const ROWS: Row[] = [
  { n: 142, title: "Add rate limiting to the public API", status: "progress", who: "AM" },
  { n: 131, title: "Rotate refresh tokens on every use", status: "done", who: "TB", flips: true },
  { n: 139, title: "Fix flaky login test in CI", status: "todo", who: "JD" },
  { n: 137, title: "Migrate tasks to the new status enum", status: "done", who: "TB" },
  { n: 135, title: "Paginate the project list endpoint", status: "todo", who: "SK" },
  { n: 133, title: "Drop the unused sessions table", status: "todo", who: "AM" },
  { n: 128, title: "Return 400 for malformed IDs", status: "done", who: "JD" },
];

const NAV = [
  { label: "My issues", icon: IssueIcon, active: true, count: "7" },
  { label: "Board", icon: BoardIcon },
];

const PROJECTS = ["Public API", "Web app"];

const FILTERS = ["All issues", "Assigned to me", "In progress"];

/**
 * The hero's product surface: a full application window, not a cropped card.
 * It is inert — a picture of the product — so it is exposed to assistive
 * technology as a single labelled image.
 */
export function HeroApp() {
  return (
    <div
      role="img"
      aria-label={`Preview of ${BRAND}: a sidebar with My issues selected, beside a list of seven issues showing their keys, statuses, and assignees.`}
      className="flex h-[27rem] overflow-hidden rounded-lg border border-line bg-surface shadow-modal lg:h-[32rem] lg:rounded-r-none lg:border-r-0"
    >
      {/* Sidebar */}
      <div
        aria-hidden
        className="hidden w-52 shrink-0 flex-col gap-5 border-r border-line bg-canvas px-3 py-4 sm:flex"
      >
        <div className="flex items-center gap-2 px-2">
          <span className="flex size-5 items-center justify-center rounded-sm bg-accent-strong text-[10px] font-semibold text-white">
            {BRAND[0]}
          </span>
          <span className="text-[13px] font-semibold text-fg">{BRAND}</span>
        </div>

        <div className="flex flex-col gap-0.5">
          {NAV.map(({ label, icon: Icon, active, count }) => (
            <span
              key={label}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px]",
                active ? "bg-accent-soft font-medium text-accent-strong" : "text-fg-muted",
              )}
            >
              <Icon className="size-4" />
              {label}
              {count ? (
                <span className="ml-auto font-mono text-[11px] text-fg-subtle tabular-nums">
                  {count}
                </span>
              ) : null}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="px-2 text-[11px] font-medium text-label">Projects</span>
          {PROJECTS.map((project) => (
            <span
              key={project}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-fg-muted"
            >
              <span className="size-1.5 rounded-full bg-line-strong" />
              {project}
            </span>
          ))}
        </div>
      </div>

      {/* Main panel */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div
          aria-hidden
          className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 lg:pr-10"
        >
          <div className="flex items-baseline gap-2">
            <span className="text-[14px] font-semibold text-fg">Issues</span>
            <span className="text-[12px] text-fg-subtle tabular-nums">24 open</span>
          </div>
          <div className="flex items-center gap-2">
            <SearchIcon className="size-4 text-fg-subtle" />
            <span className="inline-flex h-7 items-center gap-1 rounded-md bg-accent-strong px-2.5 text-[12px] font-medium text-white">
              <PlusIcon className="size-3.5" />
              New issue
            </span>
          </div>
        </div>

        <div aria-hidden className="flex gap-1.5 border-b border-line px-4 py-2.5">
          {FILTERS.map((filter, i) => (
            <span
              key={filter}
              className={cn(
                "rounded-sm px-2 py-1 text-[12px] whitespace-nowrap",
                i === 0 ? "bg-accent-soft font-medium text-accent-strong" : "text-fg-subtle",
              )}
            >
              {filter}
            </span>
          ))}
        </div>

        <ul aria-hidden className="divide-y divide-line">
          {ROWS.map((row, i) => (
            <li
              key={row.n}
              className="row-in flex items-center gap-3 px-4 py-3 lg:pr-10"
              style={{ animationDelay: `${140 + i * 60}ms` }}
            >
              <IssueKey n={row.n} className="w-12" />
              <span className="min-w-0 flex-1 truncate text-[13px] text-fg">{row.title}</span>

              {row.flips ? (
                /* Both pills share one grid cell; CSS swaps them once after load. */
                <span className="grid justify-items-end">
                  <StatusPill status="progress" className="flip-out col-start-1 row-start-1" />
                  <StatusPill status="done" className="flip-in col-start-1 row-start-1" />
                </span>
              ) : (
                <StatusPill status={row.status} />
              )}

              <Initials name={row.who} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

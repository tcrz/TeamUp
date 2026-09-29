import { cn } from "@/lib/cn";
import { Kbd, StatusDot } from "./primitives";

/*
 * Each feature card carries a miniature of the real thing rather than a generic
 * icon: the point of the product is what its surfaces look like, so the card
 * shows one instead of describing it twice.
 */

function IssueRowsMini() {
  const rows: { status: "todo" | "progress" | "done"; w: string }[] = [
    { status: "progress", w: "w-[78%]" },
    { status: "todo", w: "w-[62%]" },
    { status: "done", w: "w-[70%]" },
    { status: "todo", w: "w-[54%]" },
  ];
  return (
    <div className="flex flex-col gap-px overflow-hidden rounded-md border border-line bg-surface">
      {rows.map((row, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center gap-2 px-2.5 py-2",
            i !== 0 && "border-t border-line",
          )}
        >
          <StatusDot status={row.status} />
          <span className="font-mono text-[10px] text-fg-subtle">TU-{142 - i * 3}</span>
          <span className={cn("h-1.5 rounded-full bg-line", row.w)} />
        </div>
      ))}
    </div>
  );
}

function BoardMini() {
  const columns: { status: "todo" | "progress" | "done"; cards: number }[] = [
    { status: "todo", cards: 2 },
    { status: "progress", cards: 3 },
    { status: "done", cards: 1 },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {columns.map((column, c) => (
        <div key={c} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 pb-0.5">
            <StatusDot status={column.status} />
            <span className="h-1.5 w-6 rounded-full bg-line" />
          </div>
          {Array.from({ length: column.cards }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col gap-1.5 rounded-md border bg-surface p-2",
                c === 1 && i === 0 ? "border-accent/40 ring-2 ring-accent/15" : "border-line",
              )}
            >
              <span className="h-1.5 w-full rounded-full bg-line" />
              <span className="h-1.5 w-2/3 rounded-full bg-line" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function PaletteMini() {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-surface">
      <div className="flex items-center gap-2 border-b border-line px-2.5 py-2">
        <span className="h-1.5 w-16 rounded-full bg-line" />
        <span className="ml-auto flex gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </div>
      <div className="flex flex-col gap-px p-1.5">
        <div className="flex items-center gap-2 rounded-sm bg-accent-soft px-2 py-1.5">
          <span className="size-1.5 rounded-full bg-accent" />
          <span className="h-1.5 w-24 rounded-full bg-accent/30" />
        </div>
        {[20, 16].map((w) => (
          <div key={w} className="flex items-center gap-2 px-2 py-1.5">
            <span className="size-1.5 rounded-full bg-line" />
            <span className="h-1.5 rounded-full bg-line" style={{ width: `${w * 4}px` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

const FEATURES = [
  {
    title: "Issue tracking",
    body: "Every issue has a key, an owner, and one of three statuses. Nothing else to fill in.",
    mini: <IssueRowsMini />,
  },
  {
    title: "Kanban boards",
    body: "The same issues grouped by status. Move one and your team sees it immediately.",
    mini: <BoardMini />,
  },
  {
    title: "Command palette",
    body: "Press ⌘K to jump to any issue or run an action without leaving the keyboard.",
    mini: <PaletteMini />,
  },
];

export function FeatureCards() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
      {FEATURES.map((feature) => (
        <li key={feature.title} className="flex flex-col gap-6 bg-surface p-6">
          <div
            aria-hidden
            className="flex h-40 items-center justify-center rounded-md bg-canvas p-3"
          >
            <div className="w-full">{feature.mini}</div>
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-[15px] font-semibold text-fg">{feature.title}</h3>
            <p className="text-[14px] leading-6 text-fg-muted">{feature.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

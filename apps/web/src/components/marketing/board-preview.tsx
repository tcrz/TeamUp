import { Initials } from "@/components/landing/primitives";
import { cn } from "@/lib/cn";

type Card = { id: string; title: string; tags: string[]; who: string; flagged?: boolean };

const COLUMNS: { name: string; dot: string; cards: Card[] }[] = [
  {
    name: "Todo",
    dot: "bg-status-todo-dot",
    cards: [
      {
        id: "TU-109",
        title: "Add custom webhooks and Slack payload configuration",
        tags: ["Integration"],
        who: "Ama Mensah",
        flagged: true,
      },
      {
        id: "TU-112",
        title: "Update authentication session storage rules",
        tags: [],
        who: "Tony Lartey",
      },
    ],
  },
  {
    name: "In Progress",
    dot: "bg-status-prog-dot",
    cards: [
      {
        id: "TU-98",
        title: "Refactor global filters and pipeline caching engine",
        tags: ["Refactor", "Core"],
        who: "Joy Darko",
        flagged: true,
      },
    ],
  },
];

/**
 * A static, non-interactive render of the board, used as product imagery on
 * marketing and auth screens. Composed from the same primitives as the real
 * board so the two cannot drift apart visually.
 */
export function BoardPreview({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "grid grid-cols-2 gap-4 rounded-xl border border-line bg-canvas p-4",
        className,
      )}
    >
      {COLUMNS.map((col) => (
        <div key={col.name} className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <span className={cn("size-1.5 rounded-full", col.dot)} />
            <span className="text-body-sm font-medium text-fg">{col.name}</span>
            <span className="text-body-sm text-fg-subtle">{col.cards.length}</span>
          </div>

          {col.cards.map((card) => (
            <div
              key={card.id}
              className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-mono text-fg-subtle">{card.id}</span>
                {card.flagged ? (
                  <span className="size-1.5 rounded-full bg-prio-high" />
                ) : null}
              </div>
              <p className="text-body-sm leading-snug text-fg">{card.title}</p>
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm bg-hover px-1.5 py-0.5 text-[10px] text-fg-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Initials name={initialsOf(card.who)} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** "Ama Mensah" -> "AM" */
function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

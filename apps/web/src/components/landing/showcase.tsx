"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { IssueIcon, PlusIcon, SearchIcon } from "./icons";
import { Initials, IssueKey, Kbd, StatusDot, type Status } from "./primitives";

/*
 * Three inert fragments of the product, rendered in HTML/CSS so they read as a
 * live preview. Each is a single labelled image to assistive technology; its
 * visible caption names what it shows.
 */

function Fragment({
  title,
  caption,
  description,
  children,
}: {
  title: string;
  caption: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="flex flex-col gap-3">
      <div role="img" aria-label={description}>
        <div aria-hidden>{children}</div>
      </div>
      <figcaption className="text-[13px] leading-5 text-fg-muted">
        <span className="font-medium text-fg">{title}.</span> {caption}
      </figcaption>
    </figure>
  );
}

/* ---- 1. Issue row list -------------------------------------------------- */

const MY_ISSUES: { n: number; title: string; status: Status }[] = [
  { n: 142, title: "Add rate limiting to the public API", status: "progress" },
  { n: 139, title: "Fix flaky login test in CI", status: "todo" },
  { n: 128, title: "Return 400 for malformed IDs", status: "done" },
  { n: 124, title: "Index tasks by project", status: "todo" },
];

function IssueRows() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
        <span className="text-[13px] font-semibold text-fg">Assigned to me</span>
        <span className="text-[12px] text-fg-subtle tabular-nums">4</span>
      </div>
      <ul className="divide-y divide-line">
        {MY_ISSUES.map((issue) => (
          <li
            key={issue.n}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2.5",
              issue.n === 142 && "seq-row",
            )}
          >
            <StatusDot
              status={issue.status}
              className={issue.n === 142 ? "seq-dot" : undefined}
            />
            <IssueKey n={issue.n} className="w-11" />
            <span className="min-w-0 flex-1 truncate text-[13px] text-fg">{issue.title}</span>
            <Initials name="AM" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---- 2. Kanban column card stack ---------------------------------------- */

const IN_PROGRESS = [
  { n: 142, title: "Add rate limiting to the public API", who: "AM" },
  { n: 131, title: "Rotate refresh tokens on every use", who: "TB" },
  { n: 126, title: "Centralize API error handling", who: "JD" },
];

function KanbanColumn() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 px-1 pb-1">
        <StatusDot status="progress" />
        <span className="text-[13px] font-semibold text-fg">In progress</span>
        <span className="text-[12px] text-fg-subtle tabular-nums">{IN_PROGRESS.length}</span>
        <PlusIcon className="ml-auto size-4 text-fg-subtle" />
      </div>
      {IN_PROGRESS.map((card, i) => (
        <div
          key={card.n}
          className={cn(
            "flex flex-col gap-2 rounded-lg border bg-surface p-3 shadow-card",
            /* TU-142 is the issue the sequence moves; it carries the active ring. */
            i === 0 ? "seq-card border-accent/40 ring-2 ring-accent/15" : "border-line",
          )}
        >
          <IssueKey n={card.n} />
          <span className="text-[13px] leading-snug text-fg">{card.title}</span>
          <div className="flex justify-end">
            <Initials name={card.who} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---- 3. Command palette window ------------------------------------------ */

const ACTIONS = [
  { label: "Create issue", key: "C" },
  { label: "Assign to me", key: "I" },
  { label: "Change status", key: "S" },
];

function CommandPalette() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-modal">
      <div className="flex items-center gap-2.5 border-b border-line px-3 py-3">
        <SearchIcon className="size-4 text-fg-subtle" />
        <span className="flex-1 text-[13px] text-fg">
          rate limit<span className="ml-px inline-block h-3.5 w-px translate-y-0.5 bg-accent" />
        </span>
        <Kbd>esc</Kbd>
      </div>

      <div className="px-1.5 py-2">
        <p className="px-2 pt-1 pb-1.5 text-[11px] font-medium text-label">Issues</p>
        <div className="flex items-center gap-2.5 rounded-md bg-accent-soft px-2 py-2">
          <IssueIcon className="size-4 text-accent-strong" />
          <span className="min-w-0 flex-1 truncate text-[13px] text-fg">
            Add rate limiting to the public API
          </span>
          <IssueKey n={142} />
        </div>

        <p className="px-2 pt-3 pb-1.5 text-[11px] font-medium text-label">Actions</p>
        {ACTIONS.map((action) => (
          <div
            key={action.label}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2 py-2",
              action.label === "Change status" && "seq-action",
            )}
          >
            <span className="size-4" />
            <span className="flex-1 text-[13px] text-fg-muted">{action.label}</span>
            <Kbd>{action.key}</Kbd>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 border-t border-line px-3 py-2 text-[11px] text-fg-subtle">
        <span className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          to move
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↵</Kbd>
          to open
        </span>
      </div>
    </div>
  );
}

/**
 * Plays the cross-view sequence once, when the section is properly in view.
 * The resting markup is already the finished state, so this only replays the
 * transition that produced it.
 */
function useSequenceOnView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || play) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPlay(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [play]);

  return { ref, "data-sequence": play ? "play" : undefined } as const;
}

export function Showcase() {
  const sequence = useSequenceOnView<HTMLDivElement>();

  return (
    <div
      {...sequence}
      className="grid items-start gap-8 md:grid-cols-3 md:gap-6"
    >
      <Fragment
        title="Issue list"
        caption="Everything assigned to you, sorted by status."
        description="An issue list showing four issues assigned to one person, each with a status dot, key, and title."
      >
        <IssueRows />
      </Fragment>
      <Fragment
        title="Board"
        caption="The same issues, grouped by status."
        description="A kanban column labelled In progress holding three issue cards; the first card is being dragged."
      >
        <KanbanColumn />
      </Fragment>
      <Fragment
        title="Command palette"
        caption="Find an issue or run an action from the keyboard."
        description="A command palette searching for rate limit, with one matching issue highlighted and three keyboard actions below."
      >
        <CommandPalette />
      </Fragment>
    </div>
  );
}

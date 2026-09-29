"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "@/lib/api";
import { deleteProject } from "./actions";

/* Long enough to be deliberate, short enough not to feel like a punishment. */
const HOLD_MS = 1500;

/**
 * z-10 keeps this above the row's stretched link, which otherwise swallows the
 * click and navigates instead of opening the menu.
 */
export function ProjectRowMenu({ project }: { project: Project }) {
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Actions for ${project.name}`}
        render={
          <Button
            variant="ghost"
            size="icon"
            disabled={pending}
            className="relative z-10 size-8 shrink-0 text-slate opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-[popup-open]:opacity-100"
          />
        }
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <HoldToDelete
          pending={pending}
          onConfirm={() => {
            const form = new FormData();
            form.set("id", String(project.id));
            startTransition(async () => {
              await deleteProject(form);
            });
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Deleting a project cascades to every issue in it and cannot be undone, so it
 * takes a held press rather than a click. A red fill sweeps across the item
 * while you hold; let go early and it snaps back without doing anything.
 *
 * Works with a pointer or with Enter/Space held down. Under reduced motion the
 * hold still applies, but the fill advances in three steps instead of sweeping.
 */
function HoldToDelete({ pending, onConfirm }: { pending: boolean; onConfirm: () => void }) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const done = useRef(false);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function start() {
    if (pending || done.current || timer.current) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      done.current = true;
      onConfirm();
    }, HOLD_MS);
  }

  function cancel() {
    if (done.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  }

  const label = pending ? "Deleting…" : "Hold to delete project";

  return (
    <DropdownMenuItem
      variant="destructive"
      closeOnClick={false}
      disabled={pending}
      onPointerDown={(event) => {
        if (event.button === 0) start();
      }}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && !event.repeat) {
          event.preventDefault();
          start();
        }
      }}
      onKeyUp={(event) => {
        if (event.key === "Enter" || event.key === " ") cancel();
      }}
      /* The menu's default destructive highlight is solid red, which would hide the fill. */
      className="relative overflow-hidden [-webkit-touch-callout:none] data-[variant=destructive]:focus:bg-field-deep data-[variant=destructive]:focus:text-alert data-[variant=destructive]:focus:*:[svg]:text-alert"
    >
      <Trash2 className="size-4" />
      {label}

      {/* The same content in white on red, revealed left to right by clip-path. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 flex items-center gap-2 bg-alert px-2 text-surface transition-[clip-path]",
          holding
            ? "duration-1500 ease-linear motion-reduce:ease-[steps(3,end)]"
            : "duration-200 ease-(--ease-signal)",
        )}
        style={{ clipPath: holding ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
      >
        <Trash2 className="size-4" />
        {label}
      </span>
    </DropdownMenuItem>
  );
}

"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTask, type FormState } from "./actions";

export function NewTaskForm({ projectId }: { projectId: number }) {
  const [state, action, pending] = useActionState<FormState, FormData>(createTask, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.okAt) formRef.current?.reset();
  }, [state.okAt]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-2">
      <input type="hidden" name="projectId" value={projectId} />
      <div className="flex gap-2">
        <Input
          name="title"
          placeholder="What needs doing?"
          aria-label="Issue title"
          aria-invalid={Boolean(state.error)}
          required
        />
        <Button type="submit" disabled={pending} className="h-10 shrink-0">
          <Plus className="size-4" />
          {pending ? "Adding…" : "Add issue"}
        </Button>
      </div>
      {state.error ? (
        <p role="alert" className="text-[13px] text-alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

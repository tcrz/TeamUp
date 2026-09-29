"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createProject, type FormState } from "./actions";

export function NewProjectDialog() {
  const [state, action, pending] = useActionState<FormState, FormData>(createProject, {});
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  /* `okAt` changes only on a successful create, so reopening cannot re-trigger
     this and close the dialog again. */
  useEffect(() => {
    if (!state.okAt) return;
    formRef.current?.reset();
    setOpen(false);
  }, [state.okAt]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" />
        New project
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>Name it now. You can add issues straight after.</DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={action} className="flex flex-col gap-4">
          <Field label="Name" error={state.error}>
            <Input name="name" placeholder="Public API" autoFocus required />
          </Field>

          <Field label="Description">
            <Input name="description" placeholder="Optional" />
          </Field>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

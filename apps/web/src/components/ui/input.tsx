import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

/*
 * The border is `edge`, not `rule`: a control boundary has to reach 3:1 against
 * the surface to be findable, and the decorative divider grey does not.
 * Focus thickens the border to black rather than adding a halo.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-sm border border-edge bg-surface px-3 text-[15px] text-ink transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-slate focus-visible:border-ink focus-visible:shadow-[inset_0_0_0_1px_var(--color-ink)] disabled:cursor-not-allowed disabled:bg-field disabled:opacity-60 aria-invalid:border-alert aria-invalid:shadow-[inset_0_0_0_1px_var(--color-alert)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }

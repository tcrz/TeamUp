import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/*
 * Focus is handled globally (a black outline with offset, see globals.css), so
 * no variant draws its own ring. Primary is the only yellow button on any
 * screen: if two things are yellow, neither is the signal.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-sm border font-semibold whitespace-nowrap transition-[background-color,border-color,color] duration-150 select-none active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-signal text-ink hover:bg-signal-deep",
        outline:
          "border-ink bg-transparent text-ink hover:bg-ink hover:text-surface aria-expanded:bg-ink aria-expanded:text-surface",
        secondary:
          "border-transparent bg-field-deep text-ink hover:bg-rule",
        ghost:
          "border-transparent text-graphite hover:bg-field-deep hover:text-ink aria-expanded:bg-field-deep aria-expanded:text-ink",
        destructive:
          "border-transparent bg-alert text-surface hover:bg-[#8f2416]",
        link: "border-transparent text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-ink",
      },
      size: {
        default: "h-9 gap-2 px-3.5 text-[14px]",
        xs: "h-6 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 text-[13px] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-5 text-[15px]",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

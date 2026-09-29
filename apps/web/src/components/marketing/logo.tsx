import { cn } from "@/lib/cn";
import { BRAND } from "@/components/landing/brand";

/*
 * The wordmark is the name in the display cut, preceded by a yellow plate.
 * The plate is the signal colour's first appearance on any page, so it teaches
 * what yellow means before the product uses it for work in progress.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span aria-hidden className="block h-4 w-2.5 rounded-[1px] bg-signal" />
      <span className="display text-[17px] leading-none text-ink">{BRAND}</span>
    </span>
  );
}

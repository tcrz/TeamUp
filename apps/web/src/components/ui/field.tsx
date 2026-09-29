import { cn } from "@/lib/utils";

/**
 * Label + control + error message. The label wraps its control, so the two are
 * associated without needing matching ids.
 */
export function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex w-full flex-col gap-1.5", className)}>
      <span
        className={cn(
          "text-[13px] leading-none font-semibold",
          error ? "text-alert" : "text-ink",
        )}
      >
        {label}
      </span>
      {children}
      {error ? <span className="text-[13px] text-alert">{error}</span> : null}
    </label>
  );
}

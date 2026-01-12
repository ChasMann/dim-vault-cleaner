/**
 * Select component for dropdowns.
 */
import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/ui";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

/**
 * Renders a styled select dropdown for rule input types.
 */
export const Select = ({ className, ...props }: SelectProps) => {
  return (
    <select
      className={cn(
        "w-full rounded-md border border-panel-border bg-panel px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className
      )}
      {...props}
    />
  );
};

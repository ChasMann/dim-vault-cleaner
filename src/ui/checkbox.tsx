/**
 * Checkbox component used in the armor grid tracker.
 */
import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/ui";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {}

/**
 * Renders a styled checkbox that matches the dark UI theme.
 */
export const Checkbox = ({ className, ...props }: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border border-panel-border bg-panel text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className
      )}
      {...props}
    />
  );
};

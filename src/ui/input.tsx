/**
 * Input component for consistent text field styling.
 */
import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/ui";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

/**
 * Renders a styled input with focus-visible ring for accessibility.
 */
export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-panel-border bg-panel px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className
      )}
      {...props}
    />
  );
};

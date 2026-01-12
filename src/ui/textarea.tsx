/**
 * Textarea component for multi-line inputs.
 */
import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/ui";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Renders a styled textarea with dark theme styling.
 */
export const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <textarea
      className={cn(
        "w-full rounded-md border border-panel-border bg-panel px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className
      )}
      {...props}
    />
  );
};

/**
 * Card component for grouping content in panels.
 */
import { HTMLAttributes } from "react";
import { cn } from "@/lib/ui";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Renders a rounded panel with consistent spacing.
 */
export const Card = ({ className, ...props }: CardProps) => {
  return <div className={cn("rounded-lg border border-panel-border bg-panel-muted p-6", className)} {...props} />;
};

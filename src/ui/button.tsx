/**
 * Button component with consistent styling for the toolkit UI.
 */
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/ui";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

/**
 * Renders a styled button with variants and keyboard focus styling.
 */
export const Button = ({ className, variant = "primary", ...props }: ButtonProps) => {
  const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-accent text-white hover:bg-accent-hover",
    secondary: "bg-panel-border text-slate-100 hover:bg-slate-700",
    ghost: "bg-transparent text-slate-200 hover:bg-slate-800",
    danger: "bg-danger text-white hover:bg-red-400"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};

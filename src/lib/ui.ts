/**
 * Shared UI helpers for class name composition.
 */
import { clsx } from "clsx";

/**
 * Combines class names for UI components.
 */
export const cn = (...inputs: Array<string | undefined | null | false>) => {
  return clsx(inputs);
};

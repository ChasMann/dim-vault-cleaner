/**
 * Helpers for building DIM search strings from rule selections.
 */
import { RuleDefinition, RuleSelections } from "@/lib/types";

/**
 * Builds a DIM search string from rule definitions and the current selections.
 */
export const buildSearchQuery = (rules: RuleDefinition[], selections: RuleSelections): string => {
  const segments = rules
    .map((rule) => {
      const value = selections[rule.id];
      if (value === undefined || value === null || value === "") {
        return null;
      }

      if (Array.isArray(value) && value.length === 0) {
        return null;
      }

      const joinedValue = Array.isArray(value) ? value.join(",") : String(value);
      if (!joinedValue.trim()) {
        return null;
      }

      // Conditional quoting keeps DIM rules valid for values with spaces.
      const formattedValue = rule.requiresQuotes ? `"${joinedValue}"` : joinedValue;
      return `${rule.prefix}${formattedValue}`;
    })
    .filter((segment): segment is string => Boolean(segment));

  return segments.join(" ");
};

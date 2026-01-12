/**
 * Default data for first-run experiences.
 */
import { RuleDefinition } from "@/lib/types";

/**
 * Returns the default template used on first run.
 */
export const getDefaultTemplate = () => {
  const rules: RuleDefinition[] = [
    {
      id: "rule-is",
      prefix: "is:",
      label: "Is",
      inputType: "dropdown",
      options: ["armor", "weapon", "legendary", "exotic", "classitem"],
      requiresQuotes: false
    },
    {
      id: "rule-perk-1",
      prefix: "exactperk:",
      label: "Exact Perk 1",
      inputType: "dropdown",
      options: ["Outlaw", "Kill Clip", "Incandescent", "Demolitionist"],
      requiresQuotes: true
    },
    {
      id: "rule-perk-2",
      prefix: "exactperk:",
      label: "Exact Perk 2",
      inputType: "dropdown",
      options: ["Outlaw", "Kill Clip", "Incandescent", "Demolitionist"],
      requiresQuotes: true
    },
    {
      id: "rule-tertiary",
      prefix: "tertiarystat:",
      label: "Tertiary Stat",
      inputType: "dropdown",
      options: ["mobility", "resilience", "recovery", "discipline"],
      requiresQuotes: false
    },
    {
      id: "rule-stat",
      prefix: "stat:",
      label: "Stat Range",
      inputType: "number-range",
      requiresQuotes: false
    },
    {
      id: "rule-not",
      prefix: "-is:",
      label: "Exclude Is",
      inputType: "dropdown",
      options: ["junk", "infuse", "locked"],
      requiresQuotes: false
    }
  ];

  return {
    name: "Armor Cleanup",
    rules
  };
};

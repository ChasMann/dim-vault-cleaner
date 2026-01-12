/**
 * Shared type definitions for client-side state.
 */

export type RuleInputType = "text" | "dropdown" | "multiselect" | "number-range";

export interface RuleDefinition {
  id: string;
  prefix: string;
  label: string;
  inputType: RuleInputType;
  options?: string[];
  requiresQuotes: boolean;
}

export type RuleSelections = Record<string, string | string[]>;

export interface SearchTemplate {
  id: string;
  name: string;
  rules: RuleDefinition[];
}

export interface FavoriteSearch {
  id: string;
  name: string;
  templateId?: string | null;
  selections: RuleSelections;
}

export interface ArmorSection {
  id: string;
  title: string;
  rows: string[];
  columns: string[];
  rowNotes?: Record<string, string>;
  cells: Record<string, boolean>;
}

export interface ArmorSet {
  id: string;
  name: string;
  notes?: string | null;
  sections: ArmorSection[];
}

export interface WishlistEntry {
  id: string;
  itemHash: number;
  perkHashes: number[];
  notes?: string | null;
  blockNotes?: string | null;
  type: "wishlist" | "trashlist";
}

export interface WishlistFile {
  id: string;
  name: string;
  title?: string | null;
  description?: string | null;
  entries: WishlistEntry[];
}

export interface AppSetting {
  defaultTemplateId?: string | null;
  copyWithComment: boolean;
}

export interface ErrorLogEntry {
  id: string;
  source: string;
  message: string;
  stack?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

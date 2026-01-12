/**
 * Zod schemas for API validation across the app.
 */
import { z } from "zod";

export const ruleSchema = z.object({
  id: z.string().min(1),
  prefix: z.string().min(1),
  label: z.string().min(1),
  inputType: z.enum(["text", "dropdown", "multiselect", "number-range"]),
  options: z.array(z.string()).optional(),
  requiresQuotes: z.boolean()
});

export const templateSchema = z.object({
  name: z.string().min(1),
  rules: z.array(ruleSchema)
});

export const favoriteSchema = z.object({
  name: z.string().min(1),
  templateId: z.string().optional().nullable(),
  selections: z.record(z.any())
});

export const armorSetSchema = z.object({
  name: z.string().min(1),
  notes: z.string().optional().nullable(),
  sections: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      rows: z.array(z.string().min(1)),
      columns: z.array(z.string().min(1)),
      rowNotes: z.record(z.string()).optional(),
      cells: z.record(z.boolean())
    })
  )
});

export const wishlistFileSchema = z.object({
  name: z.string().min(1),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  entries: z.array(
    z.object({
      id: z.string().min(1),
      itemHash: z.number(),
      perkHashes: z.array(z.number()),
      notes: z.string().optional().nullable(),
      blockNotes: z.string().optional().nullable(),
      type: z.enum(["wishlist", "trashlist"])
    })
  )
});

export const errorLogSchema = z.object({
  source: z.string().min(1),
  message: z.string().min(1),
  stack: z.string().optional().nullable(),
  metadata: z.record(z.any()).optional().nullable()
});

export const settingsSchema = z.object({
  defaultTemplateId: z.string().optional().nullable(),
  copyWithComment: z.boolean()
});

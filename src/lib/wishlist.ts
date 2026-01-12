/**
 * Helpers for parsing and building DIM wishlist text files.
 */
import { WishlistEntry } from "@/lib/types";

export interface WishlistTextPayload {
  title?: string | null;
  description?: string | null;
  entries: WishlistEntry[];
}

/**
 * Builds the DIM wishlist text output for export.
 */
export const buildWishlistText = (payload: WishlistTextPayload): string => {
  const lines: string[] = [];

  if (payload.title) {
    lines.push(`title:${payload.title}`);
  }

  if (payload.description) {
    lines.push(`description:${payload.description}`);
  }

  payload.entries.forEach((entry) => {
    if (entry.blockNotes) {
      lines.push(`//notes:${entry.blockNotes}`);
    }

    const itemHash = entry.type === "trashlist" ? -Math.abs(entry.itemHash) : entry.itemHash;
    const baseLine = `dimwishlist:item=${itemHash}&perks=${entry.perkHashes.join(",")}`;
    const lineWithNotes = entry.notes ? `${baseLine} #notes:${entry.notes}` : baseLine;
    lines.push(lineWithNotes);
  });

  return lines.join("\n");
};

/**
 * Parses raw wishlist text into structured entries and metadata.
 */
export const parseWishlistText = (raw: string): WishlistTextPayload => {
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let title: string | null = null;
  let description: string | null = null;
  const entries: WishlistEntry[] = [];
  let activeBlockNotes: string | null = null;

  lines.forEach((line) => {
    if (line.startsWith("title:")) {
      title = line.replace("title:", "").trim();
      return;
    }

    if (line.startsWith("description:")) {
      description = line.replace("description:", "").trim();
      return;
    }

    if (line.startsWith("//notes:")) {
      activeBlockNotes = line.replace("//notes:", "").trim();
      return;
    }

    if (line.startsWith("dimwishlist:")) {
      const [entryPart, notesPart] = line.split("#notes:");
      const params = new URLSearchParams(entryPart.replace("dimwishlist:", "").trim());
      const rawItem = Number(params.get("item"));
      const itemHash = Number.isNaN(rawItem) ? 0 : Math.abs(rawItem);
      const perkHashes = (params.get("perks") ?? "")
        .split(",")
        .map((hash) => Number(hash.trim()))
        .filter((hash) => !Number.isNaN(hash));

      entries.push({
        id: crypto.randomUUID(),
        itemHash,
        perkHashes,
        notes: notesPart ? notesPart.trim() : null,
        blockNotes: activeBlockNotes,
        type: rawItem < 0 ? "trashlist" : "wishlist"
      });
    }
  });

  return {
    title,
    description,
    entries
  };
};

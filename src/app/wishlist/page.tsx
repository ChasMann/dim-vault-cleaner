/**
 * Wishlist builder page for DIM wishlist text files.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { buildWishlistText, parseWishlistText } from "@/lib/wishlist";
import { WishlistEntry, WishlistFile } from "@/lib/types";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Input } from "@/ui/input";
import { Select } from "@/ui/select";
import { Textarea } from "@/ui/textarea";

interface WishlistDraft {
  id?: string;
  name: string;
  title?: string | null;
  description?: string | null;
  entries: WishlistEntry[];
}

/**
 * Renders wishlist builder UI and export options.
 */
export default function WishlistBuilderPage() {
  const [files, setFiles] = useState<WishlistFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [draft, setDraft] = useState<WishlistDraft>({ name: "", title: "", description: "", entries: [] });
  const [importText, setImportText] = useState<string>("");

  /**
   * Loads saved wishlist files from the API.
   */
  const loadData = async () => {
    const response = await fetch("/api/wishlist");
    const data = (await response.json()) as WishlistFile[];
    setFiles(data);
    setSelectedFileId(data[0]?.id ?? "");
  };

  useEffect(() => {
    loadData().catch(() => {
      // Errors bubble to the boundary.
    });
  }, []);

  useEffect(() => {
    const file = files.find((item) => item.id === selectedFileId);
    if (file) {
      setDraft({
        id: file.id,
        name: file.name,
        title: file.title,
        description: file.description,
        entries: file.entries
      });
    }
  }, [files, selectedFileId]);

  const output = useMemo(() => buildWishlistText(draft), [draft]);

  /**
   * Adds a new wishlist entry draft row.
   */
  const addEntry = () => {
    setDraft((prev) => ({
      ...prev,
      entries: [
        ...prev.entries,
        {
          id: crypto.randomUUID(),
          itemHash: 0,
          perkHashes: [],
          notes: "",
          blockNotes: "",
          type: "wishlist"
        }
      ]
    }));
  };

  /**
   * Updates a wishlist entry in the draft list.
   */
  const updateEntry = (index: number, updates: Partial<WishlistEntry>) => {
    setDraft((prev) => {
      const next = [...prev.entries];
      next[index] = { ...next[index], ...updates };
      return { ...prev, entries: next };
    });
  };

  /**
   * Removes a wishlist entry from the draft list.
   */
  const removeEntry = (index: number) => {
    setDraft((prev) => ({ ...prev, entries: prev.entries.filter((_, entryIndex) => entryIndex !== index) }));
  };

  /**
   * Saves the wishlist file to persistent storage.
   */
  const saveFile = async () => {
    const payload = {
      name: draft.name,
      title: draft.title,
      description: draft.description,
      entries: draft.entries
    };

    if (draft.id) {
      await fetch(`/api/wishlist/${draft.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    const response = await fetch("/api/wishlist");
    const data = (await response.json()) as WishlistFile[];
    setFiles(data);
    setSelectedFileId(data[0]?.id ?? "");
  };

  /**
   * Deletes the selected wishlist file.
   */
  const deleteFile = async () => {
    if (!draft.id) {
      return;
    }

    await fetch(`/api/wishlist/${draft.id}`, { method: "DELETE" });
    const response = await fetch("/api/wishlist");
    const data = (await response.json()) as WishlistFile[];
    setFiles(data);
    setSelectedFileId(data[0]?.id ?? "");
  };

  /**
   * Copies the wishlist text output to the clipboard.
   */
  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
  };

  /**
   * Downloads the wishlist output as a .txt file.
   */
  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${draft.name || "wishlist"}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Parses pasted wishlist lines into entries.
   */
  const importWishlist = () => {
    if (!importText) {
      return;
    }

    const parsed = parseWishlistText(importText);
    setDraft((prev) => ({
      ...prev,
      title: parsed.title ?? prev.title,
      description: parsed.description ?? prev.description,
      entries: [...prev.entries, ...parsed.entries]
    }));
    setImportText("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Wishlist Files</h2>
            <p className="text-sm text-slate-400">Build DIM wishlist and trashlist files.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setDraft({ name: "", title: "", description: "", entries: [] })}>
              New file
            </Button>
            <Button onClick={saveFile} disabled={!draft.name}>
              Save file
            </Button>
            <Button variant="danger" onClick={deleteFile} disabled={!draft.id}>
              Delete file
            </Button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[220px_1fr]">
          <div className="space-y-2">
            {files.map((file) => (
              <Button
                key={file.id}
                variant={file.id === selectedFileId ? "primary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedFileId(file.id)}
              >
                {file.name}
              </Button>
            ))}
          </div>
          <div className="space-y-3">
            <Input
              value={draft.name}
              onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Wishlist file name"
            />
            <Input
              value={draft.title ?? ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Optional title"
            />
            <Textarea
              value={draft.description ?? ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Optional description"
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold">Entries</h2>
          <Button onClick={addEntry}>Add entry</Button>
        </div>
        <div className="mt-4 space-y-3">
          {draft.entries.length === 0 ? (
            <p className="text-sm text-slate-400">Add wishlist entries to begin.</p>
          ) : (
            draft.entries.map((entry, index) => (
              <div key={entry.id} className="rounded-md border border-panel-border bg-panel p-4">
                <div className="grid gap-2 md:grid-cols-4">
                  <Input
                    type="number"
                    value={entry.itemHash}
                    onChange={(event) => updateEntry(index, { itemHash: Number(event.target.value) })}
                    placeholder="Item hash"
                  />
                  <Input
                    value={entry.perkHashes.join(",")}
                    onChange={(event) =>
                      updateEntry(index, {
                        perkHashes: event.target.value
                          .split(",")
                          .map((hash) => Number(hash.trim()))
                          .filter((hash) => !Number.isNaN(hash))
                      })
                    }
                    placeholder="Perk hashes (comma separated)"
                  />
                  <Select
                    value={entry.type}
                    onChange={(event) => updateEntry(index, { type: event.target.value as WishlistEntry["type"] })}
                  >
                    <option value="wishlist">Wishlist</option>
                    <option value="trashlist">Trashlist</option>
                  </Select>
                  <Button variant="danger" onClick={() => removeEntry(index)}>
                    Remove
                  </Button>
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <Input
                    value={entry.notes ?? ""}
                    onChange={(event) => updateEntry(index, { notes: event.target.value })}
                    placeholder="#notes line"
                  />
                  <Input
                    value={entry.blockNotes ?? ""}
                    onChange={(event) => updateEntry(index, { blockNotes: event.target.value })}
                    placeholder="//notes block"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Use item hash -69420 to apply wildcard perks across all items.
                </p>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Import Wishlist Lines</h2>
        <Textarea
          className="mt-3"
          value={importText}
          onChange={(event) => setImportText(event.target.value)}
          placeholder="Paste DIM wishlist lines here"
        />
        <Button className="mt-3" variant="secondary" onClick={importWishlist} disabled={!importText}>
          Import lines
        </Button>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Export</h2>
        <pre className="mt-3 whitespace-pre-wrap rounded-md bg-slate-900 p-4 text-xs text-slate-100">
          {output || "No entries yet."}
        </pre>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={copyOutput} disabled={!output}>
            Copy to clipboard
          </Button>
          <Button variant="secondary" onClick={downloadOutput} disabled={!output}>
            Download .txt
          </Button>
        </div>
      </Card>
    </div>
  );
}

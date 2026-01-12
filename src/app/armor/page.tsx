/**
 * Armor set tracker page for checkbox grid tracking.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { ArmorSection, ArmorSet } from "@/lib/types";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Checkbox } from "@/ui/checkbox";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";

interface SetDraft {
  id?: string;
  name: string;
  notes?: string | null;
  sections: ArmorSection[];
}

/**
 * Renders the armor set tracker with grids and progress metrics.
 */
export default function ArmorTrackerPage() {
  const [sets, setSets] = useState<ArmorSet[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<string>("");
  const [draft, setDraft] = useState<SetDraft>({ name: "", notes: "", sections: [] });

  /**
   * Loads armor sets from persistent storage.
   */
  const loadData = async () => {
    const response = await fetch("/api/armor");
    const data = (await response.json()) as ArmorSet[];
    setSets(data);
    setSelectedSetId(data[0]?.id ?? "");
  };

  useEffect(() => {
    loadData().catch(() => {
      // Errors bubble to the boundary.
    });
  }, []);

  useEffect(() => {
    const set = sets.find((item) => item.id === selectedSetId);
    if (set) {
      setDraft({ id: set.id, name: set.name, notes: set.notes ?? "", sections: set.sections });
    }
  }, [sets, selectedSetId]);

  const setCompletion = useMemo(() => {
    const allCells = draft.sections.flatMap((section) => Object.values(section.cells));
    if (allCells.length === 0) {
      return 0;
    }

    const completed = allCells.filter(Boolean).length;
    return Math.round((completed / allCells.length) * 100);
  }, [draft.sections]);

  /**
   * Calculates completion percentage for a section.
   */
  const sectionCompletion = (section: ArmorSection) => {
    const values = Object.values(section.cells);
    if (values.length === 0) {
      return 0;
    }
    const completed = values.filter(Boolean).length;
    return Math.round((completed / values.length) * 100);
  };

  /**
   * Starts a new armor set draft.
   */
  const addSet = () => {
    setDraft({ name: "", notes: "", sections: [] });
    setSelectedSetId("");
  };

  /**
   * Adds a new section to the current set draft.
   */
  const addSection = () => {
    setDraft((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: crypto.randomUUID(),
          title: "New Section",
          rows: ["Helmet", "Arms", "Chest", "Legs", "Class Item"],
          columns: ["Grenade", "Melee", "Super", "Class", "Weapons"],
          rowNotes: {},
          cells: {}
        }
      ]
    }));
  };

  /**
   * Updates a section within the armor set draft.
   */
  const updateSection = (index: number, updates: Partial<ArmorSection>) => {
    setDraft((prev) => {
      const next = [...prev.sections];
      next[index] = { ...next[index], ...updates };
      return { ...prev, sections: next };
    });
  };

  /**
   * Toggles a checkbox cell in the grid for a section.
   */
  const toggleCell = (sectionIndex: number, row: string, column: string) => {
    setDraft((prev) => {
      const next = [...prev.sections];
      const section = next[sectionIndex];
      const key = `${row}:${column}`;
      const nextCells = { ...section.cells, [key]: !section.cells[key] };
      next[sectionIndex] = { ...section, cells: nextCells };
      return { ...prev, sections: next };
    });
  };

  /**
   * Persists the armor set to the API.
   */
  const saveSet = async () => {
    const payload = { name: draft.name, notes: draft.notes, sections: draft.sections };

    if (draft.id) {
      await fetch(`/api/armor/${draft.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch("/api/armor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    const response = await fetch("/api/armor");
    const data = (await response.json()) as ArmorSet[];
    setSets(data);
    setSelectedSetId(data[0]?.id ?? "");
  };

  /**
   * Deletes the selected armor set.
   */
  const deleteSet = async () => {
    if (!draft.id) {
      return;
    }

    await fetch(`/api/armor/${draft.id}`, { method: "DELETE" });
    const response = await fetch("/api/armor");
    const data = (await response.json()) as ArmorSet[];
    setSets(data);
    setSelectedSetId(data[0]?.id ?? "");
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Armor Sets</h2>
            <p className="text-sm text-slate-400">Completion: {setCompletion}%</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={addSet}>
              New set
            </Button>
            <Button onClick={saveSet} disabled={!draft.name}>
              Save set
            </Button>
            <Button variant="danger" onClick={deleteSet} disabled={!draft.id}>
              Delete set
            </Button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[200px_1fr]">
          <div className="space-y-2">
            {sets.map((set) => (
              <Button
                key={set.id}
                variant={set.id === selectedSetId ? "primary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedSetId(set.id)}
              >
                {set.name}
              </Button>
            ))}
          </div>
          <div className="space-y-3">
            <Input
              value={draft.name}
              onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Set name"
            />
            <Textarea
              value={draft.notes ?? ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, notes: event.target.value }))}
              placeholder="Set notes"
            />
            <Button variant="secondary" onClick={addSection}>
              Add section
            </Button>
          </div>
        </div>
      </Card>

      {draft.sections.map((section, sectionIndex) => (
        <Card key={section.id}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              value={section.title}
              onChange={(event) => updateSection(sectionIndex, { title: event.target.value })}
              placeholder="Section title"
            />
            <p className="text-sm text-slate-400">Completion: {sectionCompletion(section)}%</p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Textarea
              value={section.rows.join("\n")}
              onChange={(event) =>
                updateSection(sectionIndex, { rows: event.target.value.split("\n").filter(Boolean) })
              }
              placeholder="Row labels (one per line)"
            />
            <Textarea
              value={section.columns.join("\n")}
              onChange={(event) =>
                updateSection(sectionIndex, { columns: event.target.value.split("\n").filter(Boolean) })
              }
              placeholder="Column labels (one per line)"
            />
          </div>
          <div className="mt-4 overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b border-panel-border px-2 py-2 text-left">Row</th>
                  {section.columns.map((column) => (
                    <th key={column} className="border-b border-panel-border px-2 py-2 text-left">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row) => (
                  <tr key={row}>
                    <td className="border-b border-panel-border px-2 py-2">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-200">{row}</p>
                        <Input
                          value={section.rowNotes?.[row] ?? ""}
                          onChange={(event) =>
                            updateSection(sectionIndex, {
                              rowNotes: { ...section.rowNotes, [row]: event.target.value }
                            })
                          }
                          placeholder="Row notes"
                        />
                      </div>
                    </td>
                    {section.columns.map((column) => {
                      const key = `${row}:${column}`;
                      return (
                        <td key={column} className="border-b border-panel-border px-2 py-2">
                          <Checkbox
                            checked={section.cells[key] ?? false}
                            onChange={() => toggleCell(sectionIndex, row, column)}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </div>
  );
}

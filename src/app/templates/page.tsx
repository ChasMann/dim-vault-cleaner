/**
 * Templates and Favorites management page.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { FavoriteSearch, RuleDefinition, SearchTemplate } from "@/lib/types";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Input } from "@/ui/input";
import { Select } from "@/ui/select";
import { Textarea } from "@/ui/textarea";

interface TemplateDraft {
  id?: string;
  name: string;
  rules: RuleDefinition[];
}

/**
 * Renders the template editor and favorites library.
 */
export default function TemplatesPage() {
  const [templates, setTemplates] = useState<SearchTemplate[]>([]);
  const [favorites, setFavorites] = useState<FavoriteSearch[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [draft, setDraft] = useState<TemplateDraft>({ name: "", rules: [] });
  const [importJson, setImportJson] = useState<string>("");

  /**
   * Loads templates and favorites on initial render.
   */
  const loadData = async () => {
    const [templatesResponse, favoritesResponse] = await Promise.all([
      fetch("/api/templates"),
      fetch("/api/favorites")
    ]);
    const templateData = (await templatesResponse.json()) as SearchTemplate[];
    const favoriteData = (await favoritesResponse.json()) as FavoriteSearch[];

    setTemplates(templateData);
    setFavorites(favoriteData);

    if (templateData.length > 0) {
      setSelectedTemplateId(templateData[0].id);
    }
  };

  useEffect(() => {
    loadData().catch(() => {
      // Errors fall through to the error boundary.
    });
  }, []);

  useEffect(() => {
    const template = templates.find((item) => item.id === selectedTemplateId);
    if (template) {
      setDraft({ id: template.id, name: template.name, rules: template.rules });
    }
  }, [templates, selectedTemplateId]);

  const hasTemplate = useMemo(() => Boolean(draft.name), [draft.name]);

  /**
   * Updates a rule within the template draft.
   */
  const updateRule = (index: number, updates: Partial<RuleDefinition>) => {
    setDraft((prev) => {
      const nextRules = [...prev.rules];
      nextRules[index] = { ...nextRules[index], ...updates };
      return { ...prev, rules: nextRules };
    });
  };

  /**
   * Adds a new rule row to the current template draft.
   */
  const addRule = () => {
    setDraft((prev) => ({
      ...prev,
      rules: [
        ...prev.rules,
        {
          id: crypto.randomUUID(),
          prefix: "is:",
          label: "New Rule",
          inputType: "text",
          options: [],
          requiresQuotes: false
        }
      ]
    }));
  };

  /**
   * Saves the current template draft to the API.
   */
  const saveTemplate = async () => {
    const payload = { name: draft.name, rules: draft.rules };
    if (draft.id) {
      await fetch(`/api/templates/${draft.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    const templatesResponse = await fetch("/api/templates");
    setTemplates((await templatesResponse.json()) as SearchTemplate[]);
  };

  /**
   * Deletes the currently selected template.
   */
  const deleteTemplate = async () => {
    if (!draft.id) {
      return;
    }

    await fetch(`/api/templates/${draft.id}`, { method: "DELETE" });
    const templatesResponse = await fetch("/api/templates");
    const templateData = (await templatesResponse.json()) as SearchTemplate[];
    setTemplates(templateData);
    setSelectedTemplateId(templateData[0]?.id ?? "");
  };

  /**
   * Updates a favorite name as the user types.
   */
  const renameFavorite = async (favorite: FavoriteSearch, name: string) => {
    await fetch(`/api/favorites/${favorite.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        templateId: favorite.templateId,
        selections: favorite.selections
      })
    });

    const favoritesResponse = await fetch("/api/favorites");
    setFavorites((await favoritesResponse.json()) as FavoriteSearch[]);
  };

  /**
   * Creates a copy of an existing favorite.
   */
  const duplicateFavorite = async (favorite: FavoriteSearch) => {
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${favorite.name} (Copy)`,
        templateId: favorite.templateId,
        selections: favorite.selections
      })
    });

    const favoritesResponse = await fetch("/api/favorites");
    setFavorites((await favoritesResponse.json()) as FavoriteSearch[]);
  };

  /**
   * Deletes a favorite entry.
   */
  const deleteFavorite = async (favorite: FavoriteSearch) => {
    await fetch(`/api/favorites/${favorite.id}`, { method: "DELETE" });
    const favoritesResponse = await fetch("/api/favorites");
    setFavorites((await favoritesResponse.json()) as FavoriteSearch[]);
  };

  /**
   * Exports templates and favorites as a JSON backup.
   */
  const exportBackup = () => {
    const payload = JSON.stringify({ templates, favorites }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "dim-vault-backup.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Imports templates and favorites from a JSON payload.
   */
  const importBackup = async () => {
    if (!importJson) {
      return;
    }

    const parsed = JSON.parse(importJson) as { templates?: SearchTemplate[]; favorites?: FavoriteSearch[] };
    if (parsed.templates) {
      await Promise.all(
        parsed.templates.map((template) =>
          fetch("/api/templates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: template.name, rules: template.rules })
          })
        )
      );
    }

    if (parsed.favorites) {
      await Promise.all(
        parsed.favorites.map((favorite) =>
          fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: favorite.name,
              templateId: favorite.templateId,
              selections: favorite.selections
            })
          })
        )
      );
    }

    const [templatesResponse, favoritesResponse] = await Promise.all([
      fetch("/api/templates"),
      fetch("/api/favorites")
    ]);

    setTemplates((await templatesResponse.json()) as SearchTemplate[]);
    setFavorites((await favoritesResponse.json()) as FavoriteSearch[]);
    setImportJson("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">Template Editor</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-[200px_1fr]">
          <div>
            <label className="text-sm font-semibold text-slate-200">Select template</label>
            <Select
              className="mt-2"
              value={selectedTemplateId}
              onChange={(event) => setSelectedTemplateId(event.target.value)}
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
              <option value="">New template</option>
            </Select>
            <Button className="mt-3 w-full" variant="secondary" onClick={() => setDraft({ name: "", rules: [] })}>
              New template
            </Button>
          </div>
          <div className="space-y-3">
            <Input
              value={draft.name}
              onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Template name"
            />
            {draft.rules.map((rule, index) => (
              <div key={rule.id} className="rounded-md border border-panel-border bg-panel p-4">
                <div className="grid gap-2 md:grid-cols-2">
                  <Input
                    value={rule.label}
                    onChange={(event) => updateRule(index, { label: event.target.value })}
                    placeholder="Rule label"
                  />
                  <Input
                    value={rule.prefix}
                    onChange={(event) => updateRule(index, { prefix: event.target.value })}
                    placeholder="Prefix (e.g. is:)"
                  />
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-3">
                  <Select
                    value={rule.inputType}
                    onChange={(event) => updateRule(index, { inputType: event.target.value as RuleDefinition["inputType"] })}
                  >
                    <option value="text">Text</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="multiselect">Multi-select</option>
                    <option value="number-range">Number range</option>
                  </Select>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={rule.requiresQuotes}
                      onChange={(event) => updateRule(index, { requiresQuotes: event.target.checked })}
                    />
                    Requires quotes
                  </label>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        rules: prev.rules.filter((_, ruleIndex) => ruleIndex !== index)
                      }))
                    }
                  >
                    Remove
                  </Button>
                </div>
                {(rule.inputType === "dropdown" || rule.inputType === "multiselect") && (
                  <Textarea
                    className="mt-3"
                    value={rule.options?.join("\n") ?? ""}
                    onChange={(event) =>
                      updateRule(index, { options: event.target.value.split("\n").filter(Boolean) })
                    }
                    placeholder="Options, one per line"
                  />
                )}
              </div>
            ))}
            <div className="flex flex-wrap gap-3">
              <Button onClick={addRule}>Add rule</Button>
              <Button variant="secondary" onClick={saveTemplate} disabled={!hasTemplate}>
                Save template
              </Button>
              <Button variant="danger" onClick={deleteTemplate} disabled={!draft.id}>
                Delete template
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Favorites Library</h2>
        <div className="mt-4 space-y-3">
          {favorites.length === 0 ? (
            <p className="text-sm text-slate-400">No favorites saved yet.</p>
          ) : (
            favorites.map((favorite) => (
              <div key={favorite.id} className="rounded-md border border-panel-border bg-panel p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <Input
                    value={favorite.name}
                    onChange={(event) => renameFavorite(favorite, event.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => duplicateFavorite(favorite)}>
                      Duplicate
                    </Button>
                    <Button variant="danger" onClick={() => deleteFavorite(favorite)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Backup & Import</h2>
        <p className="mt-2 text-sm text-slate-400">
          Export templates and favorites to JSON for backups, or import a JSON payload to restore later.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={exportBackup}>Export JSON</Button>
        </div>
        <Textarea
          className="mt-4"
          value={importJson}
          onChange={(event) => setImportJson(event.target.value)}
          placeholder="Paste backup JSON here"
        />
        <Button className="mt-3" variant="secondary" onClick={importBackup} disabled={!importJson}>
          Import JSON
        </Button>
      </Card>
    </div>
  );
}

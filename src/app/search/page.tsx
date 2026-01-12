/**
 * Search builder page for generating DIM search queries.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { buildSearchQuery } from "@/lib/search";
import { AppSetting, RuleSelections, SearchTemplate } from "@/lib/types";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Input } from "@/ui/input";
import { Select } from "@/ui/select";

interface FavoriteDraft {
  name: string;
}

/**
 * Renders the Search Builder with template-driven rules.
 */
export default function SearchBuilderPage() {
  const [templates, setTemplates] = useState<SearchTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [selections, setSelections] = useState<RuleSelections>({});
  const [namedQuery, setNamedQuery] = useState<string>("My Query");
  const [favoriteDraft, setFavoriteDraft] = useState<FavoriteDraft>({ name: "" });
  const [includeComment, setIncludeComment] = useState<boolean>(false);

  /**
   * Loads templates and settings for the initial render.
   */
  const loadData = async () => {
    const [templatesResponse, settingsResponse] = await Promise.all([
      fetch("/api/templates"),
      fetch("/api/settings")
    ]);
    const templateData = (await templatesResponse.json()) as SearchTemplate[];
    const settingsData = (await settingsResponse.json()) as AppSetting;

    setTemplates(templateData);

    const initialTemplateId = settingsData.defaultTemplateId ?? templateData[0]?.id ?? "";
    setSelectedTemplateId(initialTemplateId);
    setIncludeComment(settingsData.copyWithComment);
  };

  useEffect(() => {
    loadData().catch(() => {
      // Errors bubble to the error boundary for logging.
    });
  }, []);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId),
    [templates, selectedTemplateId]
  );

  const query = useMemo(() => {
    if (!selectedTemplate) {
      return "";
    }

    return buildSearchQuery(selectedTemplate.rules, selections);
  }, [selectedTemplate, selections]);

  const output = includeComment && namedQuery ? `/* ${namedQuery} */ ${query}`.trim() : query;

  /**
   * Formats a number range value while avoiding empty placeholders.
   */
  const formatRange = (minValue: string, maxValue: string) => {
    if (!minValue && !maxValue) {
      return "";
    }

    return `${minValue}-${maxValue}`;
  };

  /**
   * Updates the local selection state for a rule.
   */
  const updateSelection = (ruleId: string, value: string | string[]) => {
    setSelections((prev) => ({ ...prev, [ruleId]: value }));
  };

  /**
   * Copies the built query to the clipboard.
   */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
  };

  /**
   * Persists the current query selections as a favorite.
   */
  const handleSaveFavorite = async () => {
    if (!favoriteDraft.name) {
      return;
    }

    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: favoriteDraft.name,
        templateId: selectedTemplateId,
        selections
      })
    });

    setFavoriteDraft({ name: "" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <label className="text-sm font-semibold text-slate-200">Template</label>
            <Select
              value={selectedTemplateId}
              onChange={(event) => setSelectedTemplateId(event.target.value)}
              className="mt-2"
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-semibold text-slate-200">Named query comment</label>
            <Input
              className="mt-2"
              value={namedQuery}
              onChange={(event) => setNamedQuery(event.target.value)}
              placeholder="My Query Name"
            />
            <label className="mt-3 flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={includeComment}
                onChange={(event) => setIncludeComment(event.target.checked)}
              />
              Include named query comment
            </label>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Rules</h2>
        <div className="mt-4 space-y-4">
          {selectedTemplate?.rules.map((rule) => {
            const value = selections[rule.id];
            return (
              <div key={rule.id} className="grid gap-3 md:grid-cols-[160px_1fr]">
                <div>
                  <p className="text-sm font-semibold text-slate-200">{rule.label}</p>
                  <p className="text-xs text-slate-400">{rule.prefix}</p>
                </div>
                <div>
                  {rule.inputType === "dropdown" && (
                    <Select
                      value={typeof value === "string" ? value : ""}
                      onChange={(event) => updateSelection(rule.id, event.target.value)}
                    >
                      <option value="">Select value</option>
                      {rule.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  )}
                  {rule.inputType === "text" && (
                    <Input
                      value={typeof value === "string" ? value : ""}
                      onChange={(event) => updateSelection(rule.id, event.target.value)}
                      placeholder="Enter value"
                    />
                  )}
                  {rule.inputType === "multiselect" && (
                    <Select
                      multiple
                      value={Array.isArray(value) ? value : []}
                      onChange={(event) =>
                        updateSelection(
                          rule.id,
                          Array.from(event.target.selectedOptions).map((option) => option.value)
                        )
                      }
                    >
                      {rule.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  )}
                  {rule.inputType === "number-range" && (
                    <div className="grid gap-2 md:grid-cols-2">
                      <Input
                        type="number"
                        value={typeof value === "string" ? value.split("-")[0] ?? "" : ""}
                        onChange={(event) => {
                          const next = formatRange(
                            event.target.value,
                            typeof value === "string" ? value.split("-")[1] ?? "" : ""
                          );
                          updateSelection(rule.id, next);
                        }}
                        placeholder="Min"
                      />
                      <Input
                        type="number"
                        value={typeof value === "string" ? value.split("-")[1] ?? "" : ""}
                        onChange={(event) => {
                          const next = formatRange(
                            typeof value === "string" ? value.split("-")[0] ?? "" : "",
                            event.target.value
                          );
                          updateSelection(rule.id, next);
                        }}
                        placeholder="Max"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Output</h2>
        <p className="mt-2 text-sm text-slate-400">
          Empty rules are excluded automatically, and quotes are applied only for rules configured to require them.
        </p>
        <pre className="mt-4 whitespace-pre-wrap rounded-md bg-slate-900 p-4 text-sm text-slate-100">
          {output || "No rules selected yet."}
        </pre>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={handleCopy} disabled={!output}>
            Copy to clipboard
          </Button>
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              value={favoriteDraft.name}
              onChange={(event) => setFavoriteDraft({ name: event.target.value })}
              placeholder="Favorite name"
            />
            <Button variant="secondary" onClick={handleSaveFavorite} disabled={!favoriteDraft.name}>
              Save favorite
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * Settings screen for defaults, backups, and logging configuration.
 */
"use client";

import { useEffect, useState } from "react";
import { AppSetting, ArmorSet, FavoriteSearch, SearchTemplate, WishlistFile } from "@/lib/types";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Input } from "@/ui/input";
import { Select } from "@/ui/select";
import { Textarea } from "@/ui/textarea";

interface BackupPayload {
  templates: SearchTemplate[];
  favorites: FavoriteSearch[];
  armorSets: ArmorSet[];
  wishlistFiles: WishlistFile[];
  settings: AppSetting;
}

/**
 * Renders settings and backup management tools.
 */
export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSetting>({ copyWithComment: false });
  const [templates, setTemplates] = useState<SearchTemplate[]>([]);
  const [backupJson, setBackupJson] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  /**
   * Loads settings and template metadata.
   */
  const loadData = async () => {
    const [settingsResponse, templatesResponse] = await Promise.all([
      fetch("/api/settings"),
      fetch("/api/templates")
    ]);
    setSettings((await settingsResponse.json()) as AppSetting);
    setTemplates((await templatesResponse.json()) as SearchTemplate[]);
  };

  useEffect(() => {
    loadData().catch(() => {
      // Errors bubble to the boundary.
    });
  }, []);

  /**
   * Persists the settings configuration.
   */
  const saveSettings = async () => {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    setStatus("Settings saved.");
  };

  /**
   * Exports all stored data to a JSON backup file.
   */
  const exportAllData = async () => {
    const [favoritesResponse, armorResponse, wishlistResponse] = await Promise.all([
      fetch("/api/favorites"),
      fetch("/api/armor"),
      fetch("/api/wishlist")
    ]);

    const payload: BackupPayload = {
      templates,
      favorites: (await favoritesResponse.json()) as FavoriteSearch[],
      armorSets: (await armorResponse.json()) as ArmorSet[],
      wishlistFiles: (await wishlistResponse.json()) as WishlistFile[],
      settings
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "dim-vault-toolkit-backup.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Imports a full backup JSON payload into the database.
   */
  const importAllData = async () => {
    if (!backupJson) {
      return;
    }

    const parsed = JSON.parse(backupJson) as BackupPayload;

    await fetch("/api/reset", { method: "POST" });

    await Promise.all(
      parsed.templates.map((template) =>
        fetch("/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: template.name, rules: template.rules })
        })
      )
    );

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

    await Promise.all(
      parsed.armorSets.map((set) =>
        fetch("/api/armor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: set.name, notes: set.notes, sections: set.sections })
        })
      )
    );

    await Promise.all(
      parsed.wishlistFiles.map((file) =>
        fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name,
            title: file.title,
            description: file.description,
            entries: file.entries
          })
        })
      )
    );

    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.settings)
    });

    setBackupJson("");
    setStatus("Backup imported.");
  };

  /**
   * Resets all local data for a clean slate.
   */
  const resetData = async () => {
    await fetch("/api/reset", { method: "POST" });
    setStatus("Data reset to empty state.");
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">Defaults</h2>
        <div className="mt-4 space-y-3">
          <label className="text-sm font-semibold text-slate-200">Default template</label>
          <Select
            value={settings.defaultTemplateId ?? ""}
            onChange={(event) => setSettings((prev) => ({ ...prev, defaultTemplateId: event.target.value || null }))}
          >
            <option value="">None</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </Select>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={settings.copyWithComment}
              onChange={(event) => setSettings((prev) => ({ ...prev, copyWithComment: event.target.checked }))}
            />
            Copy search queries with named comment by default
          </label>
          <Button onClick={saveSettings}>Save settings</Button>
          {status && <p className="text-sm text-success">{status}</p>}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Backup & Restore</h2>
        <p className="mt-2 text-sm text-slate-400">Export full data or import from a JSON backup.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button onClick={exportAllData}>Export all data</Button>
          <Button variant="danger" onClick={resetData}>
            Reset local data
          </Button>
        </div>
        <Textarea
          className="mt-4"
          value={backupJson}
          onChange={(event) => setBackupJson(event.target.value)}
          placeholder="Paste full backup JSON here"
        />
        <Button className="mt-3" variant="secondary" onClick={importAllData} disabled={!backupJson}>
          Import backup
        </Button>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Logging</h2>
        <p className="mt-2 text-sm text-slate-400">
          Error logs are stored locally in SQLite and can optionally forward to Sentry when configured.
        </p>
        <Input className="mt-3" value={process.env.NEXT_PUBLIC_SENTRY_DSN ?? "Not configured"} readOnly />
      </Card>
    </div>
  );
}

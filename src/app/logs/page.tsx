/**
 * Error logs viewer with filtering and copy support.
 */
"use client";

import { useEffect, useState } from "react";
import { ErrorLogEntry } from "@/lib/types";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Select } from "@/ui/select";

/**
 * Renders the error log viewer with filters.
 */
export default function LogsPage() {
  const [entries, setEntries] = useState<ErrorLogEntry[]>([]);
  const [sourceFilter, setSourceFilter] = useState<string>("");

  /**
   * Loads error logs from the API with the active filter.
   */
  const loadLogs = async () => {
    const url = sourceFilter ? `/api/errors?source=${sourceFilter}` : "/api/errors";
    const response = await fetch(url);
    setEntries((await response.json()) as ErrorLogEntry[]);
  };

  useEffect(() => {
    loadLogs().catch(() => {
      // Errors bubble to the boundary.
    });
  }, [sourceFilter]);

  /**
   * Copies a log entry as JSON to the clipboard.
   */
  const copyDetails = async (entry: ErrorLogEntry) => {
    const payload = JSON.stringify(entry, null, 2);
    await navigator.clipboard.writeText(payload);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Error Logs</h2>
            <p className="text-sm text-slate-400">Client and server errors are stored locally.</p>
          </div>
          <div className="flex gap-2">
            <Select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
              <option value="">All sources</option>
              <option value="client">Client</option>
              <option value="server">Server</option>
            </Select>
            <Button variant="secondary" onClick={loadLogs}>
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {entries.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-400">No error logs yet.</p>
        </Card>
      ) : (
        entries.map((entry) => (
          <Card key={entry.id}>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-200">{entry.message}</p>
                <p className="text-xs text-slate-400">
                  {entry.source} • {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
              <Button variant="ghost" onClick={() => copyDetails(entry)}>
                Copy details
              </Button>
            </div>
            {entry.stack && (
              <pre className="mt-3 whitespace-pre-wrap rounded-md bg-slate-900 p-3 text-xs text-slate-200">
                {entry.stack}
              </pre>
            )}
          </Card>
        ))
      )}
    </div>
  );
}

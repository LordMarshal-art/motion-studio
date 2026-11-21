"use client";

import React from "react";
import { Bookmark, FolderKanban, LayoutGrid, Trash2 } from "lucide-react";
import { GRAPHIC_TEMPLATES, GraphicTemplate } from "@/data/templates";
import { SavedGraphicItem } from "@/types/motion";

export type NavTab = "studio" | "templates" | "saved";

interface StudioSidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onApplyTemplate: (tpl: GraphicTemplate) => void;
  onSaveCurrent: () => void;
  savedItems: SavedGraphicItem[];
  onLoadSaved: (item: SavedGraphicItem) => void;
  onDeleteSaved: (id: string) => void;
}

export function StudioSidebar({
  activeTab,
  onSelectTab,
  onApplyTemplate,
  onSaveCurrent,
  savedItems,
  onLoadSaved,
  onDeleteSaved,
}: StudioSidebarProps) {
  return (
    <aside className="flex flex-col justify-between border-b border-slate-800/90 bg-[#0B0F19] p-4 lg:border-b-0 lg:border-r">
      <div className="space-y-6">
        <div>
          <p className="mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Workspace
          </p>
          <div className="flex gap-1.5 overflow-x-auto lg:flex-col">
            <button
              type="button"
              onClick={() => onSelectTab("studio")}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold transition ${
                activeTab === "studio"
                  ? "border border-amber-400/30 bg-slate-800/90 text-amber-400"
                  : "text-slate-300 hover:bg-slate-800/50"
              }`}
            >
              <FolderKanban className="h-3.5 w-3.5" />
              <span>Editor Canvas</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("templates")}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold transition ${
                activeTab === "templates"
                  ? "border border-amber-400/30 bg-slate-800/90 text-amber-400"
                  : "text-slate-300 hover:bg-slate-800/50"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Templates ({GRAPHIC_TEMPLATES.length})</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("saved")}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold transition ${
                activeTab === "saved"
                  ? "border border-amber-400/30 bg-slate-800/90 text-amber-400"
                  : "text-slate-300 hover:bg-slate-800/50"
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>Saved ({savedItems.length})</span>
            </button>
          </div>
        </div>

        {activeTab === "templates" ? (
          <div>
            <p className="mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Starter Templates
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {GRAPHIC_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => onApplyTemplate(tpl)}
                  className="rounded-xl border border-slate-800 bg-[#111726] p-3 text-left transition hover:border-amber-400/60"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">{tpl.title}</span>
                    <span className="rounded bg-sky-400/10 px-1.5 py-0.5 text-[10px] text-sky-300">
                      {tpl.category}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">{tpl.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : activeTab === "saved" ? (
          <div>
            <p className="mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Local Library
            </p>
            {savedItems.length === 0 ? (
              <p className="rounded-lg border border-slate-800 bg-[#111726] p-3 text-xs text-slate-400">
                No saved graphics yet. Tap “Save Graphic to Local Library” below to keep a snapshot.
              </p>
            ) : (
              <div className="space-y-2">
                {savedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-[#111726] p-2.5"
                  >
                    <button
                      type="button"
                      onClick={() => onLoadSaved(item)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="truncate text-xs font-semibold text-white">
                        {item.spec.headline || "Untitled"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.canvas.aspect} · {item.spec.durationSec}s
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSaved(item.id)}
                      aria-label="Delete saved graphic"
                      className="rounded p-1.5 text-slate-400 hover:bg-red-500/15 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Quick Presets
            </p>
            <div className="grid grid-cols-2 gap-2">
              {GRAPHIC_TEMPLATES.slice(0, 6).map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => onApplyTemplate(tpl)}
                  className="rounded-lg border border-slate-800 bg-[#111726] p-2.5 text-left text-xs font-semibold text-slate-200 transition hover:border-amber-400/60 hover:text-amber-300"
                >
                  {tpl.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-slate-800/80 pt-4">
        <button
          type="button"
          onClick={onSaveCurrent}
          className="w-full rounded-lg border border-sky-400/40 bg-sky-400/10 px-3 py-2 text-xs font-bold text-sky-300 transition hover:bg-sky-400/20"
        >
          Save Graphic to Local Library
        </button>
      </div>
    </aside>
  );
}

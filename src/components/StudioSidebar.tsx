"use client";

import React from "react";
import { Bookmark, FolderKanban, LayoutGrid, Save, Trash2 } from "lucide-react";
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
    <aside className="flex flex-col justify-between border-b border-slate-800/80 bg-[#0b101d] p-4 lg:border-r lg:border-b-0">
      <div className="space-y-6">
        <div>
          <p className="mb-2.5 px-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Command Center
          </p>
          <div className="flex gap-1.5 overflow-x-auto rounded-2xl border border-slate-800/80 bg-[#080d1a] p-1 lg:flex-col">
            <button
              type="button"
              onClick={() => onSelectTab("studio")}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                activeTab === "studio"
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 ring-1 ring-cyan-400/35"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <FolderKanban className="h-3.5 w-3.5" />
              <span>Editor Stage</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("templates")}
              className={`flex shrink-0 items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                activeTab === "templates"
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 ring-1 ring-cyan-400/35"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Templates</span>
              </span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                {GRAPHIC_TEMPLATES.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("saved")}
              className={`flex shrink-0 items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                activeTab === "saved"
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 ring-1 ring-cyan-400/35"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Bookmark className="h-3.5 w-3.5" />
                <span>Saved</span>
              </span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                {savedItems.length}
              </span>
            </button>
          </div>
        </div>

        {activeTab === "templates" ? (
          <div>
            <p className="mb-2.5 px-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              High-Retention Presets
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {GRAPHIC_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => onApplyTemplate(tpl)}
                  className="group rounded-2xl border border-slate-800/90 bg-[#11192c] p-3 text-left transition hover:border-cyan-400/50 hover:bg-[#152038]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                      {tpl.title}
                    </span>
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                      {tpl.category}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-400">
                    {tpl.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : activeTab === "saved" ? (
          <div>
            <p className="mb-2.5 px-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Local Vault
            </p>
            {savedItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-[#11192c]/60 p-3.5 text-xs leading-relaxed text-slate-400">
                No saved snapshots yet. Hit <span className="font-semibold text-cyan-300">Save to Library</span> below to store a reusable graphic.
              </div>
            ) : (
              <div className="space-y-2">
                {savedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-[#11192c] p-2.5 transition hover:border-slate-700"
                  >
                    <button
                      type="button"
                      onClick={() => onLoadSaved(item)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="truncate text-xs font-semibold text-white">
                        {item.spec.headline || "Untitled"}
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                        {item.canvas.aspect} · {item.spec.durationSec}s
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSaved(item.id)}
                      aria-label="Delete saved graphic"
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-500/15 hover:text-rose-300"
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
            <p className="mb-2.5 px-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Quick Presets
            </p>
            <div className="grid grid-cols-2 gap-2">
              {GRAPHIC_TEMPLATES.slice(0, 6).map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => onApplyTemplate(tpl)}
                  className="rounded-xl border border-slate-800/90 bg-[#11192c] p-2.5 text-left text-xs font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-300"
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
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2.5 text-xs font-bold text-cyan-300 transition hover:bg-cyan-400/20"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save to Library</span>
        </button>
      </div>
    </aside>
  );
}

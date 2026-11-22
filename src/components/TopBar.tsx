"use client";

import React from "react";
import { Film, Plus, Sparkles } from "lucide-react";

interface TopBarProps {
  projectName: string;
  isExporting: boolean;
  onNewProject: () => void;
  onExportVideo: () => void;
}

export function TopBar({
  projectName,
  isExporting,
  onNewProject,
  onExportVideo,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-800/80 bg-[#080d1a]/90 px-4 backdrop-blur-md md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20">
          <Sparkles className="h-4 w-4 stroke-[2.4]" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-extrabold tracking-tight text-white">
              Motion Studio
            </span>
            <span className="hidden rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-300 sm:inline-block">
              PRO ENGINE
            </span>
          </div>
          <p className="truncate text-[11px] text-slate-400">{projectName}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onNewProject}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-[#11192c] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:text-white"
        >
          <Plus className="h-3.5 w-3.5 text-cyan-400" />
          <span className="hidden sm:inline">New Graphic</span>
          <span className="sm:hidden">New</span>
        </button>

        <button
          type="button"
          onClick={onExportVideo}
          disabled={isExporting}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-md shadow-blue-600/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Film className="h-3.5 w-3.5 stroke-[2.3]" />
          <span>{isExporting ? "Rendering..." : "Export WebM"}</span>
        </button>
      </div>
    </header>
  );
}

"use client";

import React from "react";
import { Download, Plus, Sparkles } from "lucide-react";

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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800/90 bg-[#0A0D16]/95 px-4 backdrop-blur md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-400">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="truncate">
          <div className="truncate text-xs font-extrabold tracking-widest text-white uppercase md:text-sm">
            LORDMARSHAL <span className="text-amber-400">MOTION STUDIO</span>
          </div>
          <div className="truncate text-[11px] text-slate-400">{projectName}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-1 text-[11px] font-medium text-sky-300 lg:inline-block">
          PHASE 1 MVP
        </span>
        <button
          type="button"
          onClick={onNewProject}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-sky-400/60 hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New</span>
        </button>
        <button
          type="button"
          onClick={onExportVideo}
          disabled={isExporting}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3.5 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          <span>{isExporting ? "Exporting..." : "Export WebM"}</span>
        </button>
      </div>
    </header>
  );
}

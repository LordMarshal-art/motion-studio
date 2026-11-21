"use client";

import React from "react";
import { GRAPHIC_KIND_LABELS } from "@/data/templates";
import { BackgroundMode, GraphicKind, MotionSpec, MotionStyle } from "@/types/motion";

interface InspectorPanelProps {
  spec: MotionSpec;
  onChange: (patch: Partial<MotionSpec>) => void;
}

export function InspectorPanel({ spec, onChange }: InspectorPanelProps) {
  return (
    <aside className="space-y-4 border-t border-slate-800/90 bg-[#0B0F19] p-4 lg:border-t-0 lg:border-l">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-extrabold tracking-wider text-white uppercase">
          Property Inspector
        </h2>
        <span className="rounded bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] text-amber-300">
          {spec.kind}
        </span>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-400">Graphic Type</label>
        <select
          value={spec.kind}
          onChange={(e) => onChange({ kind: e.target.value as GraphicKind })}
          className="w-full rounded-lg border border-slate-700 bg-[#07090F] px-3 py-2 text-xs text-white"
        >
          {Object.entries(GRAPHIC_KIND_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-400">
          {spec.kind === "bullets" ? "Items (comma-separated)" : "Headline Text"}
        </label>
        <input
          type="text"
          value={spec.headline}
          onChange={(e) => onChange({ headline: e.target.value, name: e.target.value || "Untitled" })}
          className="w-full rounded-lg border border-slate-700 bg-[#07090F] px-3 py-2 text-xs text-white"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-400">Subtext / Tagline</label>
        <input
          type="text"
          value={spec.subtext}
          onChange={(e) => onChange({ subtext: e.target.value })}
          className="w-full rounded-lg border border-slate-700 bg-[#07090F] px-3 py-2 text-xs text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400">Motion Style</label>
          <select
            value={spec.motionStyle}
            onChange={(e) => onChange({ motionStyle: e.target.value as MotionStyle })}
            className="w-full rounded-lg border border-slate-700 bg-[#07090F] px-2.5 py-2 text-xs text-white"
          >
            <option value="rise">Smooth Rise</option>
            <option value="scale">Scale Pop</option>
            <option value="wipe">Directional Wipe</option>
            <option value="none">Static / None</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400">Backdrop</label>
          <select
            value={spec.background}
            onChange={(e) => onChange({ background: e.target.value as BackgroundMode })}
            className="w-full rounded-lg border border-slate-700 bg-[#07090F] px-2.5 py-2 text-xs text-white"
          >
            <option value="dark">Obsidian Dark</option>
            <option value="gradient">Blue / Gold Gradient</option>
            <option value="transparent">Transparent</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[11px]">
          <span className="font-semibold text-slate-400">Duration</span>
          <span className="font-mono text-amber-300">{spec.durationSec.toFixed(1)}s</span>
        </div>
        <input
          type="range"
          min={1.5}
          max={10}
          step={0.5}
          value={spec.durationSec}
          onChange={(e) => onChange({ durationSec: Number(e.target.value) })}
          className="w-full accent-amber-400"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[11px]">
          <span className="font-semibold text-slate-400">Font Size</span>
          <span className="font-mono text-sky-300">{spec.fontSize}px</span>
        </div>
        <input
          type="range"
          min={28}
          max={120}
          step={2}
          value={spec.fontSize}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          className="w-full accent-sky-400"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[11px]">
          <span className="font-semibold text-slate-400">Opacity</span>
          <span className="font-mono text-slate-200">{Math.round(spec.opacity * 100)}%</span>
        </div>
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.05}
          value={spec.opacity}
          onChange={(e) => onChange({ opacity: Number(e.target.value) })}
          className="w-full accent-amber-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <label className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#111726] px-3 py-2 text-xs text-slate-300">
          <span>Accent</span>
          <input
            type="color"
            value={spec.accentColor}
            onChange={(e) => onChange({ accentColor: e.target.value })}
            className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent"
          />
        </label>

        <label className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#111726] px-3 py-2 text-xs text-slate-300">
          <span>Text</span>
          <input
            type="color"
            value={spec.textColor}
            onChange={(e) => onChange({ textColor: e.target.value })}
            className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Offset X</span>
            <span>{spec.offsetX.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={-1}
            max={1}
            step={0.05}
            value={spec.offsetX}
            onChange={(e) => onChange({ offsetX: Number(e.target.value) })}
            className="w-full accent-sky-400"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Offset Y</span>
            <span>{spec.offsetY.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={-1}
            max={1}
            step={0.05}
            value={spec.offsetY}
            onChange={(e) => onChange({ offsetY: Number(e.target.value) })}
            className="w-full accent-sky-400"
          />
        </div>
      </div>
    </aside>
  );
}

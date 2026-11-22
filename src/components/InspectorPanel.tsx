"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { GRAPHIC_KIND_LABELS } from "@/data/templates";
import { BackgroundMode, GraphicKind, MotionSpec, MotionStyle } from "@/types/motion";

interface InspectorPanelProps {
  spec: MotionSpec;
  onChange: (patch: Partial<MotionSpec>) => void;
}

export function InspectorPanel({ spec, onChange }: InspectorPanelProps) {
  return (
    <aside className="space-y-4 border-t border-slate-800/80 bg-[#0b101d] p-4 lg:border-t-0 lg:border-l">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400" />
          <h2 className="text-xs font-bold tracking-wider text-white uppercase">
            Property Inspector
          </h2>
        </div>
        <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-300">
          {spec.kind}
        </span>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-800/90 bg-[#11192c] p-3.5">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-300">Graphic Type</label>
          <select
            value={spec.kind}
            onChange={(e) => onChange({ kind: e.target.value as GraphicKind })}
            className="w-full rounded-xl border border-slate-700/90 bg-[#080d1a] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
          >
            {Object.entries(GRAPHIC_KIND_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-300">
            {spec.kind === "bullets" ? "Items (comma-separated)" : "Headline Text"}
          </label>
          <input
            type="text"
            value={spec.headline}
            onChange={(e) =>
              onChange({ headline: e.target.value, name: e.target.value || "Untitled" })
            }
            className="w-full rounded-xl border border-slate-700/90 bg-[#080d1a] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-300">Subtext / Tagline</label>
          <input
            type="text"
            value={spec.subtext}
            onChange={(e) => onChange({ subtext: e.target.value })}
            className="w-full rounded-xl border border-slate-700/90 bg-[#080d1a] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-800/90 bg-[#11192c] p-3.5">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">Motion Style</label>
            <select
              value={spec.motionStyle}
              onChange={(e) => onChange({ motionStyle: e.target.value as MotionStyle })}
              className="w-full rounded-xl border border-slate-700/90 bg-[#080d1a] px-2.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
            >
              <option value="rise">Smooth Rise</option>
              <option value="scale">Scale Pop</option>
              <option value="wipe">Directional Wipe</option>
              <option value="none">Static / None</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">Backdrop</label>
            <select
              value={spec.background}
              onChange={(e) => onChange({ background: e.target.value as BackgroundMode })}
              className="w-full rounded-xl border border-slate-700/90 bg-[#080d1a] px-2.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
            >
              <option value="dark">Deep Navy</option>
              <option value="gradient">Cyan / Blue Glow</option>
              <option value="transparent">Transparent</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px]">
            <span className="font-semibold text-slate-300">Duration</span>
            <span className="font-mono text-cyan-300">{spec.durationSec.toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min={1.5}
            max={10}
            step={0.5}
            value={spec.durationSec}
            onChange={(e) => onChange({ durationSec: Number(e.target.value) })}
            className="vidiq-slider w-full"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="font-semibold text-slate-300">Font Size</span>
            <span className="font-mono text-cyan-300">{spec.fontSize}px</span>
          </div>
          <input
            type="range"
            min={28}
            max={120}
            step={2}
            value={spec.fontSize}
            onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
            className="vidiq-slider w-full"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="font-semibold text-slate-300">Opacity</span>
            <span className="font-mono text-slate-200">{Math.round(spec.opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={spec.opacity}
            onChange={(e) => onChange({ opacity: Number(e.target.value) })}
            className="vidiq-slider w-full"
          />
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-800/90 bg-[#11192c] p-3.5">
        <div className="grid grid-cols-2 gap-2.5">
          <label className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#080d1a] px-3 py-2 text-xs text-slate-300">
            <span>Accent</span>
            <input
              type="color"
              value={spec.accentColor}
              onChange={(e) => onChange({ accentColor: e.target.value })}
              className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#080d1a] px-3 py-2 text-xs text-slate-300">
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
            <div className="flex justify-between font-mono text-[10px] text-slate-400">
              <span>Offset X</span>
              <span className="text-cyan-300">{spec.offsetX.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.05}
              value={spec.offsetX}
              onChange={(e) => onChange({ offsetX: Number(e.target.value) })}
              className="vidiq-slider w-full"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[10px] text-slate-400">
              <span>Offset Y</span>
              <span className="text-cyan-300">{spec.offsetY.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.05}
              value={spec.offsetY}
              onChange={(e) => onChange({ offsetY: Number(e.target.value) })}
              className="vidiq-slider w-full"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

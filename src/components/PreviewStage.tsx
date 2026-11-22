"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";
import { Download, Pause, Play, RotateCcw } from "lucide-react";
import { renderGraphicFrame, resolveCanvasDimensions } from "@/lib/renderer";
import {
  AspectPreset,
  CanvasConfig,
  MotionSpec,
  ResolutionPreset,
} from "@/types/motion";

interface PreviewStageProps {
  spec: MotionSpec;
  canvas: CanvasConfig;
  isPlaying: boolean;
  playheadSec: number;
  statusMessage: string;
  onTogglePlay: () => void;
  onRestart: () => void;
  onChangeAspect: (aspect: AspectPreset) => void;
  onChangeResolution: (resolution: ResolutionPreset) => void;
  onChangeCustomSize: (width: number, height: number) => void;
  onChangeTransparentBg: (transparent: boolean) => void;
  onExportPng: (canvasEl: HTMLCanvasElement) => void;
  canvasRefExternal?: React.MutableRefObject<HTMLCanvasElement | null>;
}

export function PreviewStage({
  spec,
  canvas,
  isPlaying,
  playheadSec,
  statusMessage,
  onTogglePlay,
  onRestart,
  onChangeAspect,
  onChangeResolution,
  onChangeCustomSize,
  onChangeTransparentBg,
  onExportPng,
  canvasRefExternal,
}: PreviewStageProps) {
  const internalRef = useRef<HTMLCanvasElement | null>(null);

  useImperativeHandle(canvasRefExternal, () => internalRef.current as HTMLCanvasElement);

  const { width, height } = resolveCanvasDimensions(canvas);

  useEffect(() => {
    const el = internalRef.current;
    if (!el) return;
    el.width = width;
    el.height = height;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    const progress = Math.min(
      1,
      Math.max(0, playheadSec / Math.max(0.5, spec.durationSec))
    );
    renderGraphicFrame(ctx, width, height, spec, canvas, progress);
  }, [spec, canvas, playheadSec, width, height]);

  return (
    <section className="rounded-2xl border border-slate-800/90 bg-[#11192c] p-4 shadow-xl shadow-black/25">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-300">
            {width}×{height} · {canvas.fps}FPS
          </span>
          <span className="rounded-full border border-slate-700/80 bg-[#080d1a] px-2.5 py-0.5 font-mono text-[10px] text-slate-300">
            {statusMessage}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <select
            value={canvas.aspect}
            onChange={(e) => onChangeAspect(e.target.value as AspectPreset)}
            aria-label="Aspect ratio"
            className="rounded-lg border border-slate-700/80 bg-[#080d1a] px-2.5 py-1.5 text-[11px] font-medium text-slate-200 outline-none focus:border-cyan-400"
          >
            <option value="16:9">16:9 Landscape</option>
            <option value="9:16">9:16 Vertical</option>
            <option value="1:1">1:1 Square</option>
          </select>

          <select
            value={canvas.resolution}
            onChange={(e) => onChangeResolution(e.target.value as ResolutionPreset)}
            aria-label="Resolution preset"
            className="rounded-lg border border-slate-700/80 bg-[#080d1a] px-2.5 py-1.5 text-[11px] font-medium text-slate-200 outline-none focus:border-cyan-400"
          >
            <option value="1080p">1080p HD</option>
            <option value="720p">720p HD</option>
            <option value="custom">Custom</option>
          </select>

          {canvas.resolution === "custom" && (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={canvas.customWidth}
                onChange={(e) =>
                  onChangeCustomSize(Number(e.target.value) || 1920, canvas.customHeight)
                }
                aria-label="Custom width"
                className="w-16 rounded-lg border border-slate-700 bg-[#080d1a] px-2 py-1 font-mono text-[11px] text-white"
              />
              <span className="text-xs text-slate-500">×</span>
              <input
                type="number"
                value={canvas.customHeight}
                onChange={(e) =>
                  onChangeCustomSize(canvas.customWidth, Number(e.target.value) || 1080)
                }
                aria-label="Custom height"
                className="w-16 rounded-lg border border-slate-700 bg-[#080d1a] px-2 py-1 font-mono text-[11px] text-white"
              />
            </div>
          )}
        </div>
      </div>

      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-[#070b14]">
        <canvas
          ref={internalRef}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTogglePlay}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/35 bg-cyan-400/15 px-3 py-1.5 text-xs font-bold text-cyan-300 transition hover:bg-cyan-400/25"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-[#080d1a] px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-slate-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restart</span>
          </button>

          <span className="ml-1 font-mono text-xs text-slate-400">
            {playheadSec.toFixed(1)}s / {spec.durationSec.toFixed(1)}s
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-300">
            <input
              type="checkbox"
              checked={canvas.transparentBackground}
              onChange={(e) => onChangeTransparentBg(e.target.checked)}
              className="rounded border-slate-600 bg-[#080d1a] accent-cyan-400"
            />
            <span>Transparent BG</span>
          </label>

          <button
            type="button"
            onClick={() => internalRef.current && onExportPng(internalRef.current)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-[#080d1a] px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-300"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export PNG</span>
          </button>
        </div>
      </div>
    </section>
  );
}

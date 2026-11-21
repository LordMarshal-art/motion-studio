"use client";

import React, { useEffect, useRef } from "react";
import { ImageDown, Pause, Play, RotateCcw } from "lucide-react";
import { renderGraphicFrame, resolveCanvasDimensions } from "@/lib/renderer";
import { AspectPreset, CanvasConfig, MotionSpec, ResolutionPreset } from "@/types/motion";

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
  canvasRefExternal: React.MutableRefObject<HTMLCanvasElement | null>;
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
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const { width, height } = resolveCanvasDimensions(canvas);

  useEffect(() => {
    canvasRefExternal.current = internalCanvasRef.current;
  }, [canvasRefExternal]);

  useEffect(() => {
    const el = internalCanvasRef.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    const progress =
      spec.durationSec > 0 ? (playheadSec % spec.durationSec) / spec.durationSec : 1;
    renderGraphicFrame(ctx, width, height, spec, canvas, progress);
  }, [spec, canvas, playheadSec, width, height]);

  const aspectStyle: React.CSSProperties =
    canvas.aspect === "custom"
      ? { aspectRatio: `${width} / ${height}` }
      : canvas.aspect === "9:16"
        ? { aspectRatio: "9 / 16", maxHeight: "460px" }
        : canvas.aspect === "1:1"
          ? { aspectRatio: "1 / 1", maxHeight: "440px" }
          : { aspectRatio: "16 / 9" };

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTogglePlay}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-3 py-1.5 text-xs font-semibold text-white hover:border-amber-400"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121826] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-sky-400"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restart</span>
          </button>
          <span className="ml-1 font-mono text-xs text-slate-400">
            {playheadSec.toFixed(1)}s / {spec.durationSec.toFixed(1)}s
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (internalCanvasRef.current) onExportPng(internalCanvasRef.current);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:bg-sky-400/20"
        >
          <ImageDown className="h-3.5 w-3.5" />
          <span>Export PNG</span>
        </button>
      </div>

      <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-[#04060A] p-4 sm:min-h-[360px]">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(#38BDF8 0.75px, transparent 0.75px), radial-gradient(#EAB308 0.75px, #04060A 0.75px)",
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0, 12px 12px",
          }}
        />

        <canvas
          ref={internalCanvasRef}
          width={width}
          height={height}
          style={aspectStyle}
          className="relative z-10 max-h-[460px] w-auto max-w-full rounded-lg border border-slate-700/70 shadow-2xl"
        />

        <div className="absolute top-3 left-3 z-20 rounded bg-slate-950/85 px-2 py-1 font-mono text-[10px] tracking-wider text-amber-400 uppercase">
          {width}×{height} · {canvas.fps}FPS
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#0D121E] px-3.5 py-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Aspect ratio"
            value={canvas.aspect}
            onChange={(e) => onChangeAspect(e.target.value as AspectPreset)}
            className="rounded-lg border border-slate-700 bg-[#07090F] px-2.5 py-1.5 text-xs text-slate-200"
          >
            <option value="16:9">16:9 YouTube</option>
            <option value="9:16">9:16 Shorts / Reels</option>
            <option value="1:1">1:1 Square</option>
            <option value="custom">Custom Size</option>
          </select>

          {canvas.aspect !== "custom" && (
            <select
              aria-label="Resolution"
              value={canvas.resolution}
              onChange={(e) => onChangeResolution(e.target.value as ResolutionPreset)}
              className="rounded-lg border border-slate-700 bg-[#07090F] px-2.5 py-1.5 text-xs text-slate-200"
            >
              <option value="720p">720p HD</option>
              <option value="1080p">1080p Full HD</option>
              <option value="4k">4K UHD</option>
            </select>
          )}

          {canvas.aspect === "custom" && (
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={240}
                max={3840}
                value={canvas.customWidth}
                onChange={(e) => onChangeCustomSize(Number(e.target.value), canvas.customHeight)}
                className="w-20 rounded-lg border border-slate-700 bg-[#07090F] px-2 py-1 text-xs text-white"
                aria-label="Custom width"
              />
              <span className="text-slate-500">×</span>
              <input
                type="number"
                min={240}
                max={3840}
                value={canvas.customHeight}
                onChange={(e) => onChangeCustomSize(canvas.customWidth, Number(e.target.value))}
                className="w-20 rounded-lg border border-slate-700 bg-[#07090F] px-2 py-1 text-xs text-white"
                aria-label="Custom height"
              />
            </div>
          )}

          <label className="inline-flex cursor-pointer items-center gap-1.5 text-slate-300">
            <input
              type="checkbox"
              checked={canvas.transparentBackground}
              onChange={(e) => onChangeTransparentBg(e.target.checked)}
              className="rounded border-slate-600 accent-amber-400"
            />
            <span>Alpha / Transparent BG</span>
          </label>
        </div>

        <span className="text-[11px] text-sky-300">{statusMessage}</span>
      </div>
    </section>
  );
}

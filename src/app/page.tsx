"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { InspectorPanel } from "@/components/InspectorPanel";
import { PreviewStage } from "@/components/PreviewStage";
import { PromptGenerator } from "@/components/PromptGenerator";
import { NavTab, StudioSidebar } from "@/components/StudioSidebar";
import { TopBar } from "@/components/TopBar";
import { GraphicTemplate } from "@/data/templates";
import { renderGraphicFrame, resolveCanvasDimensions } from "@/lib/renderer";
import {
  createDefaultCanvas,
  createDefaultSpec,
  loadActiveProject,
  loadSavedGraphics,
  persistSavedGraphics,
  saveActiveProject,
} from "@/lib/storage";
import {
  AspectPreset,
  CanvasConfig,
  MotionSpec,
  ResolutionPreset,
  SavedGraphicItem,
} from "@/types/motion";

export default function MotionStudioPage() {
  const [spec, setSpec] = useState<MotionSpec>(() => createDefaultSpec());
  const [canvas, setCanvas] = useState<CanvasConfig>(() => createDefaultCanvas());
  const [savedItems, setSavedItems] = useState<SavedGraphicItem[]>([]);
  const [activeTab, setActiveTab] = useState<NavTab>("studio");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playheadSec, setPlayheadSec] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("Ready");
  const [hydrated, setHydrated] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const restored = loadActiveProject();
    if (restored) {
      setSpec(restored.spec);
      setCanvas(restored.canvas);
      setStatusMessage("Recovered autosaved project");
    }
    setSavedItems(loadSavedGraphics());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveActiveProject({ spec, canvas });
  }, [spec, canvas, hydrated]);

  useEffect(() => {
    if (!isPlaying) return;

    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const deltaSec = (now - lastTime) / 1000;
      lastTime = now;

      setPlayheadSec((prev) => {
        const duration = Math.max(0.5, spec.durationSec);
        const next = prev + deltaSec;
        return next >= duration ? next % duration : next;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, spec.durationSec]);

  const updateSpec = useCallback((patch: Partial<MotionSpec>) => {
    setSpec((prev) => ({
      ...prev,
      ...patch,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const handleNewProject = useCallback(() => {
    const freshSpec = createDefaultSpec();
    const freshCanvas = createDefaultCanvas();
    setSpec(freshSpec);
    setCanvas(freshCanvas);
    setPlayheadSec(0);
    setIsPlaying(true);
    setStatusMessage("Created new graphic project");
  }, []);

  const handleApplyTemplate = useCallback((tpl: GraphicTemplate) => {
    const nextBackground = tpl.spec.background;
    setSpec({
      ...tpl.spec,
      id: `proj_${Date.now()}`,
      updatedAt: new Date().toISOString(),
    });
    setCanvas((prev) => ({
      ...prev,
      transparentBackground: nextBackground === "transparent",
    }));
    setPlayheadSec(0);
    setIsPlaying(true);
    setActiveTab("studio");
    setStatusMessage(`Applied template: ${tpl.title}`);
  }, []);

  const handleSaveCurrent = useCallback(() => {
    const newItem: SavedGraphicItem = {
      id: `saved_${Date.now()}`,
      spec: { ...spec },
      canvas: { ...canvas },
      savedAt: new Date().toISOString(),
    };
    const nextList = [newItem, ...savedItems].slice(0, 24);
    setSavedItems(nextList);
    persistSavedGraphics(nextList);
    setStatusMessage("Saved snapshot to local browser library");
  }, [spec, canvas, savedItems]);

  const handleLoadSaved = useCallback((item: SavedGraphicItem) => {
    setSpec({ ...item.spec, updatedAt: new Date().toISOString() });
    setCanvas({ ...item.canvas });
    setPlayheadSec(0);
    setIsPlaying(true);
    setActiveTab("studio");
    setStatusMessage(`Loaded "${item.spec.headline || "Saved Graphic"}"`);
  }, []);

  const handleDeleteSaved = useCallback(
    (id: string) => {
      const nextList = savedItems.filter((item) => item.id !== id);
      setSavedItems(nextList);
      persistSavedGraphics(nextList);
      setStatusMessage("Removed graphic from local library");
    },
    [savedItems]
  );

  const handleGenerateFromPrompt = useCallback(async (prompt: string) => {
    setIsGenerating(true);
    setStatusMessage("Generating motion graphic spec...");

    try {
      const res = await fetch("/api/generate-graphic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage(data?.error || "Generation failed.");
        return;
      }

      setSpec((prev) => ({
        ...prev,
        name: data.headline || prev.name,
        kind: data.kind ?? prev.kind,
        headline: data.headline ?? prev.headline,
        subtext: data.subtext ?? prev.subtext,
        accentColor: data.accentColor ?? prev.accentColor,
        textColor: data.textColor ?? prev.textColor,
        background: data.background ?? prev.background,
        fontSize: data.fontSize ?? prev.fontSize,
        durationSec: data.durationSec ?? prev.durationSec,
        motionStyle: data.motionStyle ?? prev.motionStyle,
        updatedAt: new Date().toISOString(),
      }));

      if (data.background === "transparent") {
        setCanvas((prev) => ({ ...prev, transparentBackground: true }));
      }

      setPlayheadSec(0);
      setIsPlaying(true);
      setStatusMessage(
        data.source === "ai-provider"
          ? "Generated via AI provider"
          : "Generated via structured prompt parser"
      );
    } catch {
      setStatusMessage("Network error calling /api/generate-graphic");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleExportPng = useCallback(
    (canvasEl: HTMLCanvasElement) => {
      try {
        const dataUrl = canvasEl.toDataURL("image/png");
        const link = document.createElement("a");
        const safeName = (spec.headline || "motion-graphic")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        link.download = `${safeName || "motion-graphic"}.png`;
        link.href = dataUrl;
        link.click();
        setStatusMessage("Exported PNG frame");
      } catch {
        setStatusMessage("Unable to export PNG in this browser context");
      }
    },
    [spec.headline]
  );

  const handleExportWebM = useCallback(async () => {
    const sourceCanvas = canvasRef.current;
    if (!sourceCanvas || isExporting) return;

    if (
      typeof MediaRecorder === "undefined" ||
      typeof sourceCanvas.captureStream !== "function"
    ) {
      setStatusMessage(
        "WebM recording is not supported in this browser. Use Export PNG instead."
      );
      return;
    }

    const mimeCandidates = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
    ];
    const supportedMime =
      typeof MediaRecorder.isTypeSupported === "function"
        ? mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m))
        : "video/webm";

    if (!supportedMime) {
      setStatusMessage("No supported WebM codec found in this browser.");
      return;
    }

    setIsExporting(true);
    setIsPlaying(false);
    setStatusMessage("Recording WebM animation...");

    try {
      const { width, height } = resolveCanvasDimensions(canvas);
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = width;
      exportCanvas.height = height;
      const exportCtx = exportCanvas.getContext("2d");
      if (!exportCtx) {
        setStatusMessage("Could not initialize export canvas.");
        return;
      }

      const stream = exportCanvas.captureStream(canvas.fps);
      const recorder = new MediaRecorder(stream, { mimeType: supportedMime });
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      const recordingDone = new Promise<Blob>((resolve, reject) => {
        recorder.onstop = () => {
          resolve(new Blob(chunks, { type: supportedMime }));
        };
        recorder.onerror = () => {
          reject(new Error("MediaRecorder failed during export."));
        };
      });

      const durationMs = Math.max(1000, spec.durationSec * 1000);
      const startTime = performance.now();

      recorder.start();

      await new Promise<void>((resolve) => {
        const renderStep = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / durationMs);
          setPlayheadSec(Math.min(spec.durationSec, elapsed / 1000));
          renderGraphicFrame(exportCtx, width, height, spec, canvas, progress);

          if (elapsed < durationMs) {
            requestAnimationFrame(renderStep);
          } else {
            resolve();
          }
        };
        requestAnimationFrame(renderStep);
      });

      recorder.stop();
      const blob = await recordingDone;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeName = (spec.headline || "motion-graphic")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      link.download = `${safeName || "motion-graphic"}.webm`;
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);

      setStatusMessage("Exported animated WebM video");
    } catch {
      setStatusMessage("WebM export failed on this device.");
    } finally {
      setIsExporting(false);
      setPlayheadSec(0);
      setIsPlaying(true);
    }
  }, [canvas, isExporting, spec]);

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100">
      <TopBar
        projectName={spec.headline || "Untitled Graphic"}
        isExporting={isExporting}
        onNewProject={handleNewProject}
        onExportVideo={handleExportWebM}
      />

      <main className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_310px]">
        <StudioSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onApplyTemplate={handleApplyTemplate}
          onSaveCurrent={handleSaveCurrent}
          savedItems={savedItems}
          onLoadSaved={handleLoadSaved}
          onDeleteSaved={handleDeleteSaved}
        />

        <div className="p-4 md:p-6">
          <PreviewStage
            spec={spec}
            canvas={canvas}
            isPlaying={isPlaying}
            playheadSec={playheadSec}
            statusMessage={statusMessage}
            onTogglePlay={() => setIsPlaying((p) => !p)}
            onRestart={() => {
              setPlayheadSec(0);
              setIsPlaying(true);
            }}
            onChangeAspect={(aspect: AspectPreset) =>
              setCanvas((prev) => ({ ...prev, aspect }))
            }
            onChangeResolution={(resolution: ResolutionPreset) =>
              setCanvas((prev) => ({ ...prev, resolution }))
            }
            onChangeCustomSize={(customWidth: number, customHeight: number) =>
              setCanvas((prev) => ({ ...prev, customWidth, customHeight }))
            }
            onChangeTransparentBg={(transparentBackground: boolean) =>
              setCanvas((prev) => ({ ...prev, transparentBackground }))
            }
            onExportPng={handleExportPng}
            canvasRefExternal={canvasRef}
          />

          <PromptGenerator
            isGenerating={isGenerating}
            onGenerate={handleGenerateFromPrompt}
          />
        </div>

        <InspectorPanel spec={spec} onChange={updateSpec} />
      </main>
    </div>
  );
}

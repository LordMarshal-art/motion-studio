import { CanvasConfig, MotionSpec, SavedGraphicItem } from "@/types/motion";

const ACTIVE_PROJECT_KEY = "lmms_active_project_v1";
const SAVED_GRAPHICS_KEY = "lmms_saved_graphics_v1";

export interface PersistedProject {
  spec: MotionSpec;
  canvas: CanvasConfig;
}

export function createDefaultSpec(): MotionSpec {
  return {
    id: `proj_${Date.now()}`,
    name: "THE FUTURE IS NOW",
    kind: "title",
    headline: "THE FUTURE IS NOW",
    subtext: "A NEW ERA BEGINS",
    accentColor: "#EAB308",
    textColor: "#F8FAFC",
    background: "dark",
    fontSize: 78,
    durationSec: 4,
    motionStyle: "rise",
    opacity: 1,
    offsetX: 0,
    offsetY: 0,
    updatedAt: new Date().toISOString(),
  };
}

export function createDefaultCanvas(): CanvasConfig {
  return {
    aspect: "16:9",
    resolution: "1080p",
    customWidth: 1920,
    customHeight: 1080,
    fps: 30,
    transparentBackground: false,
  };
}

export function loadActiveProject(): PersistedProject | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ACTIVE_PROJECT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedProject;
    if (!parsed?.spec || !parsed?.canvas) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveActiveProject(project: PersistedProject): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ACTIVE_PROJECT_KEY, JSON.stringify(project));
  } catch {
    // Ignore storage quota or restricted-mode errors
  }
}

export function loadSavedGraphics(): SavedGraphicItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_GRAPHICS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistSavedGraphics(items: SavedGraphicItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SAVED_GRAPHICS_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota or restricted-mode errors
  }
}

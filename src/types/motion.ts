export type GraphicKind =
  | "title"
  | "lower_third"
  | "stat"
  | "subscribe"
  | "quote"
  | "bullets"
  | "bar_chart"
  | "callout";

export type MotionStyle = "rise" | "scale" | "wipe" | "none";

export type BackgroundMode = "transparent" | "dark" | "gradient";

export type AspectPreset = "16:9" | "9:16" | "1:1" | "custom";

export type ResolutionPreset = "720p" | "1080p" | "4k";

export interface MotionSpec {
  id: string;
  name: string;
  kind: GraphicKind;
  headline: string;
  subtext: string;
  accentColor: string;
  textColor: string;
  background: BackgroundMode;
  fontSize: number;
  durationSec: number;
  motionStyle: MotionStyle;
  opacity: number;
  offsetX: number;
  offsetY: number;
  updatedAt: string;
}

export interface CanvasConfig {
  aspect: AspectPreset;
  resolution: ResolutionPreset;
  customWidth: number;
  customHeight: number;
  fps: 24 | 30 | 60;
  transparentBackground: boolean;
}

export interface SavedGraphicItem {
  id: string;
  spec: MotionSpec;
  canvas: CanvasConfig;
  savedAt: string;
}

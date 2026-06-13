// ─── Style Preset ────────────────────────────────────────────────
export type StylePreset =
  | "Apple"
  | "Stripe"
  | "Linear"
  | "Notion"
  | "ModernSaaS"
  | "Enterprise"
  | "Futuristic"
  | "Neon"
  | "Minimal"
  | "Warm"
  | "Ocean"
  | "Sunset"
  | "Midnight";

// ─── Scene Types ─────────────────────────────────────────────────
export type SceneType =
  | "TitleReveal"
  | "KineticText"
  | "DashboardShowcase"
  | "CTASection"
  | "TestimonialCards"
  | "PricingTable"
  | "FeatureGrid"
  | "StatsCounter"
  | "LogoShowcase"
  | "SplitScreen"
  | "ChartShowcase"
  | "ComparisonScene"
  | "InteractiveCodeMockup"
  | "PromptCard"
  | "OverlayHeadline"
  | "GalleryGrid"
  | "WorkspaceShowcase"
  | "ContentWall";

// ─── Transition Types ────────────────────────────────────────────
export type TransitionType =
  | "fade"
  | "slide-up"
  | "slide-left"
  | "zoom"
  | "none";

// ─── Overlay Types ───────────────────────────────────────────────
export type OverlayType = "text" | "cursor" | "badge" | "arrow" | "zoom-focus";

// ─── Overlay Animation Types ─────────────────────────────────────
export type OverlayAnimationType = "pop" | "fade" | "draw-path" | "float";

// ─── Theme Colors ────────────────────────────────────────────────
export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  mutedText: string;
  accent: string;
  border: string;
  charts: string[];
}

// ─── Typography ──────────────────────────────────────────────────
export interface Typography {
  headingFont: string;
  bodyFont: string;
  monoFont: string;
}

// ─── Theme ───────────────────────────────────────────────────────
export interface Theme {
  stylePreset: StylePreset;
  colors: ThemeColors;
  typography: Typography;
  glassmorphism: boolean;
  borderRadius: number;
}

// ─── Transition In ───────────────────────────────────────────────
export interface TransitionIn {
  type: TransitionType;
  durationFrames: number;
}

// ─── Overlay Position ────────────────────────────────────────────
export interface OverlayPosition {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

// ─── Overlay Animation ───────────────────────────────────────────
export interface OverlayAnimation {
  type: OverlayAnimationType;
  durationFrames: number;
}

// ─── Overlay Layer ───────────────────────────────────────────────
export interface OverlayLayer {
  id: string;
  type: OverlayType;
  startTimeFrame: number;
  durationFrames: number;
  position: OverlayPosition;
  animation: OverlayAnimation;
  props: Record<string, unknown>;
}

// ─── Scene ───────────────────────────────────────────────────────
export interface Scene {
  id: string;
  type: SceneType;
  durationFrames: number;
  transitionIn?: TransitionIn;
  props: Record<string, unknown>;
  overlays?: OverlayLayer[];
}

// ─── Audio Config ────────────────────────────────────────────────
export interface AudioConfig {
  musicUrl?: string;
  musicVolume?: number;
}

// ─── Video Metadata ──────────────────────────────────────────────
export interface VideoMetadata {
  title: string;
  width: number;
  height: number;
  fps: number;
  totalDurationSec: number;
}

// ─── Video Project (Top-Level) ───────────────────────────────────
export interface VideoProject {
  version: string;
  metadata: VideoMetadata;
  theme: Theme;
  scenes: Scene[];
  audio?: AudioConfig;
}

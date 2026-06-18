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
  | "Midnight"
  | "DeepBlue";

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
  | "ContentWall"
  | "ProductReveal"
  | "ToolbarMockup"
  | "RotatedWordStack"
  | "TiltedCardCarousel"
  | "CircleMotifTransition"
  | "LogoRevealOutro"
  | "FreeformAnimation"
  | "PathDrawScene"
  | "IconMorph"
  | "ProcessFlow"
  | "LottieScene"
  | "WhiteboardReveal"
  | "Product3DReveal"
  | "ParticleField"
  | "GlobeAnimation"
  | "LogoExtrude3D"
  | "ShaderBackground3D"
  | "GlitchTextReveal"
  | "ShinyTextSweep"
  | "DecryptText"
  | "LogoMarquee"
  | "TrueFocus"
  | "VariableProximity"
  | "ClickSpark"
  | "PixelTransition"
  // Dark Neon Pack
  | "NeonTextReveal"
  | "OrbitalCircles"
  | "NeonWaveLines"
  | "AppLogoReveal"
  | "CleanCardPromo"
  | "EyeOutlineScene"
  // App Demo Pack
  | "AppDemoHero"
  | "NotificationStack"
  | "VoiceInputBar"
  | "AppIconOrbit"
  | "ScreenRecordingMockup"
  | "FeatureTextPanel"
  | "AppDemoOutro"
  // Typography Pack
  | "SplitTextReveal"
  | "WordCascade"
  | "LetterMorph"
  | "GradientHeadline"
  | "KineticTypography"
  | "MaskedTextReveal"
  | "TextExplosion"
  | "TypewriterPro"
  // UI Pack (framing + themed atoms)
  | "BrowserWindow"
  | "NotificationToast"
  | "CommandPalette"
  | "SearchBar"
  | "ChatPanel";

// ─── Modifier Types ──────────────────────────────────────────────
// Modifiers wrap a scene (and its overlays) to apply camera moves,
// lighting, depth, and post effects. Unlike scenes they never render
// standalone — they transform whatever they contain.
export type ModifierType =
  // Camera
  | "CameraPushIn"
  | "CameraPullOut"
  | "CameraDolly"
  | "CameraPan"
  | "CameraTilt"
  | "CameraOrbit"
  | "CameraRackFocus"
  | "CameraParallax"
  | "CameraWhipPan"
  | "CameraFollowPath"
  // Lighting
  | "LightSweep"
  | "VolumetricLight"
  | "MovingGlow"
  | "LensBloom"
  | "EdgeLight"
  | "SpotlightReveal"
  | "LightLeakOverlay"
  | "GradientWash"
  // Depth
  | "MultiLayerParallax"
  | "DepthBlur"
  | "ForegroundParticles"
  | "FloatingElements"
  | "GlassDepthLayers"
  | "PerspectiveWarp"
  // Motion design
  | "GlowFrame"
  | "NeonLine"
  | "EnergyWave"
  | "LightRibbon"
  | "PulseRing"
  | "OrbitingDots"
  | "GridPulse"
  | "ScanLine";

// ─── Transition Types ────────────────────────────────────────────
export type TransitionType =
  // Legacy style-based (animation/transitions.ts)
  | "fade"
  | "slide-up"
  | "slide-left"
  | "zoom"
  | "none"
  // Rich component-based entrance transitions (transitions/)
  | "morph"
  | "scale"
  | "slide"
  | "blur"
  | "grid"
  | "portal"
  | "card-flip"
  | "page-turn";

// ─── Overlay Types ───────────────────────────────────────────────
export type OverlayType =
  | "text"
  | "cursor"
  | "badge"
  | "arrow"
  | "zoom-focus"
  | "electric-border"
  // Cursor pack
  | "human-cursor"
  | "ai-command-cursor"
  | "multi-cursor"
  | "drag-and-drop"
  | "highlight-cursor"
  | "click-ripple";

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
  /** Type-specific config for rich transitions (direction, colors, grid size…). */
  params?: Record<string, unknown>;
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

// ─── Animation & Layout ──────────────────────────────────────────
export interface EasingConfig {
  type: "cubic-bezier" | "linear" | "ease-in" | "ease-out" | "ease-in-out";
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}

export interface Keyframe {
  frame: number;
  value: number;
  easing?: EasingConfig;
}

export interface StaggerGroup {
  children: string[];
  offsetFrames: number;
  direction?: "forward" | "backward" | "center";
}

export interface Camera {
  type: "perspective" | "orthographic";
  fov?: number;
  position?: { x: number; y: number; z: number };
}

export interface TextLayer {
  tracking?: number;
  maskReveal?: boolean;
  variableWeight?: boolean;
}

// ─── Scene Modifier ──────────────────────────────────────────────
export interface SceneModifier {
  type: ModifierType;
  /** Scene-local frame the modifier begins on (default 0). */
  startFrame?: number;
  /** Frames the modifier animates over (default: to end of scene). */
  durationFrames?: number;
  /** Easing curve for the modifier's progress (default Apple decelerate). */
  easing?: EasingConfig;
  /** Modifier-specific parameters (scales, offsets, blur, path, …). */
  params?: Record<string, unknown>;
}

// ─── Scene ───────────────────────────────────────────────────────
export interface Scene {
  id: string;
  type: SceneType;
  durationFrames: number;
  transitionIn?: TransitionIn;
  props: Record<string, unknown>;
  overlays?: OverlayLayer[];
  modifiers?: SceneModifier[];
  keyframes?: Keyframe[];
  staggerGroup?: StaggerGroup;
  camera?: Camera;
  textLayer?: TextLayer;
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

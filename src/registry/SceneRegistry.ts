/**
 * SceneRegistry — Maps scene type string identifiers to their
 * corresponding React component implementations.
 *
 * Used by the VideoProject composition to dynamically resolve
 * scene types from a Scene Graph JSON configuration.
 */

// ── Original Scenes ──────────────────────────────────────────────
import { TitleReveal } from "../scenes/TitleReveal";
import { KineticText } from "../scenes/KineticText";
import { DashboardShowcase } from "../scenes/DashboardShowcase";
import { CTASection } from "../scenes/CTASection";
import { TestimonialCards } from "../scenes/TestimonialCards";
import { PricingTable } from "../scenes/PricingTable";
import { FeatureGrid } from "../scenes/FeatureGrid";
import { StatsCounter } from "../scenes/StatsCounter";
import { LogoShowcase } from "../scenes/LogoShowcase";
import { SplitScreen } from "../scenes/SplitScreen";
import { ChartShowcase } from "../scenes/ChartShowcase";
import { ComparisonScene } from "../scenes/ComparisonScene";
import { InteractiveCodeMockup } from "../scenes/InteractiveCodeMockup";

// ── Gemini Flow Scenes ───────────────────────────────────────────
import { PromptCard } from "../scenes/PromptCard";
import { OverlayHeadline } from "../scenes/OverlayHeadline";
import { GalleryGrid } from "../scenes/GalleryGrid";
import { WorkspaceShowcase } from "../scenes/WorkspaceShowcase";
import { ContentWall } from "../scenes/ContentWall";
import { ProductReveal } from "../scenes/ProductReveal";

// ── Design Studio Scenes ─────────────────────────────────────────
import { ToolbarMockup } from "../scenes/ToolbarMockup";
import { RotatedWordStack } from "../scenes/RotatedWordStack";
import { TiltedCardCarousel } from "../scenes/TiltedCardCarousel";
import { CircleMotifTransition } from "../scenes/CircleMotifTransition";
import { LogoRevealOutro } from "../scenes/LogoRevealOutro";

/**
 * Master registry of all available scene components.
 * Keys must match the `type` field in Scene Graph JSON.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SceneRegistry: Record<string, React.FC<any>> = {
  // Phase 1 scenes
  TitleReveal,
  KineticText,
  DashboardShowcase,
  CTASection,
  TestimonialCards,
  PricingTable,
  FeatureGrid,
  StatsCounter,
  LogoShowcase,
  SplitScreen,
  ChartShowcase,
  ComparisonScene,
  InteractiveCodeMockup,

  // Phase 3 — Gemini Flow scenes
  PromptCard,
  OverlayHeadline,
  GalleryGrid,
  WorkspaceShowcase,
  ContentWall,
  ProductReveal,

  // Phase 4 — Design Studio scenes
  ToolbarMockup,
  RotatedWordStack,
  TiltedCardCarousel,
  CircleMotifTransition,
  LogoRevealOutro,
};

export type SceneRegistryKey = keyof typeof SceneRegistry;

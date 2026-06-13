import "./index.css";
import { Composition } from "remotion";
import { VideoProject } from "./compositions/VideoProject";
import type { VideoProject as VideoProjectType } from "./types/schema";
import { getPreset } from "./theme/presets";

// ── Demo compositions ────────────────────────────────────────────
import { PromptCardDemo } from "./demo/PromptCardDemo";
import { OverlayHeadlineDemo } from "./demo/OverlayHeadlineDemo";
import { GalleryGridDemo } from "./demo/GalleryGridDemo";
import { WorkspaceShowcaseDemo } from "./demo/WorkspaceShowcaseDemo";
import { ContentWallDemo } from "./demo/ContentWallDemo";
import { BentoGridDemo } from "./demo/BentoGridDemo";
import { AnimatedCursorDemo } from "./demo/AnimatedCursorDemo";
import { ProductRevealDemo } from "./demo/ProductRevealDemo";

// ── Scene graph JSON imports ─────────────────────────────────────
import designStudioReel from "../scene-graphs/example-design-studio-reel.json";

// ── Default props for the Remotion Studio preview ────────────────
const defaultTheme = getPreset("ModernSaaS");

const defaultProject: VideoProjectType = {
  version: "1.0.0",
  metadata: {
    title: "SaaS Product Launch",
    width: 1920,
    height: 1080,
    fps: 30,
    totalDurationSec: 24,
  },
  theme: defaultTheme,
  scenes: [
    {
      id: "intro",
      type: "TitleReveal",
      durationFrames: 120,
      transitionIn: { type: "fade", durationFrames: 15 },
      props: {
        tagline: "Introducing",
        headline: "The Future of SaaS Analytics",
        subtitle: "Beautiful dashboards. Real-time insights. Zero complexity.",
      },
    },
    {
      id: "features",
      type: "KineticText",
      durationFrames: 120,
      transitionIn: { type: "slide-up", durationFrames: 15 },
      props: {
        lines: [
          { text: "Real-Time Analytics" },
          { text: "powered by AI" },
          { text: "Beautiful Dashboards" },
          { text: "your team will love" },
        ],
      },
    },
    {
      id: "dashboard",
      type: "DashboardShowcase",
      durationFrames: 120,
      transitionIn: { type: "zoom", durationFrames: 20 },
      props: {
        url: "https://analytics.example.com/dashboard",
        cursorKeyframes: [
          { frame: 20, x: 200, y: 200 },
          { frame: 50, x: 450, y: 150, click: true },
          { frame: 80, x: 600, y: 300, click: true },
        ],
        highlights: [
          { text: "📊 Live Metrics", x: -120, y: 80, showAtFrame: 35 },
          { text: "🚀 +42% Growth", x: 700, y: 200, showAtFrame: 65 },
        ],
      },
    },
    {
      id: "line-chart",
      type: "ChartShowcase",
      durationFrames: 120,
      transitionIn: { type: "slide-left", durationFrames: 15 },
      props: {
        chartType: "line",
        heading: "Performance Growth",
        subtitle: "Requests served per second scaling globally.",
        data: [
          { "label": "Jan", "value": 120 },
          { "label": "Feb", "value": 210 },
          { "label": "Mar", "value": 450 },
          { "label": "Apr", "value": 890 },
          { "label": "May", "value": 1500 }
        ]
      }
    },
    {
      id: "bar-chart",
      type: "ChartShowcase",
      durationFrames: 120,
      transitionIn: { type: "zoom", durationFrames: 15 },
      props: {
        chartType: "bar",
        heading: "User Demographics",
        subtitle: "Acquisition sources for modern analytics accounts.",
        data: [
          { "label": "Organic", "value": 750 },
          { "label": "Social", "value": 450 },
          { "label": "Direct", "value": 300 },
          { "label": "Referrals", "value": 180 }
        ]
      }
    },
    {
      id: "cta",
      type: "CTASection",
      durationFrames: 120,
      transitionIn: { type: "slide-up", durationFrames: 15 },
      props: {
        headline: "Ready to Transform Your Data?",
        description: "Join 10,000+ teams already using our platform.",
        buttonText: "Start Free Trial",
        pricingText: "$0/mo to start",
        features: [
          "Unlimited dashboards",
          "Real-time collaboration",
          "AI-powered insights",
          "Enterprise-grade security",
        ],
      },
    },
  ],
};

// ── Design Studio Reel project ───────────────────────────────────
const designStudioProject = designStudioReel as unknown as VideoProjectType;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main VideoProject composition */}
      <Composition
        id="VideoProject"
        component={VideoProject}
        durationInFrames={
          defaultProject.metadata.fps * defaultProject.metadata.totalDurationSec
        }
        fps={defaultProject.metadata.fps}
        width={defaultProject.metadata.width}
        height={defaultProject.metadata.height}
        defaultProps={{ project: defaultProject }}
      />

      {/* ── Design Studio Reel ──────────────────────────────────── */}
      <Composition
        id="Demo-DesignStudioReel"
        component={VideoProject}
        durationInFrames={750}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ project: designStudioProject }}
      />

      {/* ── Gemini Flow Demo Compositions ───────────────────────── */}
      <Composition
        id="Demo-PromptCard"
        component={PromptCardDemo}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo-OverlayHeadline"
        component={OverlayHeadlineDemo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo-GalleryGrid"
        component={GalleryGridDemo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo-WorkspaceShowcase"
        component={WorkspaceShowcaseDemo}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo-ContentWall"
        component={ContentWallDemo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo-BentoGrid"
        component={BentoGridDemo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo-AnimatedCursor"
        component={AnimatedCursorDemo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo-ProductReveal"
        component={ProductRevealDemo}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

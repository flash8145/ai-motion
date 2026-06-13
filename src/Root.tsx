import "./index.css";
import { Composition } from "remotion";
import { VideoProject } from "./compositions/VideoProject";
import type { VideoProject as VideoProjectType } from "./types/schema";
import { getPreset } from "./theme/presets";

// ── Default props for the Remotion Studio preview ────────────────
const defaultTheme = getPreset("ModernSaaS");

const defaultProject: VideoProjectType = {
  version: "1.0.0",
  metadata: {
    title: "SaaS Product Launch",
    width: 1920,
    height: 1080,
    fps: 30,
    totalDurationSec: 16,
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

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
    </>
  );
};

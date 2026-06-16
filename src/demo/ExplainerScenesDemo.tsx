import React from "react";
import { AbsoluteFill } from "remotion";
import { ThemeProvider } from "../theme/ThemeProvider";
import { getPreset } from "../theme/presets";
import { FreeformAnimation } from "../scenes/FreeformAnimation";
import { PathDrawScene } from "../scenes/PathDrawScene";
import { IconMorph } from "../scenes/IconMorph";
import { ProcessFlow } from "../scenes/ProcessFlow";
import { LottieScene } from "../scenes/LottieScene";
import { WhiteboardReveal } from "../scenes/WhiteboardReveal";

const theme = getPreset("Apple");

// Simple checkmark / gear / bolt icon path set (viewBox 0 0 24 24)
const ICON_GEAR =
  "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm9.4 4a7.4 7.4 0 0 0-.15-1.5l2.1-1.6-2-3.5-2.4 1a7.6 7.6 0 0 0-2.6-1.5L16 2h-4l-.35 2.4a7.6 7.6 0 0 0-2.6 1.5l-2.4-1-2 3.5 2.1 1.6A7.4 7.4 0 0 0 6.6 12c0 .5.05 1 .15 1.5l-2.1 1.6 2 3.5 2.4-1c.75.65 1.63 1.16 2.6 1.5L12 22h4l.35-2.4c.97-.34 1.85-.85 2.6-1.5l2.4 1 2-3.5-2.1-1.6c.1-.5.15-1 .15-1.5z";
const ICON_CHECK = "M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z";
const ICON_BOLT = "M13 2 3 14h7l-1 8 11-12h-7z";

export const FreeformAnimationDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill>
      <FreeformAnimation
        background="theme"
        elements={[
          {
            id: "headline",
            kind: "text",
            content: "Built for speed.",
            initial: { x: 960, y: 400, opacity: 0 },
            style: { fontSize: 72, fontWeight: 800, color: "#FFFFFF" },
            tracks: [
              {
                property: "opacity",
                keyframes: [
                  { frame: 0, value: 0 },
                  { frame: 20, value: 1, easing: { type: "cubic-bezier", x1: 0.16, y1: 1, x2: 0.3, y2: 1 } },
                ],
              },
              {
                property: "y",
                keyframes: [
                  { frame: 0, value: 460 },
                  { frame: 20, value: 400, easing: { type: "cubic-bezier", x1: 0.16, y1: 1, x2: 0.3, y2: 1 } },
                ],
              },
            ],
          },
          {
            id: "badge",
            kind: "circle",
            initial: { x: 960, y: 600, width: 16, height: 16, scale: 0 },
            style: { fill: "#0A84FF" },
            tracks: [
              {
                property: "scale",
                keyframes: [
                  { frame: 25, value: 0 },
                  { frame: 45, value: 1, easing: { type: "cubic-bezier", x1: 0.34, y1: 1.56, x2: 0.64, y2: 1 } },
                ],
              },
            ],
          },
        ]}
      />
    </AbsoluteFill>
  </ThemeProvider>
);

export const PathDrawSceneDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill>
      <PathDrawScene
        background="theme"
        heading="Our Journey"
        headingStart={0}
        paths={[
          {
            d: "M 200 700 C 500 700 600 400 960 400 S 1400 700 1720 700",
            startFrame: 20,
            color: "#0A84FF",
            strokeWidth: 4,
            drawDurationFrames: 60,
          },
        ]}
        labels={[
          { text: "2021 — Founded", x: 200, y: 760, showAtFrame: 25 },
          { text: "2023 — Series A", x: 960, y: 340, showAtFrame: 55 },
          { text: "2026 — Global", x: 1720, y: 760, showAtFrame: 80 },
        ]}
      />
    </AbsoluteFill>
  </ThemeProvider>
);

export const IconMorphDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill>
      <IconMorph
        icons={[ICON_GEAR, ICON_BOLT, ICON_CHECK]}
        labels={["Configure", "Automate", "Done"]}
        startFrame={0}
        holdDurationFrames={40}
        morphDurationFrames={20}
      />
    </AbsoluteFill>
  </ThemeProvider>
);

export const ProcessFlowDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill>
      <ProcessFlow
        heading="How it works"
        steps={[
          { emoji: "📝", title: "Describe", description: "Write a prompt" },
          { emoji: "🤖", title: "Generate", description: "AI plans the scenes" },
          { emoji: "🎬", title: "Render", description: "Export your video" },
        ]}
      />
    </AbsoluteFill>
  </ThemeProvider>
);

export const WhiteboardRevealDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill>
      <WhiteboardReveal
        sketchPath="M 660 500 a 300 120 0 1 0 600 0 a 300 120 0 1 0 -600 0"
        icon={ICON_BOLT}
        title="Quantum Computing"
        description="Bits that can be 0 and 1 at the same time."
        drawStartFrame={5}
        drawDurationFrames={50}
      />
    </AbsoluteFill>
  </ThemeProvider>
);

export const LottieSceneDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill>
      <LottieScene
        background="theme"
        src="https://assets4.lottiefiles.com/packages/lf20_zyquagfl.json"
        loop
      />
    </AbsoluteFill>
  </ThemeProvider>
);

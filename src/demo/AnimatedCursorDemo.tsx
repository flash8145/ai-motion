import React from "react";
import { AbsoluteFill } from "remotion";
import { ThemeProvider } from "../theme/ThemeProvider";
import { GEMINI_FLOW_THEME } from "../theme/GeminiFlowTheme";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { AnimatedCursor } from "../components/AnimatedCursor";

export const AnimatedCursorDemo: React.FC = () => (
  <ThemeProvider theme={GEMINI_FLOW_THEME}>
    <AbsoluteFill>
      <GradientBackground opacity={0.4} />
      <NoiseTexture />

      {/* Target dots to show cursor destinations */}
      {[
        { x: 300, y: 200 },
        { x: 800, y: 350 },
        { x: 500, y: 600 },
        { x: 1200, y: 400 },
        { x: 960, y: 700 },
      ].map((pt, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: pt.x - 6,
            top: pt.y - 6,
            width: 12,
            height: 12,
            borderRadius: "50%",
            border: "2px solid rgba(124, 58, 237, 0.4)",
            background: "rgba(124, 58, 237, 0.1)",
          }}
        />
      ))}

      <AnimatedCursor
        points={[
          { x: 300, y: 200, frame: 0 },
          { x: 800, y: 350, frame: 30, click: true },
          { x: 500, y: 600, frame: 60 },
          { x: 1200, y: 400, frame: 90, click: true },
          { x: 960, y: 700, frame: 120 },
        ]}
        size={24}
        color="#FFFFFF"
        showTrail={true}
      />
    </AbsoluteFill>
  </ThemeProvider>
);

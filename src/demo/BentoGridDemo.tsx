import React from "react";
import { AbsoluteFill } from "remotion";
import { ThemeProvider } from "../theme/ThemeProvider";
import { GEMINI_FLOW_THEME } from "../theme/GeminiFlowTheme";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { BentoGrid } from "../components/BentoGrid";

export const BentoGridDemo: React.FC = () => (
  <ThemeProvider theme={GEMINI_FLOW_THEME}>
    <AbsoluteFill>
      <GradientBackground opacity={0.4} />
      <NoiseTexture />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <BentoGrid
          items={[
            { icon: "🧠", title: "Neural Engine", description: "Process billions of parameters in real-time", colSpan: 2 },
            { icon: "⚡", title: "Lightning Fast", description: "Sub-millisecond inference latency" },
            { icon: "🔒", title: "Enterprise Security", description: "SOC2 & HIPAA compliant infrastructure" },
            { icon: "🌐", title: "Global Scale", description: "Distributed across 40+ regions worldwide", colSpan: 2 },
            { icon: "📊", title: "Analytics", description: "Deep observability and monitoring" },
          ]}
          columns={3}
          gap={16}
          startFrame={10}
          itemStagger={5}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  </ThemeProvider>
);

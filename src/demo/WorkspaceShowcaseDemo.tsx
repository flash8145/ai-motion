import React from "react";
import { AbsoluteFill } from "remotion";
import { ThemeProvider } from "../theme/ThemeProvider";
import { GEMINI_FLOW_THEME } from "../theme/GeminiFlowTheme";
import { WorkspaceShowcase } from "../scenes/WorkspaceShowcase";

export const WorkspaceShowcaseDemo: React.FC = () => (
  <ThemeProvider theme={GEMINI_FLOW_THEME}>
    <AbsoluteFill>
      <WorkspaceShowcase
        title="AI-Powered Analytics Dashboard"
        subtitle="Real-time insights at your fingertips"
        zoomAmount={0.08}
        panAmount={20}
        startFrame={5}
      />
    </AbsoluteFill>
  </ThemeProvider>
);

import React from "react";
import { AbsoluteFill } from "remotion";
import { ThemeProvider } from "../theme/ThemeProvider";
import { GEMINI_FLOW_THEME } from "../theme/GeminiFlowTheme";
import { OverlayHeadline } from "../scenes/OverlayHeadline";

export const OverlayHeadlineDemo: React.FC = () => (
  <ThemeProvider theme={GEMINI_FLOW_THEME}>
    <AbsoluteFill>
      <OverlayHeadline
        title="The Future of AI is Here"
        subtitle="Powered by next-generation multimodal intelligence"
        align="center"
        titleStartFrame={10}
        subtitleStartFrame={50}
      />
    </AbsoluteFill>
  </ThemeProvider>
);

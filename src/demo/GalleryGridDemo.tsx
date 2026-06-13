import React from "react";
import { AbsoluteFill } from "remotion";
import { ThemeProvider } from "../theme/ThemeProvider";
import { GEMINI_FLOW_THEME } from "../theme/GeminiFlowTheme";
import { GalleryGrid } from "../scenes/GalleryGrid";

export const GalleryGridDemo: React.FC = () => (
  <ThemeProvider theme={GEMINI_FLOW_THEME}>
    <AbsoluteFill>
      <GalleryGrid
        images={[
          "#7C3AED", "#14B8A6", "#F472B6",
          "#38BDF8", "#FBBF24", "#6366F1",
          "#10B981", "#EC4899", "#8B5CF6",
        ]}
        columns={3}
        startFrame={5}
        itemStagger={4}
      />
    </AbsoluteFill>
  </ThemeProvider>
);

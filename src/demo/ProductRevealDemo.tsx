import React from "react";
import { AbsoluteFill } from "remotion";
import { ThemeProvider } from "../theme/ThemeProvider";
import { GEMINI_FLOW_THEME } from "../theme/GeminiFlowTheme";
import { ProductReveal } from "../scenes/ProductReveal";

export const ProductRevealDemo: React.FC = () => {
  return (
    <ThemeProvider theme={GEMINI_FLOW_THEME}>
      <AbsoluteFill>
        <ProductReveal
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
          title="Beautiful Analytics Platform"
          subtitle="Visualize your metrics in real-time with dark mode styling, custom charts, and deep insights."
          startFrame={5}
          titleStartFrame={10}
          subtitleStartFrame={20}
          imageStartFrame={30}
          sweepStartFrame={75}
          sweepDurationInFrames={35}
          aspectRatio="16 / 10"
        />
      </AbsoluteFill>
    </ThemeProvider>
  );
};

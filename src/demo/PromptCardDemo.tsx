import React from "react";
import { AbsoluteFill } from "remotion";
import { ThemeProvider } from "../theme/ThemeProvider";
import { GEMINI_FLOW_THEME } from "../theme/GeminiFlowTheme";
import { PromptCard } from "../scenes/PromptCard";

export const PromptCardDemo: React.FC = () => (
  <ThemeProvider theme={GEMINI_FLOW_THEME}>
    <AbsoluteFill>
      <PromptCard
        prompt="Generate a cinematic product launch video for our AI analytics platform with dark theme, animated charts, and premium typography."
        placeholder="Enter your prompt..."
        showSubmitButton={true}
        typingSpeed={0.7}
        startFrame={10}
      />
    </AbsoluteFill>
  </ThemeProvider>
);

import React from "react";
import { AbsoluteFill } from "remotion";
import { ThemeProvider } from "../theme/ThemeProvider";
import { GEMINI_FLOW_THEME } from "../theme/GeminiFlowTheme";
import { ContentWall } from "../scenes/ContentWall";

export const ContentWallDemo: React.FC = () => (
  <ThemeProvider theme={GEMINI_FLOW_THEME}>
    <AbsoluteFill>
      <ContentWall
        items={[
          "Neural Networks", "Transformers", "Diffusion Models",
          "Vision AI", "Speech Synthesis", "Code Generation",
          "Reinforcement Learning", "Multimodal AI", "Edge Computing",
          "Federated Learning", "AutoML", "Prompt Engineering",
          "Fine-Tuning", "RAG Systems", "Embeddings",
          "Knowledge Graphs", "AI Agents", "Tool Use",
          "Context Windows", "Chain of Thought", "In-Context Learning",
          "Self-Supervised", "Contrastive Learning", "RLHF",
        ]}
        columns={4}
        scrollSpeed={1.5}
        startFrame={0}
      />
    </AbsoluteFill>
  </ThemeProvider>
);

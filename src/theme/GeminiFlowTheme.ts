/**
 * GeminiFlowTheme — A premium AI-product design system inspired by
 * Google Gemini, OpenAI, and Linear product launch videos.
 *
 * Deep dark gradients, purple-teal accent pairing, glassmorphism,
 * and large corner radii for a futuristic feel.
 */

import type { Theme } from "../types/schema";

export const GEMINI_FLOW_THEME: Theme = {
  stylePreset: "Futuristic",
  colors: {
    background: "#06060F",
    surface: "#0E0E1A",
    primary: "#7C3AED",
    secondary: "#14B8A6",
    text: "#F8FAFC",
    mutedText: "#94A3B8",
    accent: "#A78BFA",
    border: "rgba(124, 58, 237, 0.12)",
    charts: ["#7C3AED", "#14B8A6", "#F472B6", "#38BDF8", "#FBBF24"],
  },
  typography: {
    headingFont: "Plus Jakarta Sans",
    bodyFont: "Inter",
    monoFont: "JetBrains Mono",
  },
  glassmorphism: true,
  borderRadius: 24,
};

/** Dark-mode glassmorphism card style tokens */
export const GLASS_CARD_STYLE: React.CSSProperties = {
  background: "rgba(14, 14, 26, 0.6)",
  backdropFilter: "blur(24px) saturate(150%)",
  WebkitBackdropFilter: "blur(24px) saturate(150%)",
  border: "1px solid rgba(124, 58, 237, 0.12)",
  borderRadius: 24,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
};

/** Animated glow border gradient for premium cards */
export const GLOW_BORDER_GRADIENT =
  "conic-gradient(from 180deg at 50% 50%, #7C3AED 0deg, #14B8A6 120deg, #F472B6 240deg, #7C3AED 360deg)";

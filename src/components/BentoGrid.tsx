import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { SPRING_PRESETS } from "../animation/springs";
import { EASINGS } from "../animation/easings";

// ─── Public interfaces ───────────────────────────────────────────

export interface GridItem {
  /** Emoji or short string rendered as the card icon */
  icon: string;
  /** Card title text */
  title: string;
  /** Card description / body text */
  description: string;
  /** Number of grid columns this card spans. Default: 1 */
  colSpan?: number;
  /** Number of grid rows this card spans. Default: 1 */
  rowSpan?: number;
}

export interface BentoGridProps {
  /** Array of items to render in the grid */
  items: GridItem[];
  /** Number of grid columns. Default: 3 */
  columns?: number;
  /** Gap between grid cells in px. Default: 16 */
  gap?: number;
  /** Frame offset before the first card begins animating. Default: 0 */
  startFrame?: number;
  /** Frames between each successive card's entry. Default: 4 */
  itemStagger?: number;
}

// ─── Component ───────────────────────────────────────────────────

/**
 * BentoGrid — A modern AI-product bento grid layout.
 *
 * Each cell is a glassmorphic card that slides up and fades in with a
 * staggered spring animation. Cards support configurable column and
 * row spans for visually dynamic layouts.
 *
 * This is a layout component — it renders no background or noise
 * overlay. Compose it inside a scene that provides those layers.
 */
export const BentoGrid: React.FC<BentoGridProps> = ({
  items,
  columns = 3,
  gap = 16,
  startFrame = 0,
  itemStagger = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        width: "100%",
      }}
    >
      {items.map((item, index) => {
        const delay = startFrame + index * itemStagger;

        // Spring drives the positional reveal
        const springVal = spring({
          frame: frame - delay,
          fps,
          config: SPRING_PRESETS.smooth,
          durationInFrames: 40,
        });

        // Translate: slide up from 30px below
        const translateY = interpolate(springVal, [0, 1], [30, 0]);

        // Opacity: quick fade-in using easeOutQuart
        const opacity = interpolate(
          frame - delay,
          [0, 14],
          [0, 1],
          {
            easing: Easing.bezier(...EASINGS.easeOutQuart),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );

        // Scale: subtle 0.96 → 1 pop
        const scale = interpolate(springVal, [0, 1], [0.96, 1]);

        // Border glow intensity ramps up with opacity
        const glowOpacity = interpolate(
          springVal,
          [0, 0.6, 1],
          [0, 0, 0.35],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );

        const colSpan = item.colSpan ?? 1;
        const rowSpan = item.rowSpan ?? 1;

        return (
          <div
            key={`bento-${index}`}
            style={{
              gridColumn: `span ${colSpan}`,
              gridRow: `span ${rowSpan}`,
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity,
              willChange: "transform, opacity",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "100%",
                borderRadius: theme.borderRadius,
                overflow: "hidden",

                // Glassmorphic card surface
                background: "rgba(14, 14, 26, 0.6)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(124, 58, 237, 0.12)",

                // Subtle glow on the border — intensity animated
                boxShadow: [
                  `0 0 0 1px rgba(124, 58, 237, ${glowOpacity * 0.25})`,
                  `0 0 24px rgba(124, 58, 237, ${glowOpacity * 0.15})`,
                  `inset 0 1px 0 rgba(255, 255, 255, 0.04)`,
                  `0 8px 32px rgba(0, 0, 0, 0.25)`,
                ].join(", "),

                padding: 28,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                gap: 12,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  fontSize: 36,
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {item.icon}
              </div>

              {/* Title */}
              <div
                style={{
                  fontFamily: theme.resolvedFonts.heading,
                  fontWeight: 600,
                  fontSize: 20,
                  lineHeight: 1.3,
                  color: theme.colors.text,
                  letterSpacing: -0.2,
                }}
              >
                {item.title}
              </div>

              {/* Description */}
              <div
                style={{
                  fontFamily: theme.resolvedFonts.body,
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: theme.colors.mutedText,
                }}
              >
                {item.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

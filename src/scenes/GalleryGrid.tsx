import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { SPRING_PRESETS } from "../animation/springs";
import { EASINGS } from "../animation/easings";

// ─── Props ───────────────────────────────────────────────────────
export interface GalleryGridProps {
  /** URLs or colour hex codes used as card backgrounds */
  images: string[];
  /** Number of masonry columns. Default: 3 */
  columns?: number;
  /** Frame at which items begin appearing. Default: 10 */
  startFrame?: number;
  /** Stagger delay between items in frames. Default: 4 */
  itemStagger?: number;
}

// ─── Helpers ─────────────────────────────────────────────────────

/**
 * Generate a deterministic "random" height for each masonry card so
 * the layout feels organic. Uses a simple hash-like approach seeded
 * by the item index.
 */
function cardHeight(index: number): number {
  const base = 180;
  const variation = 100;
  // Simple deterministic variation based on index
  const seed = Math.sin(index * 7.37 + 3.14) * 0.5 + 0.5; // 0-1
  return Math.round(base + seed * variation);
}

/**
 * Returns a CSS gradient string for a placeholder card, derived
 * from the charts palette or from the provided value if it looks
 * like a colour/hex or URL.
 */
function resolveBackground(
  value: string,
  index: number,
  chartColors: string[],
): string {
  // If it looks like a URL, use it as a background image
  if (value.startsWith("http") || value.startsWith("data:")) {
    return `url(${value}) center/cover no-repeat`;
  }
  // If a hex colour, create a gradient with a subtle hue shift
  if (value.startsWith("#") || value.startsWith("rgb")) {
    return `linear-gradient(135deg, ${value} 0%, ${value}99 100%)`;
  }
  // Fallback to chart palette gradient
  const c1 = chartColors[index % chartColors.length];
  const c2 = chartColors[(index + 2) % chartColors.length];
  return `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
}

// ─── Constants ───────────────────────────────────────────────────
const GRID_GAP = 16;
const GRID_PADDING = 60;
const MAX_GRID_WIDTH = 1100;

/**
 * GalleryGrid — Full-screen masonry gallery of animated gradient
 * placeholder cards using CSS multi-column layout.
 * Each card reveals with staggered spring scale + opacity and
 * has a subtle floating oscillation. All animation via Remotion
 * spring() / interpolate() — no CSS keyframes.
 */
export const GalleryGrid: React.FC<GalleryGridProps> = ({
  images,
  columns = 3,
  startFrame = 10,
  itemStagger = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Pre-compute deterministic heights
  const heights = useMemo(() => images.map((_, i) => cardHeight(i)), [images]);

  return (
    <AbsoluteFill>
      <GradientBackground opacity={0.35} />
      <NoiseTexture />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: `${GRID_PADDING}px`,
        }}
      >
        {/* Masonry container using CSS columns */}
        <div
          style={{
            columnCount: columns,
            columnGap: GRID_GAP,
            width: "100%",
            maxWidth: MAX_GRID_WIDTH,
          }}
        >
          {images.map((img, index) => {
            const delay = startFrame + index * itemStagger;

            // ── Entrance spring ──────────────────────────────────
            const itemSpring = spring({
              frame: frame - delay,
              fps,
              config: SPRING_PRESETS.smooth,
              durationInFrames: 30,
            });

            const itemScale = interpolate(itemSpring, [0, 1], [0.85, 1]);
            const itemOpacity = interpolate(
              frame - delay,
              [0, 14],
              [0, 1],
              {
                easing: Easing.bezier(...EASINGS.easeOutQuart),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );

            // ── Subtle floating oscillation (±3 px) ─────────────
            // Each card gets a unique phase offset for variety
            const floatPhase =
              Math.sin(index * 2.17 + 1.23); // deterministic offset
            const floatY = interpolate(
              Math.sin(
                ((frame - delay) / fps) * Math.PI * 0.8 + floatPhase * Math.PI,
              ),
              [-1, 1],
              [-3, 3],
            );

            // Only apply float after entrance is mostly done
            const floatStrength = interpolate(
              frame - delay,
              [0, 25],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            const background = resolveBackground(
              img,
              index,
              theme.colors.charts,
            );

            return (
              <div
                key={`gallery-item-${index}`}
                style={{
                  // Prevent column break inside a card
                  breakInside: "avoid",
                  marginBottom: GRID_GAP,
                  transform: `scale(${itemScale}) translateY(${floatY * floatStrength}px)`,
                  opacity: itemOpacity,
                  willChange: "transform, opacity",
                }}
              >
                <div
                  style={{
                    height: heights[index],
                    borderRadius: theme.borderRadius,
                    background,
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: `0 8px 32px rgba(0,0,0,0.25)`,
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  {/* Inner shine / highlight strip */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "40%",
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
                      pointerEvents: "none",
                      borderRadius: `${theme.borderRadius}px ${theme.borderRadius}px 0 0`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

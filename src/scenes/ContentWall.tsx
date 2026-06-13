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

export interface ContentWallProps {
  /** Labels or color values for each card in the wall */
  items: string[];
  /** Number of columns in the grid. Default: 4 */
  columns?: number;
  /** Vertical scroll speed in pixels per frame. Default: 1.5 */
  scrollSpeed?: number;
  /** Frame offset to begin the animation. Default: 0 */
  startFrame?: number;
}

/** Per-column depth scale for parallax illusion */
const COLUMN_DEPTH_SCALES = [0.95, 1.0, 0.97, 0.93, 0.98, 0.96];

/**
 * ContentWall — A massive wall of generated content displayed in 3D
 * perspective with a cinematic camera fly-through.
 *
 * Cards are arranged in a multi-column grid with CSS perspective,
 * continuous vertical scrolling, staggered fade-in, and depth-based
 * scale differences between columns.
 */
export const ContentWall: React.FC<ContentWallProps> = ({
  items,
  columns = 4,
  scrollSpeed = 1.5,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const theme = useTheme();

  const relativeFrame = frame - startFrame;

  // ── Distribute items across columns ────────────────────────
  const columnData = useMemo(() => {
    const cols: Array<{ label: string; index: number }[]> = Array.from(
      { length: columns },
      () => []
    );
    items.forEach((item, i) => {
      cols[i % columns].push({ label: item, index: i });
    });
    return cols;
  }, [items, columns]);

  // ── Card dimensions ────────────────────────────────────────
  const cardGap = 16;
  const columnGap = 18;
  const cardWidth = 220;
  const cardHeight = 140;

  // ── Continuous vertical scroll offset ──────────────────────
  const scrollY = interpolate(
    relativeFrame,
    [0, 9999],
    [0, -9999 * scrollSpeed],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "extend",
    }
  );

  // ── Overall wall entrance ──────────────────────────────────
  const wallEnterSpring = spring({
    frame: relativeFrame,
    fps,
    config: SPRING_PRESETS.slow,
    durationInFrames: 60,
  });

  const wallOpacity = interpolate(
    relativeFrame,
    [0, 24],
    [0, 1],
    {
      easing: Easing.bezier(...EASINGS.easeOutQuart),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const wallScale = interpolate(wallEnterSpring, [0, 1], [0.9, 1]);

  // ── Total grid width for centering ─────────────────────────
  const totalGridWidth = columns * cardWidth + (columns - 1) * columnGap;

  // ── Glassmorphism card style ───────────────────────────────
  const glassBackground = theme.glassmorphism
    ? `${theme.colors.surface}BB`
    : theme.colors.surface;

  const glassBorder = `1px solid ${theme.colors.border}`;

  const glassBackdrop = theme.glassmorphism ? "blur(10px)" : undefined;

  return (
    <AbsoluteFill>
      {/* ─── Background ─────────────────────────────────── */}
      <GradientBackground opacity={0.35} />
      <NoiseTexture opacity={0.02} />

      {/* ─── 3D Perspective Container ───────────────────── */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: wallOpacity,
          willChange: "opacity",
        }}
      >
        <div
          style={{
            transform: `perspective(1200px) rotateY(-12deg) rotateX(8deg) scale(${wallScale})`,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {/* ─── Columns Container ────────────────────── */}
          <div
            style={{
              display: "flex",
              gap: columnGap,
              width: totalGridWidth,
            }}
          >
            {columnData.map((columnItems, colIndex) => {
              const depthScale =
                COLUMN_DEPTH_SCALES[colIndex % COLUMN_DEPTH_SCALES.length];

              // Stagger column entrance
              const colDelay = colIndex * 5;
              const colSpring = spring({
                frame: relativeFrame - colDelay,
                fps,
                config: SPRING_PRESETS.smooth,
                durationInFrames: 40,
              });

              const colOpacity = interpolate(
                relativeFrame - colDelay,
                [0, 16],
                [0, 1],
                {
                  easing: Easing.bezier(...EASINGS.easeOutQuart),
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );

              const colTranslateY = interpolate(
                colSpring,
                [0, 1],
                [30 + colIndex * 8, 0]
              );

              return (
                <div
                  key={`col-${colIndex}`}
                  style={{
                    width: cardWidth,
                    display: "flex",
                    flexDirection: "column",
                    gap: cardGap,
                    transform: `scale(${depthScale}) translateY(${scrollY + colTranslateY}px)`,
                    opacity: colOpacity,
                    willChange: "transform, opacity",
                  }}
                >
                  {columnItems.map(({ label, index: itemIndex }) => {
                    // ── Per-card staggered fade-in ──────
                    const cardDelay = colDelay + Math.floor(itemIndex / columns) * 4 + 8;

                    const cardSpring = spring({
                      frame: relativeFrame - cardDelay,
                      fps,
                      config: SPRING_PRESETS.gentle,
                      durationInFrames: 28,
                    });

                    const cardOpacity = interpolate(
                      relativeFrame - cardDelay,
                      [0, 14],
                      [0, 1],
                      {
                        easing: Easing.bezier(...EASINGS.easeOutQuart),
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }
                    );

                    const cardScaleIn = interpolate(
                      cardSpring,
                      [0, 1],
                      [0.88, 1]
                    );

                    // ── Viewport visibility fade ───────
                    // Calculate absolute Y of this card accounting for scroll
                    const rowInColumn = Math.floor(itemIndex / columns);
                    const cardAbsoluteY = rowInColumn * (cardHeight + cardGap) + scrollY;
                    const viewportTop = -height * 0.6;
                    const viewportBottom = height * 0.6;

                    const viewportVisibility = interpolate(
                      cardAbsoluteY,
                      [viewportTop - cardHeight, viewportTop, viewportBottom - cardHeight, viewportBottom],
                      [0, 1, 1, 0],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }
                    );

                    // ── Card gradient color ────────────
                    const chartColors = theme.colors.charts;
                    const colorA = chartColors[itemIndex % chartColors.length];
                    const colorB = chartColors[(itemIndex + 1) % chartColors.length];
                    const cardGradient = `linear-gradient(135deg, ${colorA}55, ${colorB}33)`;

                    return (
                      <div
                        key={`card-${itemIndex}`}
                        style={{
                          width: cardWidth,
                          height: cardHeight,
                          borderRadius: theme.borderRadius,
                          background: cardGradient,
                          backgroundColor: glassBackground,
                          backdropFilter: glassBackdrop,
                          WebkitBackdropFilter: glassBackdrop,
                          border: glassBorder,
                          boxShadow: theme.glassmorphism
                            ? `0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.06)`
                            : `0 4px 16px rgba(0, 0, 0, 0.1)`,
                          transform: `scale(${cardScaleIn})`,
                          opacity: cardOpacity * viewportVisibility,
                          willChange: "transform, opacity",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                          padding: 16,
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        {/* Accent stripe at top */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            background: `linear-gradient(90deg, ${colorA}, ${colorB})`,
                            opacity: 0.7,
                          }}
                        />

                        {/* Card label */}
                        <span
                          style={{
                            fontFamily: theme.resolvedFonts.body,
                            fontSize: 13,
                            fontWeight: 500,
                            color: theme.colors.text,
                            lineHeight: 1.3,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {label}
                        </span>

                        {/* Decorative content lines */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 5,
                            marginTop: 8,
                          }}
                        >
                          {[0.8, 0.6, 0.45].map((w, lineIdx) => (
                            <div
                              key={`line-${lineIdx}`}
                              style={{
                                height: 5,
                                width: `${w * 100}%`,
                                borderRadius: 3,
                                backgroundColor: `${theme.colors.mutedText}22`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
  Img,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { BrowserChrome } from "../components/primitives/BrowserChrome";
import { AnimatedText } from "../components/primitives/AnimatedText";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { SPRING_PRESETS } from "../animation/springs";
import { EASINGS } from "../animation/easings";

export interface WorkspaceShowcaseProps {
  /** Image source to display inside the browser frame */
  image?: string;
  /** Optional title overlay displayed above the browser */
  title?: string;
  /** Optional subtitle displayed below the title */
  subtitle?: string;
  /** Cinematic zoom amount over the scene duration. Default: 0.08 */
  zoomAmount?: number;
  /** Horizontal pan distance in px. Default: 20 */
  panAmount?: number;
  /** Frame offset to begin the entrance animation. Default: 0 */
  startFrame?: number;
}

/**
 * WorkspaceShowcase — A cinematic software interface showcase scene.
 *
 * Renders a full-screen browser-chrome frame containing an image or
 * a gradient placeholder, with slow-zoom + pan camera motion,
 * parallax background, and optional animated title overlay.
 */
export const WorkspaceShowcase: React.FC<WorkspaceShowcaseProps> = ({
  image,
  title,
  subtitle,
  zoomAmount = 0.08,
  panAmount = 20,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const theme = useTheme();

  const relativeFrame = frame - startFrame;

  // ── Scene progress (0 → 1) for cinematic camera ────────────
  const sceneProgress = interpolate(
    relativeFrame,
    [0, durationInFrames],
    [0, 1],
    {
      easing: Easing.bezier(...EASINGS.easeInOutSmooth),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ── Cinematic zoom: 1.0 → 1.0 + zoomAmount ────────────────
  const cameraScale = interpolate(sceneProgress, [0, 1], [1.0, 1.0 + zoomAmount]);

  // ── Subtle horizontal pan ──────────────────────────────────
  const cameraPanX = interpolate(sceneProgress, [0, 1], [0, -panAmount]);

  // ── Parallax: background moves at 40% the rate ─────────────
  const bgPanX = interpolate(sceneProgress, [0, 1], [0, -panAmount * 0.4]);
  const bgScale = interpolate(sceneProgress, [0, 1], [1.0, 1.0 + zoomAmount * 0.4]);

  // ── Browser frame entrance spring ──────────────────────────
  const enterSpring = spring({
    frame: relativeFrame,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 45,
  });

  const browserY = interpolate(enterSpring, [0, 1], [40, 0]);
  const browserScale = interpolate(enterSpring, [0, 1], [0.95, 1]);
  const browserOpacity = interpolate(
    relativeFrame,
    [0, 18],
    [0, 1],
    {
      easing: Easing.bezier(...EASINGS.easeOutQuart),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ── Title overlay entrance (slightly before browser) ───────
  const titleOpacity = title
    ? interpolate(relativeFrame, [0, 14], [0, 1], {
        easing: Easing.bezier(...EASINGS.easeOutQuart),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const titleSpring = title
    ? spring({
        frame: relativeFrame,
        fps,
        config: SPRING_PRESETS.gentle,
        durationInFrames: 35,
      })
    : 0;

  const titleY = interpolate(titleSpring, [0, 1], [24, 0]);

  // ── Browser sizing ────────────────────────────────────────
  const browserWidth = Math.min(960, width - 120);
  const browserHeight = Math.min(600, height - 240);

  // ── Gradient placeholder for when no image is provided ─────
  const placeholderGradient = `linear-gradient(135deg, ${theme.colors.primary}33 0%, ${theme.colors.secondary}33 50%, ${theme.colors.accent}33 100%)`;

  return (
    <AbsoluteFill>
      {/* ─── Parallax Background Layer ──────────────────── */}
      <AbsoluteFill
        style={{
          transform: `scale(${bgScale}) translateX(${bgPanX}px)`,
          willChange: "transform",
        }}
      >
        <GradientBackground opacity={0.5} />
      </AbsoluteFill>

      <NoiseTexture opacity={0.025} />

      {/* ─── Camera Motion Container ────────────────────── */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraScale}) translateX(${cameraPanX}px)`,
          willChange: "transform",
        }}
      >
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
            padding: "0 60px",
          }}
        >
          {/* ─── Title Overlay ───────────────────────────── */}
          {title && (
            <div
              style={{
                opacity: titleOpacity,
                transform: `translateY(${titleY}px)`,
                willChange: "transform, opacity",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <AnimatedText
                text={title}
                splitBy="words"
                staggerFrames={3}
                startFrame={startFrame + 2}
                fontSize={48}
                fontWeight={700}
                lineHeight={1.15}
                isHeading
              />

              {subtitle && (
                <AnimatedText
                  text={subtitle}
                  splitBy="words"
                  staggerFrames={2}
                  startFrame={startFrame + 10}
                  fontSize={20}
                  fontWeight={400}
                  color={theme.colors.mutedText}
                  lineHeight={1.5}
                  maxWidth={560}
                  isHeading={false}
                />
              )}
            </div>
          )}

          {/* ─── Browser Chrome Frame ───────────────────── */}
          <div
            style={{
              transform: `translateY(${browserY}px) scale(${browserScale})`,
              opacity: browserOpacity,
              willChange: "transform, opacity",
            }}
          >
            <BrowserChrome
              url="https://workspace.app"
              width={browserWidth}
              height={browserHeight}
            >
              {image ? (
                <Img
                  src={image}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                /* Gradient placeholder */
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: placeholderGradient,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Decorative mock UI elements */}
                  <div
                    style={{
                      position: "absolute",
                      top: 24,
                      left: 24,
                      right: 24,
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    {/* Mock sidebar + content layout */}
                    <div style={{ display: "flex", gap: 16, height: browserHeight - 100 }}>
                      {/* Sidebar */}
                      <div
                        style={{
                          width: 180,
                          borderRadius: theme.borderRadius * 0.6,
                          backgroundColor: `${theme.colors.surface}88`,
                          backdropFilter: theme.glassmorphism ? "blur(8px)" : undefined,
                          border: `1px solid ${theme.colors.border}`,
                          padding: 16,
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                        }}
                      >
                        {[0.7, 0.5, 0.85, 0.4, 0.65].map((w, i) => (
                          <div
                            key={`sidebar-${i}`}
                            style={{
                              height: 10,
                              width: `${w * 100}%`,
                              borderRadius: 5,
                              backgroundColor: `${theme.colors.mutedText}33`,
                            }}
                          />
                        ))}
                      </div>

                      {/* Main content */}
                      <div
                        style={{
                          flex: 1,
                          borderRadius: theme.borderRadius * 0.6,
                          backgroundColor: `${theme.colors.surface}55`,
                          backdropFilter: theme.glassmorphism ? "blur(6px)" : undefined,
                          border: `1px solid ${theme.colors.border}`,
                          padding: 20,
                          display: "flex",
                          flexDirection: "column",
                          gap: 14,
                        }}
                      >
                        {/* Title bar */}
                        <div
                          style={{
                            height: 14,
                            width: "40%",
                            borderRadius: 7,
                            backgroundColor: `${theme.colors.text}22`,
                          }}
                        />
                        {/* Content rows */}
                        {[0.95, 0.8, 0.9, 0.6, 0.75, 0.85].map((w, i) => (
                          <div
                            key={`content-${i}`}
                            style={{
                              height: 8,
                              width: `${w * 100}%`,
                              borderRadius: 4,
                              backgroundColor: `${theme.colors.mutedText}22`,
                            }}
                          />
                        ))}

                        {/* Cards row */}
                        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                          {theme.colors.charts.slice(0, 3).map((color, i) => (
                            <div
                              key={`card-${i}`}
                              style={{
                                flex: 1,
                                height: 80,
                                borderRadius: theme.borderRadius * 0.5,
                                background: `linear-gradient(135deg, ${color}44, ${color}22)`,
                                border: `1px solid ${color}33`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </BrowserChrome>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

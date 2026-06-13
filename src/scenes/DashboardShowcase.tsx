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
import { AnimatedCursor } from "../components/cursor/AnimatedCursor";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { SPRING_PRESETS } from "../animation/springs";

interface CursorKeyframe {
  frame: number;
  x: number;
  y: number;
  click?: boolean;
}

interface DashboardShowcaseProps {
  /** URL displayed in the browser address bar */
  url?: string;
  /** Screenshot/mockup image URL to display inside the browser */
  screenshotUrl?: string;
  /** Optional content to render instead of a screenshot */
  mockupContent?: React.ReactNode;
  /** Browser frame width. Default: 900 */
  browserWidth?: number;
  /** Browser frame height. Default: 560 */
  browserHeight?: number;
  /** Cursor movement keyframes */
  cursorKeyframes?: CursorKeyframe[];
  /** Frame at which the browser enters. Default: 10 */
  enterFrame?: number;
  /** Optional floating badges/tooltips to show during the showcase */
  highlights?: Array<{
    text: string;
    x: number;
    y: number;
    showAtFrame: number;
  }>;
}

/**
 * DashboardShowcase — A scene displaying a mockup browser window
 * with an animated cursor navigating through the interface.
 * The browser frame enters with a spring animation.
 */
export const DashboardShowcase: React.FC<DashboardShowcaseProps> = ({
  url = "https://app.example.com/dashboard",
  screenshotUrl,
  mockupContent,
  browserWidth = 900,
  browserHeight = 560,
  cursorKeyframes = [],
  enterFrame = 10,
  highlights = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // ── Browser entrance animation ─────────────────────────────
  const enterSpring = spring({
    frame: frame - enterFrame,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 40,
  });

  const browserScale = interpolate(enterSpring, [0, 1], [0.92, 1]);
  const browserY = interpolate(enterSpring, [0, 1], [40, 0]);
  const browserOpacity = interpolate(
    frame - enterFrame,
    [0, 15],
    [0, 1],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill>
      <GradientBackground opacity={0.4} />
      <NoiseTexture />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${browserScale}) translateY(${browserY}px)`,
            opacity: browserOpacity,
            willChange: "transform, opacity",
            position: "relative",
          }}
        >
          <BrowserChrome
            url={url}
            width={browserWidth}
            height={browserHeight}
          >
            {/* Content area */}
            {screenshotUrl ? (
              <Img
                src={screenshotUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : mockupContent ? (
              <div style={{ width: "100%", height: "100%", position: "relative" }}>
                {mockupContent}
              </div>
            ) : (
              // Default placeholder mockup
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.colors.surface,
                }}
              >
                <span
                  style={{
                    fontFamily: theme.resolvedFonts.body,
                    fontSize: 16,
                    color: theme.colors.mutedText,
                  }}
                >
                  Dashboard Preview
                </span>
              </div>
            )}

            {/* Cursor overlay */}
            {cursorKeyframes.length > 0 && (
              <AnimatedCursor keyframes={cursorKeyframes} />
            )}
          </BrowserChrome>

          {/* Floating highlight badges */}
          {highlights.map((hl, i) => {
            const hlSpring = spring({
              frame: frame - hl.showAtFrame,
              fps,
              config: SPRING_PRESETS.snappy,
              durationInFrames: 20,
            });

            const hlOpacity = interpolate(
              frame - hl.showAtFrame,
              [0, 8],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            const hlScale = interpolate(hlSpring, [0, 1], [0.7, 1]);

            return (
              <div
                key={`hl-${i}`}
                style={{
                  position: "absolute",
                  left: hl.x,
                  top: hl.y,
                  transform: `scale(${hlScale})`,
                  opacity: hlOpacity,
                  backgroundColor: theme.colors.primary,
                  color: "#FFFFFF",
                  fontFamily: theme.resolvedFonts.body,
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "6px 14px",
                  borderRadius: 20,
                  boxShadow: `0 4px 12px ${theme.colors.primary}66`,
                  whiteSpace: "nowrap",
                }}
              >
                {hl.text}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

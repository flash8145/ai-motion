import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { usePathLength, dashOffsetForProgress, computeDrawProgress } from "../utils/pathDraw";

interface WhiteboardRevealProps {
  /** SVG path `d` for the hand-drawn sketch doodle (circle, underline, arrow, etc). */
  sketchPath: string;
  sketchViewBox?: string;
  title?: string;
  description?: string;
  icon?: string;
  drawStartFrame?: number;
  drawDurationFrames?: number;
  contentStartFrame?: number;
  accentColor?: string;
  background?: "theme" | "transparent" | "paper";
}

/**
 * WhiteboardReveal — a hand-drawn sketch doodle draws itself on,
 * then a title/description/icon block fades in, mimicking the
 * classic "whiteboard explainer" video style.
 */
export const WhiteboardReveal: React.FC<WhiteboardRevealProps> = ({
  sketchPath,
  sketchViewBox = "0 0 1920 1080",
  title,
  description,
  icon,
  drawStartFrame = 0,
  drawDurationFrames = 50,
  contentStartFrame,
  accentColor,
  background = "paper",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const { ref, length } = usePathLength<SVGPathElement>([sketchPath]);

  const drawProgress = computeDrawProgress(frame, drawStartFrame, drawDurationFrames);
  const measured = length > 0;

  const resolvedContentStart = contentStartFrame ?? drawStartFrame + drawDurationFrames - 10;
  const contentLocal = frame - resolvedContentStart;

  const contentOpacity = interpolate(contentLocal, [0, 18], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contentY = interpolate(contentLocal, [0, 18], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ink = accentColor ?? theme.colors.primary;
  const backgroundColor =
    background === "paper" ? "#FAFAF7" : background === "theme" ? theme.colors.background : "transparent";
  const textColor = background === "paper" ? "#1A1A1A" : theme.colors.text;
  const mutedColor = background === "paper" ? "#5A5A52" : theme.colors.mutedText;

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {background === "paper" && <NoiseTexture />}

      <svg
        viewBox={sketchViewBox}
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <path
          ref={ref}
          d={sketchPath}
          stroke={ink}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={measured ? length : undefined}
          strokeDashoffset={measured ? dashOffsetForProgress(length, drawProgress) : undefined}
          opacity={measured ? 1 : 0}
        />
      </svg>

      {(title || description || icon) && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            opacity: contentOpacity,
            transform: `translateY(${contentY}px)`,
          }}
        >
          {icon && (
            <svg width={72} height={72} viewBox="0 0 24 24">
              <path d={icon} fill={ink} />
            </svg>
          )}
          {title && (
            <div
              style={{
                fontFamily: theme.resolvedFonts.heading,
                fontSize: 48,
                fontWeight: 700,
                color: textColor,
                textAlign: "center",
              }}
            >
              {title}
            </div>
          )}
          {description && (
            <div
              style={{
                fontFamily: theme.resolvedFonts.body,
                fontSize: 22,
                color: mutedColor,
                textAlign: "center",
                maxWidth: 700,
              }}
            >
              {description}
            </div>
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

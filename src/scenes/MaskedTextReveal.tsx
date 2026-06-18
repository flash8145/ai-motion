import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { EASINGS } from "../animation/easings";

interface MaskedTextRevealProps {
  text: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  backgroundColor?: string;
  /** Color of the sweeping reveal bar. */
  barColor?: string;
  startFrame?: number;
  direction?: "left" | "right";
  maxWidth?: number;
}

/**
 * MaskedTextReveal — a colored bar sweeps across and the headline is revealed
 * in its wake (clip-path wipe). Crisp, agency-style title reveal.
 */
export const MaskedTextReveal: React.FC<MaskedTextRevealProps> = ({
  text,
  fontSize = 104,
  fontWeight = 800,
  color,
  backgroundColor,
  barColor,
  startFrame = 6,
  direction = "left",
  maxWidth = 1100,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const textColor = color ?? theme.colors.text;
  const bar = barColor ?? theme.colors.primary;

  const t = frame - startFrame;
  // Bar sweeps 0→100→exit; text reveals as the bar passes.
  const sweep = interpolate(t, [0, 22], [0, 100], {
    easing: Easing.bezier(...EASINGS.easeInOutSmooth),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barExit = interpolate(t, [22, 40], [0, 100], {
    easing: Easing.bezier(...EASINGS.easeInOutSmooth),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fromRight = direction === "right";
  // Text clip: hidden side closes as sweep progresses.
  const clip = fromRight
    ? `inset(0 0 0 ${100 - sweep}%)`
    : `inset(0 ${100 - sweep}% 0 0)`;

  // Bar position: travels across, then continues off the far edge.
  const barPos = fromRight
    ? interpolate(barExit, [0, 100], [100 - sweep, -10])
    : interpolate(barExit, [0, 100], [sweep, 110]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backgroundColor ?? theme.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
      }}
    >
      <div style={{ position: "relative", maxWidth }}>
        <h1
          style={{
            margin: 0,
            textAlign: "center",
            fontFamily: theme.resolvedFonts.heading,
            fontSize,
            fontWeight,
            lineHeight: 1.08,
            color: textColor,
            clipPath: clip,
            willChange: "clip-path",
          }}
        >
          {text}
        </h1>
        {/* Sweeping bar */}
        <div
          style={{
            position: "absolute",
            top: -fontSize * 0.1,
            bottom: -fontSize * 0.1,
            left: `${barPos}%`,
            width: Math.max(8, fontSize * 0.08),
            backgroundColor: bar,
            boxShadow: `0 0 24px ${bar}`,
            opacity: barExit >= 100 ? 0 : 1,
            willChange: "left, opacity",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

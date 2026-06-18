import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { EASINGS } from "../animation/easings";

interface GradientHeadlineProps {
  text: string;
  subtitle?: string;
  fontSize?: number;
  fontWeight?: number;
  /** Gradient colors for the text fill. */
  colors?: string[];
  angle?: number;
  backgroundColor?: string;
  startFrame?: number;
  maxWidth?: number;
}

/**
 * GradientHeadline — a bold headline with an animated gradient fill that
 * sweeps across the type, revealed behind a horizontal wipe.
 */
export const GradientHeadline: React.FC<GradientHeadlineProps> = ({
  text,
  subtitle,
  fontSize = 120,
  fontWeight = 800,
  colors,
  angle = 100,
  backgroundColor,
  startFrame = 6,
  maxWidth = 1200,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const grad = colors ?? [
    theme.colors.primary,
    theme.colors.accent,
    theme.colors.secondary,
  ];

  // Wipe reveal (clip-path inset opening left→right).
  const reveal = interpolate(frame - startFrame, [0, 28], [100, 0], {
    easing: Easing.bezier(...EASINGS.easeInOutSmooth),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gradient drift.
  const pos = interpolate(frame, [0, 120], [0, 100], {
    extrapolateRight: "extend",
  });

  const subOpacity = subtitle
    ? interpolate(frame - startFrame, [24, 44], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backgroundColor ?? theme.colors.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        gap: 28,
      }}
    >
      <h1
        style={{
          margin: 0,
          maxWidth,
          textAlign: "center",
          fontFamily: theme.resolvedFonts.heading,
          fontSize,
          fontWeight,
          lineHeight: 1.05,
          backgroundImage: `linear-gradient(${angle}deg, ${grad.join(", ")})`,
          backgroundSize: "220% 100%",
          backgroundPosition: `${pos % 200}% 50%`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          clipPath: `inset(0 ${reveal}% 0 0)`,
          willChange: "clip-path, background-position",
        }}
      >
        {text}
      </h1>
      {subtitle && (
        <p
          style={{
            margin: 0,
            opacity: subOpacity,
            maxWidth: maxWidth * 0.7,
            textAlign: "center",
            fontFamily: theme.resolvedFonts.body,
            fontSize: Math.max(20, fontSize * 0.22),
            fontWeight: 400,
            color: theme.colors.mutedText,
          }}
        >
          {subtitle}
        </p>
      )}
    </AbsoluteFill>
  );
};

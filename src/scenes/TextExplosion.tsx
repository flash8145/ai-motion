import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { EASINGS } from "../animation/easings";

interface TextExplosionProps {
  text: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  backgroundColor?: string;
  /** "assemble" = letters fly in to form the word; "explode" = also blow apart at the end. */
  mode?: "assemble" | "explode";
  /** Scatter distance in px. Default 700 */
  scatter?: number;
  startFrame?: number;
  revealFrames?: number;
}

/**
 * TextExplosion — letters converge from scattered positions to form the word
 * (and optionally explode apart again before the scene ends). Scatter vectors
 * are deterministic (golden-angle spiral) so the motion is identical per render.
 */
export const TextExplosion: React.FC<TextExplosionProps> = ({
  text,
  fontSize = 120,
  fontWeight = 800,
  color,
  backgroundColor,
  mode = "assemble",
  scatter = 700,
  startFrame = 6,
  revealFrames = 26,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const theme = useTheme();
  const chars = useMemo(() => text.split(""), [text]);
  const textColor = color ?? theme.colors.text;

  // Assemble progress 0→1.
  const assemble = interpolate(
    frame - startFrame,
    [0, revealFrames],
    [0, 1],
    {
      easing: Easing.bezier(...EASINGS.easeOutQuart),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Explode progress (only in explode mode) over the scene's final frames.
  const explodeStart = durationInFrames - 22;
  const explode =
    mode === "explode"
      ? interpolate(frame, [explodeStart, durationInFrames], [0, 1], {
          easing: Easing.bezier(...EASINGS.easeIn),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backgroundColor ?? theme.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {chars.map((char, i) => {
          // Deterministic scatter vector via golden angle.
          const angle = i * 2.399963; // ~137.5° in radians
          const radius = scatter * (0.5 + ((i * 37) % 50) / 100);
          const sx = Math.cos(angle) * radius;
          const sy = Math.sin(angle) * radius;

          // displacement = scattered when assemble=0, zero when assembled,
          // then scattered again as explode→1.
          const offset = (1 - assemble) + explode;
          const tx = sx * offset;
          const ty = sy * offset;
          const rot = interpolate(offset, [0, 1], [0, 90]);
          const opacity = interpolate(
            offset,
            [0, 0.85],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          return (
            <span
              key={`te-${i}`}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                fontFamily: theme.resolvedFonts.heading,
                fontSize,
                fontWeight,
                color: textColor,
                opacity,
                transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg)`,
                willChange: "transform, opacity",
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

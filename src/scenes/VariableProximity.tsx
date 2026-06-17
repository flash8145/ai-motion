import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../theme/ThemeProvider";

interface VariableProximityProps {
  label: string;
  startFrame?: number;
  sweepDurationInFrames?: number;
  fromWeight?: number;
  toWeight?: number;
  fromWidth?: number;
  toWidth?: number;
  radius?: number; // Normalized radius between 0 and 1
  fontSize?: number;
}

export const VariableProximity: React.FC<VariableProximityProps> = ({
  label,
  startFrame = 0,
  sweepDurationInFrames = 60,
  fromWeight = 200,
  toWeight = 800,
  fromWidth = 100,
  toWidth = 180,
  radius = 0.3,
  fontSize = 64,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const local = frame - startFrame;

  const characters = useMemo(() => label.split(""), [label]);

  // Compute virtual cursor position from -radius to 1.0 + radius
  const cursorProgress = interpolate(
    local,
    [0, sweepDurationInFrames],
    [-radius, 1.0 + radius],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          maxWidth: "85%",
          whiteSpace: "pre-wrap",
          flexWrap: "wrap",
        }}
      >
        {characters.map((char, index) => {
          if (char === " ") {
            return <span key={index} style={{ width: fontSize * 0.25 }} />;
          }

          // Calculate normalized relative position of this character
          const charPos = index / Math.max(1, characters.length - 1);

          // Calculate distance to virtual cursor
          const distance = Math.abs(charPos - cursorProgress);

          // Calculate falloff value using a smoothstep curve
          const rawFalloff = Math.max(0, 1 - distance / radius);
          const falloff = rawFalloff * rawFalloff * (3 - 2 * rawFalloff); // smoothstep interpolation

          // Interpolate font weight and width properties
          const currentWeight = Math.round(fromWeight + (toWeight - fromWeight) * falloff);
          const currentWidth = Math.round(fromWidth + (toWidth - fromWidth) * falloff);

          // Build font variation settings
          const fontVariationSettings = `'wght' ${currentWeight}, 'wdth' ${currentWidth}`;

          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                fontFamily: theme.resolvedFonts.heading,
                fontSize,
                color: theme.colors.text,
                fontVariationSettings,
                transform: `scale(${1.0 + falloff * 0.1})`,
                textShadow: falloff > 0.1 ? `0 0 10px ${theme.colors.primary}33` : "none",
                willChange: "transform, font-variation-settings",
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

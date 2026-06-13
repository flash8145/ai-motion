import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { SPRING_PRESETS } from "../animation/springs";
import { EASINGS } from "../animation/easings";
import { Square, Triangle, Move, Orbit, Ruler, Eraser } from "lucide-react";

interface ToolbarMockupProps {
  startFrame?: number;
  iconStagger?: number;
}

const ICONS = [Square, Triangle, Move, Orbit, Ruler, Eraser] as const;

export const ToolbarMockup: React.FC<ToolbarMockupProps> = ({
  startFrame = 5,
  iconStagger = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const labelStartFrame = startFrame + ICONS.length * iconStagger + 10;

  const labelOpacity = interpolate(
    frame,
    [labelStartFrame, labelStartFrame + 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(...EASINGS.easeOutQuart),
    }
  );

  return (
    <AbsoluteFill>
      <GradientBackground />
      <NoiseTexture />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: "30%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 72px)",
            gridTemplateRows: "repeat(2, 72px)",
            gap: "16px",
            position: "relative",
          }}
        >
          {ICONS.map((IconComponent, index) => {
            const iconEntryFrame = startFrame + index * iconStagger;

            const scale = spring({
              frame: frame - iconEntryFrame,
              fps,
              config: SPRING_PRESETS.snappy,
            });

            const opacity = interpolate(
              frame,
              [iconEntryFrame, iconEntryFrame + 10],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 72,
                  height: 72,
                  transform: `scale(${scale})`,
                  opacity,
                }}
              >
                <IconComponent
                  size={48}
                  color="white"
                  strokeWidth={1.5}
                  fill="none"
                />
              </div>
            );
          })}

          <div
            style={{
              position: "absolute",
              bottom: -36,
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 16,
              fontWeight: 600,
              color: theme.colors.mutedText,
              fontFamily: theme.resolvedFonts.body,
              opacity: labelOpacity,
            }}
          >
            like
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { SPRING_PRESETS } from "../animation/springs";

interface LogoRevealOutroProps {
  startFrame?: number; // default 5
}

export const LogoRevealOutro: React.FC<LogoRevealOutroProps> = ({
  startFrame = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Group animation — everything scales and fades in together
  const groupSpring = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_PRESETS.smooth,
  });

  const groupScale = interpolate(groupSpring, [0, 1], [0.8, 1]);
  const groupOpacity = interpolate(groupSpring, [0, 1], [0, 1]);

  // Individual circle staggered pop-in (6-frame stagger, gentle spring)
  const circleScales = [0, 1, 2].map((index) => {
    const s = spring({
      frame: frame - startFrame - index * 6,
      fps,
      config: SPRING_PRESETS.gentle,
    });
    return interpolate(s, [0, 1], [0, 1]);
  });

  const circleSize = 50;

  return (
    <AbsoluteFill>
      {/* Base gradient background */}
      <GradientBackground />

      {/* Darker vignette overlay */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Center layout */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${groupScale})`,
          opacity: groupOpacity,
        }}
      >
        {/* Three circle motifs in a horizontal row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 30,
          }}
        >
          {/* Circle 1: Solid filled white circle */}
          <div
            style={{
              transform: `scale(${circleScales[0]})`,
            }}
          >
            <svg
              width={circleSize}
              height={circleSize}
              viewBox="0 0 50 50"
            >
              <circle cx="25" cy="25" r="22" fill="white" />
            </svg>
          </div>

          {/* Circle 2: Donut (ring + center dot) */}
          <div
            style={{
              transform: `scale(${circleScales[1]})`,
            }}
          >
            <svg
              width={circleSize}
              height={circleSize}
              viewBox="0 0 50 50"
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="white"
                strokeWidth="4"
              />
              <circle cx="25" cy="25" r="5" fill="white" />
            </svg>
          </div>

          {/* Circle 3: Hollow outline ring */}
          <div
            style={{
              transform: `scale(${circleScales[2]})`,
            }}
          >
            <svg
              width={circleSize}
              height={circleSize}
              viewBox="0 0 50 50"
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="white"
                strokeWidth="4"
              />
            </svg>
          </div>
        </div>

        {/* "SDS" wordmark */}
        <div
          style={{
            marginTop: 30,
            fontSize: 72,
            fontWeight: 800,
            fontFamily: theme.resolvedFonts.heading,
            color: theme.colors.mutedText + "66",
            lineHeight: 1,
          }}
        >
          SDS
        </div>

        {/* "SANDYDESIGNSTUDIO" tagline */}
        <div
          style={{
            marginTop: 12,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 6,
            textTransform: "uppercase" as const,
            fontFamily: theme.resolvedFonts.body,
            color: theme.colors.mutedText + "4D",
          }}
        >
          SANDYDESIGNSTUDIO
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

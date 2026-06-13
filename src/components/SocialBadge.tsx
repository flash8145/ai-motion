import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { SPRING_PRESETS } from "../animation/springs";

export const SocialBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Fade-in spring over the first ~20 frames
  const fadeIn = spring({
    frame,
    fps,
    config: SPRING_PRESETS.gentle,
    durationInFrames: 20,
  });

  // Blinking cursor: visible 15 frames, invisible 15 frames
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;
  const cursorOpacity = cursorVisible ? 1 : 0;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          opacity: fadeIn,
          transform: `translateY(${interpolate(fadeIn, [0, 1], [12, 0])}px)`,
        }}
      >
        {/* Instagram-style camera icon */}
        <svg
          width={36}
          height={36}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer rounded square */}
          <rect
            x={2}
            y={2}
            width={32}
            height={32}
            rx={8}
            ry={8}
            stroke="white"
            strokeWidth={2.2}
            fill="none"
          />
          {/* Inner lens circle */}
          <circle
            cx={18}
            cy={18}
            r={7.5}
            stroke="white"
            strokeWidth={2.2}
            fill="none"
          />
          {/* Flash dot */}
          <circle cx={27.5} cy={8.5} r={2} fill="white" />
        </svg>

        {/* Handle text with blinking cursor */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 0,
          }}
        >
          <span
            style={{
              fontFamily: theme.resolvedFonts.heading,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "white",
              lineHeight: 1,
            }}
          >
            @sandydesignstudio_
          </span>
          <span
            style={{
              fontFamily: theme.resolvedFonts.heading,
              fontSize: 14,
              fontWeight: 700,
              color: "white",
              lineHeight: 1,
              opacity: cursorOpacity,
              marginLeft: 1,
            }}
          >
            _
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

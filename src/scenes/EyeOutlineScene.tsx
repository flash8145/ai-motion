import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { useTheme } from "../theme/ThemeProvider";

interface EyeOutlineSceneProps {
  textA: string;
  textB?: string;
  switchFrame?: number; // frame index to transition textA -> textB
  startFrame?: number;
  drawDurationFrames?: number;
  borderColor?: string;
  capsuleColor?: string;
}

export const EyeOutlineScene: React.FC<EyeOutlineSceneProps> = ({
  textA,
  textB,
  switchFrame = 45,
  startFrame = 0,
  drawDurationFrames = 40,
  borderColor,
  capsuleColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const theme = useTheme();
  const local = frame - startFrame;

  const resolvedBorderColor = borderColor ?? theme.colors.accent;
  const resolvedCapsuleColor = capsuleColor ?? theme.colors.primary;

  // Path drawing progress (interpolate stroke-dashoffset) using drawDurationFrames
  const drawProgress = interpolate(local, [0, drawDurationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  // Total path length estimation for dashoffset
  const pathLength = 3000;
  const dashoffset = interpolate(drawProgress, [0, 1], [pathLength, 0]);

  // Calculate coordinates relative to screen dimensions
  const centerX = width / 2;
  const centerY = height / 2;

  // Horizontal radius of the eye width
  const eyeHalfWidth = width * 0.38;
  const eyeHeightOffset = height * 0.12;

  // Eye path SVG data (customizable curves)
  // Left corner: centerX - eyeHalfWidth, Right corner: centerX + eyeHalfWidth
  const leftX = centerX - eyeHalfWidth;
  const rightX = centerX + eyeHalfWidth;

  const upperControlY = centerY - eyeHeightOffset * 2.2;
  const lowerControlY = centerY + eyeHeightOffset * 2.2;

  const eyePath = `
    M ${leftX} ${centerY} 
    C ${centerX - eyeHalfWidth * 0.4} ${upperControlY}, ${centerX + eyeHalfWidth * 0.4} ${upperControlY}, ${rightX} ${centerY}
    C ${centerX + eyeHalfWidth * 0.4} ${lowerControlY}, ${centerX - eyeHalfWidth * 0.4} ${lowerControlY}, ${leftX} ${centerY} Z
  `;

  // Pupil circle path (glowing ring)
  const pupilRadius = 140;
  const pupilPath = `
    M ${centerX} ${centerY - pupilRadius}
    A ${pupilRadius} ${pupilRadius} 0 1 0 ${centerX} ${centerY + pupilRadius}
    A ${pupilRadius} ${pupilRadius} 0 1 0 ${centerX} ${centerY - pupilRadius}
  `;

  // Determine active text based on switch frame
  const showTextB = textB && local >= switchFrame;
  const activeText = showTextB ? textB : textA;

  // Text transition spring (trigger when switching text)
  const textLocal = showTextB ? local - switchFrame : local - 15; // Delay pop-in initially

  const textSpring = spring({
    frame: textLocal,
    fps,
    config: { damping: 12 },
  });

  const textScale = interpolate(textSpring, [0, 1], [0.8, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {/* SVG Canvas for drawing the eye outline path */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <defs>
          <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme.colors.primary} />
            <stop offset="50%" stopColor={theme.colors.accent} />
            <stop offset="100%" stopColor={theme.colors.secondary} />
          </linearGradient>
        </defs>

        {/* Outer eye path outline */}
        <path
          d={eyePath}
          fill="none"
          stroke="url(#eyeGradient)"
          strokeWidth="3.5"
          strokeDasharray={pathLength}
          strokeDashoffset={dashoffset}
          style={{
            filter: `drop-shadow(0 0 15px ${theme.colors.accent}44)`,
          }}
        />

        {/* Pupil circle path */}
        <path
          d={pupilPath}
          fill="none"
          stroke={resolvedBorderColor}
          strokeWidth="2.5"
          strokeDasharray={pathLength}
          strokeDashoffset={dashoffset}
          style={{
            filter: `drop-shadow(0 0 10px ${resolvedBorderColor}55)`,
          }}
        />
      </svg>

      {/* Centered Capsule for Text display inside Pupil */}
      {local >= 12 && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: "12px 36px",
              borderRadius: 50,
              background: theme.colors.surface,
              border: `2px solid ${resolvedCapsuleColor}`,
              boxShadow: `0 0 15px ${resolvedCapsuleColor}44`,
              transform: `scale(${textScale})`,
              opacity: textOpacity,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              willChange: "transform, opacity",
            }}
          >
            <span
              style={{
                fontFamily: theme.resolvedFonts.heading,
                fontSize: 32,
                fontWeight: 700,
                color: theme.colors.text,
                letterSpacing: 2,
                textAlign: "center",
              }}
            >
              {activeText}
            </span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";

interface TypewriterProProps {
  /** Lines typed in sequence. */
  lines: string[];
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  backgroundColor?: string;
  /** Characters revealed per frame. Default 0.6 */
  charsPerFrame?: number;
  /** Frames to pause between lines. Default 12 */
  linePause?: number;
  cursorColor?: string;
  startFrame?: number;
  /** Monospace "code editor" look. Default true */
  mono?: boolean;
  align?: "left" | "center";
}

/**
 * TypewriterPro — realistic typewriter that types each line in sequence with a
 * blinking caret. Monospace by default for a terminal / code feel.
 */
export const TypewriterPro: React.FC<TypewriterProProps> = ({
  lines,
  fontSize = 56,
  fontWeight = 500,
  color,
  backgroundColor,
  charsPerFrame = 0.6,
  linePause = 12,
  cursorColor,
  startFrame = 6,
  mono = true,
  align = "left",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const textColor = color ?? theme.colors.text;
  const caretColor = cursorColor ?? theme.colors.primary;

  // Build the per-line schedule: how many chars are visible at this frame, and
  // which line currently holds the caret.
  const state = useMemo(() => {
    let cursor = startFrame;
    return lines.map((line) => {
      const typeStart = cursor;
      const typeDuration = Math.ceil(line.length / charsPerFrame);
      cursor = typeStart + typeDuration + linePause;
      return { line, typeStart, typeDuration };
    });
  }, [lines, startFrame, charsPerFrame, linePause]);

  // Active line = the last one that has started typing.
  let activeIndex = 0;
  for (let i = 0; i < state.length; i++) {
    if (frame >= state[i].typeStart) activeIndex = i;
  }

  const caretOn = Math.floor(frame / 16) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backgroundColor ?? theme.colors.background,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        justifyContent: "center",
        padding: "0 110px",
        gap: fontSize * 0.35,
      }}
    >
      {state.map((s, i) => {
        if (frame < s.typeStart) return null;
        const typed = Math.floor(
          interpolate(
            frame - s.typeStart,
            [0, s.typeDuration],
            [0, s.line.length],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        );
        const visible = s.line.slice(0, typed);
        const isActive = i === activeIndex;
        const lineDone = typed >= s.line.length;
        const showCaret = isActive && (!lineDone || caretOn);

        return (
          <div
            key={`tw-${i}`}
            style={{
              fontFamily: mono ? theme.resolvedFonts.mono : theme.resolvedFonts.heading,
              fontSize,
              fontWeight,
              color: textColor,
              lineHeight: 1.3,
              whiteSpace: "pre-wrap",
              textAlign: align,
            }}
          >
            {visible}
            <span
              style={{
                display: "inline-block",
                width: fontSize * 0.08,
                height: fontSize * 0.92,
                marginLeft: 4,
                verticalAlign: "text-bottom",
                backgroundColor: caretColor,
                opacity: showCaret ? 1 : 0,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

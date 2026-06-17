import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { useTheme } from "../theme/ThemeProvider";

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

interface DecryptTextProps {
  text: string;
  subtitle?: string;
  startFrame?: number;
  scrambleDurationFrames?: number;
  charStagger?: number;
  fontSize?: number;
  color?: string;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
}

/**
 * DecryptText — each character cycles through random glyphs before
 * resolving to its real value, with advanced sequential, reverse, 
 * or centered reveal options, fully deterministic.
 */
export const DecryptText: React.FC<DecryptTextProps> = ({
  text,
  subtitle,
  startFrame = 0,
  scrambleDurationFrames = 20,
  charStagger = 2,
  fontSize = 72,
  color,
  sequential = true,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = DEFAULT_CHARSET,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const local = frame - startFrame;

  const chars = useMemo(() => text.split(""), [text]);
  const resolvedColor = color ?? theme.colors.text;

  // Filter or select characters available for scramble
  const availableChars = useMemo(() => {
    if (useOriginalCharsOnly) {
      const unique = Array.from(new Set(text.split(""))).filter((c) => c !== " ");
      return unique.length > 0 ? unique.join("") : DEFAULT_CHARSET;
    }
    return characters;
  }, [useOriginalCharsOnly, text, characters]);

  // Compute character decrypt start frames based on reveal direction
  const charStartFrames = useMemo(() => {
    const len = chars.length;
    const starts = new Array(len).fill(0);
    
    if (!sequential) {
      return starts; // All characters decrypt simultaneously at 0
    }

    if (revealDirection === "start") {
      for (let i = 0; i < len; i++) {
        starts[i] = i * charStagger;
      }
    } else if (revealDirection === "end") {
      for (let i = 0; i < len; i++) {
        starts[i] = (len - 1 - i) * charStagger;
      }
    } else if (revealDirection === "center") {
      const middle = Math.floor(len / 2);
      // For center, index offsets are computed outward
      for (let i = 0; i < len; i++) {
        starts[i] = Math.abs(i - middle) * charStagger * 1.5;
      }
    }
    return starts;
  }, [chars.length, sequential, revealDirection, charStagger]);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          fontFamily: theme.resolvedFonts.mono,
          fontSize,
          fontWeight: 700,
          color: resolvedColor,
          maxWidth: "85%",
        }}
      >
        {chars.map((char, i) => {
          if (char === " ") {
            return <span key={i} style={{ width: fontSize * 0.3 }} />;
          }

          const charStart = charStartFrames[i];
          const charLocal = local - charStart;

          // Before start frame: hide character (opacity 0)
          if (charLocal < 0) {
            return (
              <span key={i} style={{ opacity: 0 }}>
                {char}
              </span>
            );
          }

          // After scramble duration: display resolved character
          if (charLocal >= scrambleDurationFrames) {
            return <span key={i}>{char}</span>;
          }

          // During scramble: choose a deterministic random glyph based on seed
          const tick = Math.floor(charLocal / 2);
          const glyphIndex = Math.floor(
            random(`decrypt-${i}-${tick}`) * availableChars.length
          );

          return (
            <span key={i} style={{ color: theme.colors.primary }}>
              {availableChars[glyphIndex]}
            </span>
          );
        })}
      </div>
      {subtitle && (
        <div
          style={{
            color: theme.colors.mutedText,
            fontFamily: theme.resolvedFonts.body,
            fontSize: 24,
            marginTop: 8,
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { SPRING_PRESETS } from "../animation/springs";

interface CommandResult {
  label: string;
  icon?: string;
  hint?: string;
}

interface CommandPaletteProps {
  /** Query typed into the palette. */
  query?: string;
  placeholder?: string;
  results: CommandResult[];
  /** Index of the highlighted result. Default 0 */
  activeIndex?: number;
  accentColor?: string;
  backgroundColor?: string;
  startFrame?: number;
  /** Chars typed per frame. Default 0.7 */
  typeSpeed?: number;
}

/**
 * CommandPalette — a ⌘K command palette: query types in, results slide up and
 * one row highlights. Product-agnostic; themed to the user's brand. Great for
 * "do anything fast" / AI-action product beats.
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({
  query = "",
  placeholder = "Type a command or search…",
  results,
  activeIndex = 0,
  accentColor,
  backgroundColor,
  startFrame = 6,
  typeSpeed = 0.7,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();
  const accent = accentColor ?? theme.colors.primary;

  const s = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_PRESETS.snappy,
    durationInFrames: 26,
  });
  const enterY = interpolate(s, [0, 1], [30, 0]);
  const modalOpacity = interpolate(frame - startFrame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Type the query.
  const typeStart = startFrame + 8;
  const typed = query.slice(
    0,
    Math.floor(
      interpolate(frame - typeStart, [0, query.length / typeSpeed], [0, query.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
  );
  const caretOn = Math.floor(frame / 16) % 2 === 0;
  const resultsStart = typeStart + query.length / typeSpeed + 4;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backgroundColor ?? theme.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* dim backdrop */}
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.35)", opacity: modalOpacity }} />

      <div
        style={{
          width: 720,
          maxWidth: "82%",
          transform: `translateY(${enterY}px)`,
          opacity: modalOpacity,
          backgroundColor: theme.colors.surface,
          borderRadius: 18,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: "0 40px 90px rgba(0,0,0,0.45)",
          overflow: "hidden",
          willChange: "transform, opacity",
        }}
      >
        {/* Search input row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "22px 24px",
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <span style={{ fontSize: 22, opacity: 0.6 }}>🔍</span>
          <span
            style={{
              fontFamily: theme.resolvedFonts.body,
              fontSize: 24,
              color: typed ? theme.colors.text : theme.colors.mutedText,
            }}
          >
            {typed || placeholder}
            {caretOn && (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 24,
                  marginLeft: 2,
                  backgroundColor: accent,
                  verticalAlign: "text-bottom",
                }}
              />
            )}
          </span>
        </div>

        {/* Results */}
        <div style={{ padding: 10 }}>
          {results.map((r, i) => {
            const rStart = resultsStart + i * 5;
            const rs = interpolate(frame - rStart, [0, 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const active = i === activeIndex;
            return (
              <div
                key={`cmd-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 12,
                  backgroundColor: active ? `${accent}22` : "transparent",
                  border: active ? `1px solid ${accent}66` : "1px solid transparent",
                  opacity: rs,
                  transform: `translateY(${interpolate(rs, [0, 1], [8, 0])}px)`,
                  willChange: "transform, opacity",
                }}
              >
                <span style={{ fontSize: 22 }}>{r.icon ?? "⚡"}</span>
                <span
                  style={{
                    flex: 1,
                    fontFamily: theme.resolvedFonts.body,
                    fontSize: 19,
                    fontWeight: active ? 600 : 500,
                    color: theme.colors.text,
                  }}
                >
                  {r.label}
                </span>
                {r.hint && (
                  <span
                    style={{
                      fontFamily: theme.resolvedFonts.mono,
                      fontSize: 13,
                      color: theme.colors.mutedText,
                      backgroundColor: theme.colors.background,
                      padding: "4px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {r.hint}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

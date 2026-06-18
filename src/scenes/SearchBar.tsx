import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";

interface SearchBarProps {
  /** Query typed into the bar. */
  query?: string;
  placeholder?: string;
  /** Suggestion rows that drop down as the query types. */
  suggestions?: string[];
  accentColor?: string;
  backgroundColor?: string;
  /** Optional heading above the bar. */
  heading?: string;
  startFrame?: number;
  typeSpeed?: number;
}

/**
 * SearchBar — a prominent search field that types a query and drops a list of
 * suggestions. Product-agnostic hero beat ("search anything").
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  query = "",
  placeholder = "Search anything…",
  suggestions = [],
  accentColor,
  backgroundColor,
  heading,
  startFrame = 6,
  typeSpeed = 0.7,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const accent = accentColor ?? theme.colors.primary;

  const barOpacity = interpolate(frame - startFrame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barY = interpolate(frame - startFrame, [0, 18], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const typeStart = startFrame + 10;
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
  const sugStart = typeStart + query.length / typeSpeed + 4;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backgroundColor ?? theme.colors.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
        padding: "0 80px",
      }}
    >
      {heading && (
        <div
          style={{
            opacity: barOpacity,
            fontFamily: theme.resolvedFonts.heading,
            fontSize: 44,
            fontWeight: 700,
            color: theme.colors.text,
            textAlign: "center",
          }}
        >
          {heading}
        </div>
      )}

      <div style={{ width: 760, maxWidth: "90%" }}>
        {/* Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "20px 26px",
            borderRadius: 999,
            backgroundColor: theme.colors.surface,
            border: `2px solid ${accent}`,
            boxShadow: `0 12px 40px rgba(0,0,0,0.18), 0 0 0 6px ${accent}1A`,
            transform: `translateY(${barY}px)`,
            opacity: barOpacity,
            willChange: "transform, opacity",
          }}
        >
          <span style={{ fontSize: 26, opacity: 0.6 }}>🔍</span>
          <span
            style={{
              flex: 1,
              fontFamily: theme.resolvedFonts.body,
              fontSize: 26,
              color: typed ? theme.colors.text : theme.colors.mutedText,
            }}
          >
            {typed || placeholder}
            {caretOn && (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 26,
                  marginLeft: 2,
                  backgroundColor: accent,
                  verticalAlign: "text-bottom",
                }}
              />
            )}
          </span>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div
            style={{
              marginTop: 14,
              borderRadius: 18,
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              overflow: "hidden",
              boxShadow: "0 16px 40px rgba(0,0,0,0.16)",
            }}
          >
            {suggestions.map((sug, i) => {
              const sStart = sugStart + i * 5;
              const so = interpolate(frame - sStart, [0, 12], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={`sug-${i}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "16px 24px",
                    borderTop: i === 0 ? "none" : `1px solid ${theme.colors.border}`,
                    opacity: so,
                    transform: `translateY(${interpolate(so, [0, 1], [6, 0])}px)`,
                    willChange: "transform, opacity",
                  }}
                >
                  <span style={{ fontSize: 18, opacity: 0.5 }}>↗</span>
                  <span
                    style={{
                      fontFamily: theme.resolvedFonts.body,
                      fontSize: 20,
                      color: theme.colors.text,
                    }}
                  >
                    {sug}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

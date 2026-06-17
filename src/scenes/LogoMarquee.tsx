import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useTheme } from "../theme/ThemeProvider";

interface LogoMarqueeProps {
  /** Company names, words, or short labels to scroll. */
  items: string[];
  heading?: string;
  speed?: number;
  itemGap?: number;
  fontSize?: number;
  direction?: "left" | "right";
}

/**
 * LogoMarquee — an infinitely-scrolling strip of logos/words (e.g. a
 * "trusted by" section). The item list is tripled and the track
 * position is `(frame * speed) % trackWidth`, so the loop is seamless
 * and fully frame-driven (no CSS animation).
 */
export const LogoMarquee: React.FC<LogoMarqueeProps> = ({
  items,
  heading,
  speed = 2,
  itemGap = 80,
  fontSize = 36,
  direction = "left",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const repeated = [...items, ...items, ...items];
  const itemWidthEstimate = fontSize * 6 + itemGap;
  const trackWidth = items.length * itemWidthEstimate;
  const offset = ((frame * speed) % trackWidth) * (direction === "left" ? -1 : 1);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {heading && (
        <div
          style={{
            position: "absolute",
            top: 100,
            width: "100%",
            textAlign: "center",
            color: theme.colors.mutedText,
            fontFamily: theme.resolvedFonts.body,
            fontSize: 24,
          }}
        >
          {heading}
        </div>
      )}
      <div style={{ overflow: "hidden", width: "100%" }}>
        <div
          style={{
            display: "flex",
            gap: itemGap,
            transform: `translateX(${offset}px)`,
            whiteSpace: "nowrap",
          }}
        >
          {repeated.map((item, i) => (
            <div
              key={i}
              style={{
                fontFamily: theme.resolvedFonts.heading,
                fontSize,
                fontWeight: 700,
                color: theme.colors.mutedText,
                opacity: 0.7,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

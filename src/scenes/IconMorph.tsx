import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { morphPath } from "../utils/pathMorph";

interface IconMorphSegment {
  segmentIndex: number;
  localT: number;
}

function resolveSegment(
  elapsed: number,
  iconCount: number,
  holdFrames: number,
  morphFrames: number
): IconMorphSegment {
  if (iconCount <= 1 || elapsed <= 0) return { segmentIndex: 0, localT: 0 };

  let remaining = elapsed;
  for (let i = 0; i < iconCount - 1; i++) {
    if (remaining < holdFrames) return { segmentIndex: i, localT: 0 };
    remaining -= holdFrames;

    if (remaining < morphFrames) {
      return { segmentIndex: i, localT: remaining / morphFrames };
    }
    remaining -= morphFrames;
  }

  return { segmentIndex: iconCount - 2, localT: 1 };
}

interface IconMorphProps {
  /** SVG path `d` strings, all sharing the same viewBox, morphed in sequence. */
  icons: string[];
  labels?: string[];
  startFrame?: number;
  holdDurationFrames?: number;
  morphDurationFrames?: number;
  size?: number;
  color?: string;
  viewBox?: string;
}

/**
 * IconMorph — sequentially morphs between SVG icon shapes using
 * flubber, the shape-layer-path-keyframe equivalent of After Effects.
 */
export const IconMorph: React.FC<IconMorphProps> = ({
  icons,
  labels,
  startFrame = 0,
  holdDurationFrames = 40,
  morphDurationFrames = 20,
  size = 200,
  color,
  viewBox = "0 0 24 24",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const elapsed = frame - startFrame;

  const { segmentIndex, localT } = useMemo(
    () => resolveSegment(elapsed, icons.length, holdDurationFrames, morphDurationFrames),
    [elapsed, icons.length, holdDurationFrames, morphDurationFrames]
  );

  const isMorphing = localT > 0 && localT < 1 && segmentIndex < icons.length - 1;
  const currentPath = icons.length === 0
    ? ""
    : isMorphing
      ? morphPath(icons[segmentIndex], icons[segmentIndex + 1], localT)
      : icons[Math.min(segmentIndex + (localT >= 1 ? 1 : 0), icons.length - 1)];

  const iconColor = color ?? theme.colors.primary;
  const activeLabel = labels?.[segmentIndex];
  const nextLabel = labels?.[segmentIndex + 1];

  return (
    <AbsoluteFill
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}
    >
      <svg width={size} height={size} viewBox={viewBox}>
        <path d={currentPath} fill={iconColor} />
      </svg>

      {labels && (
        <div style={{ position: "relative", height: 48 }}>
          {activeLabel && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                opacity: isMorphing ? 1 - localT : 1,
                color: theme.colors.text,
                fontFamily: theme.resolvedFonts.body,
                fontSize: 28,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {activeLabel}
            </div>
          )}
          {isMorphing && nextLabel && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                opacity: localT,
                color: theme.colors.text,
                fontFamily: theme.resolvedFonts.body,
                fontSize: 28,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {nextLabel}
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

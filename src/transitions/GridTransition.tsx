/**
 * GridTransition — the scene is revealed behind a grid of cover tiles that pop
 * away in a diagonal cascade (mosaic wipe).
 *
 * params: rows (4), cols (7), color (theme background), stagger (3)
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { type TransitionComponentProps, readNumber, readString } from "./util";

export const GridTransition: React.FC<TransitionComponentProps> = ({
  frame,
  durationFrames,
  params,
  children,
}) => {
  const theme = useTheme();
  if (frame >= durationFrames) return <AbsoluteFill>{children}</AbsoluteFill>;

  const rows = Math.max(1, Math.round(readNumber(params, "rows", 4)));
  const cols = Math.max(1, Math.round(readNumber(params, "cols", 7)));
  const color = readString(params, "color", theme.colors.background);
  const stagger = readNumber(params, "stagger", 3);

  // Each tile pops away over ~10 frames, offset by its diagonal index.
  const cellDur = 10;
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const delay = (r + c) * stagger;
      const local = frame - delay;
      const out = interpolate(local, [0, cellDur], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      if (out >= 1) continue; // tile gone — reveal scene
      cells.push(
        <div
          key={`cell-${r}-${c}`}
          style={{
            position: "absolute",
            left: `${(c / cols) * 100}%`,
            top: `${(r / rows) * 100}%`,
            width: `${100 / cols + 0.2}%`,
            height: `${100 / rows + 0.2}%`,
            backgroundColor: color,
            opacity: 1 - out,
            transform: `scale(${1 - out * 0.3})`,
            willChange: "opacity, transform",
          }}
        />,
      );
    }
  }

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ pointerEvents: "none" }}>{cells}</AbsoluteFill>
    </AbsoluteFill>
  );
};

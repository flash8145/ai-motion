import React, { useRef, useEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../theme/ThemeProvider";

export interface SparkTrigger {
  frame: number;
  x: number; // In pixels, e.g. 960 for center
  y: number; // In pixels, e.g. 540 for center
}

interface ClickSparkProps {
  triggers: SparkTrigger[];
  sparkColor?: string;
  sparkSize?: number; // Initial length of spark line
  sparkRadius?: number; // Maximum radius of expansion
  sparkCount?: number; // Number of sparks radiating
  durationFrames?: number; // Lifespan of each burst
}

export const ClickSpark: React.FC<ClickSparkProps> = ({
  triggers,
  sparkColor,
  sparkSize = 15,
  sparkRadius = 80,
  sparkCount = 10,
  durationFrames = 15,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const resolvedColor = sparkColor ?? theme.colors.primary;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas for this frame
    ctx.clearRect(0, 0, width, height);

    // Filter triggers that are active on the current frame
    const activeBursts = triggers.filter(
      (t) => frame >= t.frame && frame < t.frame + durationFrames
    );

    activeBursts.forEach((burst) => {
      const elapsed = frame - burst.frame;
      const progress = elapsed / durationFrames;
      
      // Quadratic ease-out for speed decay
      const eased = progress * (2 - progress);

      const distance = eased * sparkRadius;
      const currentLineLength = sparkSize * (1 - eased);

      ctx.strokeStyle = resolvedColor;
      ctx.lineWidth = 2.5;

      for (let i = 0; i < sparkCount; i++) {
        const angle = (2 * Math.PI * i) / sparkCount;

        // Start point of the spark line
        const x1 = burst.x + distance * Math.cos(angle);
        const y1 = burst.y + distance * Math.sin(angle);

        // End point of the spark line
        const x2 = burst.x + (distance + currentLineLength) * Math.cos(angle);
        const y2 = burst.y + (distance + currentLineLength) * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    });
  }, [frame, triggers, width, height, sparkSize, sparkRadius, sparkCount, durationFrames, resolvedColor]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 50 }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

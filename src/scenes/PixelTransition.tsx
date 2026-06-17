import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

interface PixelTransitionProps {
  SceneA: React.ReactNode;
  SceneB: React.ReactNode;
  gridSize?: number; // Number of columns/rows (e.g. 10x10)
  durationFrames?: number;
  startFrame?: number;
  seed?: number;
}

export const PixelTransition: React.FC<PixelTransitionProps> = ({
  SceneA,
  SceneB,
  gridSize = 10,
  durationFrames = 20,
  startFrame = 0,
  seed = 42,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const local = frame - startFrame;

  const totalBlocks = gridSize * gridSize;

  // Calculate block dimensions
  const blockWidth = width / gridSize;
  const blockHeight = height / gridSize;

  // Seeded random number generator
  const seededRandom = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  // Compute a deterministic shuffled list of grid indices on render
  const shuffledIndices = useMemo(() => {
    const arr = Array.from({ length: totalBlocks }, (_, i) => i);
    let m = totalBlocks;
    let t: number;
    let idx: number;

    while (m) {
      idx = Math.floor(seededRandom(seed + m) * m--);
      t = arr[m];
      arr[m] = arr[idx];
      arr[idx] = t;
    }

    // Map each original index to its position (rank) in the shuffled array
    const ranks = new Array(totalBlocks);
    for (let i = 0; i < totalBlocks; i++) {
      ranks[arr[i]] = i;
    }
    return ranks;
  }, [totalBlocks, seed]);

  // Compute reveal progress
  const progress = Math.min(1, Math.max(0, local / durationFrames));
  const activeThreshold = Math.floor(progress * totalBlocks);

  return (
    <AbsoluteFill>
      {/* Base layer: Scene A */}
      <AbsoluteFill style={{ zIndex: 1 }}>{SceneA}</AbsoluteFill>

      {/* Overlay layer: Scene B pixel blocks */}
      <AbsoluteFill style={{ zIndex: 2, pointerEvents: "none" }}>
        {Array.from({ length: totalBlocks }).map((_, idx) => {
          const rank = shuffledIndices[idx];

          // If the block rank is higher than our threshold, keep it hidden
          if (rank > activeThreshold) return null;

          const row = Math.floor(idx / gridSize);
          const col = idx % gridSize;

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                top: row * blockHeight,
                left: col * blockWidth,
                width: blockWidth + 0.5, // 0.5px overlap to prevent sub-pixel seams
                height: blockHeight + 0.5,
                overflow: "hidden",
              }}
            >
              {/* Render Scene B internally, offset in the opposite direction to align it */}
              <div
                style={{
                  position: "absolute",
                  top: -row * blockHeight,
                  left: -col * blockWidth,
                  width,
                  height,
                }}
              >
                {SceneB}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

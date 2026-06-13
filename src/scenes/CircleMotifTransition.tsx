import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { SPRING_PRESETS } from "../animation/springs";
import { EASINGS } from "../animation/easings";

interface CircleMotifTransitionProps {
  startFrame?: number;
  circleStagger?: number;
}

export const CircleMotifTransition: React.FC<CircleMotifTransitionProps> = ({
  startFrame = 10,
  circleStagger = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CIRCLE_DIAMETER = 80;
  const CIRCLE_RADIUS = CIRCLE_DIAMETER / 2;
  const VERTICAL_SPACING = 100;
  const STROKE_WIDTH = 3;
  const CENTER_DOT_RADIUS = 6;
  const FLOAT_AMPLITUDE = 5;
  const FLOAT_ALL_VISIBLE_FRAME = 50;

  const circles = [
    { id: "solid", offsetY: -VERTICAL_SPACING },
    { id: "donut", offsetY: 0 },
    { id: "hollow", offsetY: VERTICAL_SPACING },
  ];

  const getCircleAnimation = (index: number) => {
    const circleStart = startFrame + index * circleStagger;

    const scale = spring({
      frame: frame - circleStart,
      fps,
      config: SPRING_PRESETS.gentle,
    });

    const opacity = interpolate(
      frame - circleStart,
      [0, 15],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(...EASINGS.easeOutQuart),
      },
    );

    // Subtle floating animation after all circles are visible
    const floatProgress = interpolate(
      frame,
      [FLOAT_ALL_VISIBLE_FRAME, FLOAT_ALL_VISIBLE_FRAME + 1],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );

    // Each circle floats at a different phase offset
    const phaseOffset = index * ((Math.PI * 2) / 3);
    const floatY =
      floatProgress * FLOAT_AMPLITUDE * Math.sin(frame * 0.05 + phaseOffset);

    return { scale, opacity, floatY };
  };

  return (
    <AbsoluteFill>
      <GradientBackground />
      <NoiseTexture />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {circles.map((circle, index) => {
          const { scale, opacity, floatY } = getCircleAnimation(index);

          return (
            <div
              key={circle.id}
              style={{
                position: "absolute",
                transform: `translateY(${circle.offsetY + floatY}px) scale(${scale})`,
                opacity,
                willChange: "transform, opacity",
              }}
            >
              <svg
                width={CIRCLE_DIAMETER}
                height={CIRCLE_DIAMETER}
                viewBox={`0 0 ${CIRCLE_DIAMETER} ${CIRCLE_DIAMETER}`}
              >
                {/* Top circle: solid filled white */}
                {circle.id === "solid" && (
                  <circle
                    cx={CIRCLE_RADIUS}
                    cy={CIRCLE_RADIUS}
                    r={CIRCLE_RADIUS}
                    fill="#FFFFFF"
                  />
                )}

                {/* Middle circle: donut ring + center dot */}
                {circle.id === "donut" && (
                  <>
                    <circle
                      cx={CIRCLE_RADIUS}
                      cy={CIRCLE_RADIUS}
                      r={CIRCLE_RADIUS - STROKE_WIDTH / 2}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth={STROKE_WIDTH}
                    />
                    <circle
                      cx={CIRCLE_RADIUS}
                      cy={CIRCLE_RADIUS}
                      r={CENTER_DOT_RADIUS}
                      fill="#FFFFFF"
                    />
                  </>
                )}

                {/* Bottom circle: hollow outline ring */}
                {circle.id === "hollow" && (
                  <circle
                    cx={CIRCLE_RADIUS}
                    cy={CIRCLE_RADIUS}
                    r={CIRCLE_RADIUS - STROKE_WIDTH / 2}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={STROKE_WIDTH}
                  />
                )}
              </svg>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

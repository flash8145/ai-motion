import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { StandardLighting } from "../components/three/StandardLighting";
import { useTheme } from "../theme/ThemeProvider";
import { SPRING_PRESETS } from "../animation/springs";

interface Product3DRevealProps {
  shape?: "rounded-box" | "cylinder" | "sphere";
  color?: string;
  title?: string;
  subtitle?: string;
  startFrame?: number;
  titleStartFrame?: number;
  /** Degrees per frame of continuous spin after the entrance settles. */
  rotationSpeed?: number;
  cameraDistance?: number;
}

/**
 * Product3DReveal — a 3D product primitive (rounded box / cylinder /
 * sphere standing in for a device, can, or generic product) spring-flies
 * into frame and settles into a slow continuous spin, with a 2D
 * title/subtitle caption layered on top.
 */
export const Product3DReveal: React.FC<Product3DRevealProps> = ({
  shape = "rounded-box",
  color,
  title,
  subtitle,
  startFrame = 0,
  titleStartFrame,
  rotationSpeed = 0.15,
  cameraDistance = 6,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const theme = useTheme();

  const reveal = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 50,
  });

  const scale = interpolate(reveal, [0, 1], [0.2, 1]);
  const entranceRotation = interpolate(reveal, [0, 1], [Math.PI, 0]);
  const continuousSpin =
    Math.max(0, frame - startFrame - 50) * rotationSpeed * (Math.PI / 180);
  const rotationY = entranceRotation + continuousSpin;

  const meshOpacity = interpolate(frame - startFrame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const productColor = color ?? theme.colors.primary;
  const resolvedTitleStart = titleStartFrame ?? startFrame + 35;

  const titleOpacity = interpolate(
    frame - resolvedTitleStart,
    [0, 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const titleY = interpolate(frame - resolvedTitleStart, [0, 15], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <ThreeCanvas width={width} height={height} gl={{ alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, cameraDistance]} fov={45} />
        <StandardLighting />
        <group scale={scale} rotation={[0.1, rotationY, 0]}>
          {shape === "rounded-box" && (
            <RoundedBox args={[2.2, 2.2, 0.25]} radius={0.18} smoothness={4}>
              <meshStandardMaterial
                color={productColor}
                metalness={0.6}
                roughness={0.25}
                opacity={meshOpacity}
                transparent
              />
            </RoundedBox>
          )}
          {shape === "cylinder" && (
            <mesh>
              <cylinderGeometry args={[1.2, 1.2, 2.2, 48]} />
              <meshStandardMaterial
                color={productColor}
                metalness={0.5}
                roughness={0.3}
                opacity={meshOpacity}
                transparent
              />
            </mesh>
          )}
          {shape === "sphere" && (
            <mesh>
              <sphereGeometry args={[1.4, 64, 64]} />
              <meshStandardMaterial
                color={productColor}
                metalness={0.4}
                roughness={0.2}
                opacity={meshOpacity}
                transparent
              />
            </mesh>
          )}
        </group>
      </ThreeCanvas>

      {(title || subtitle) && (
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 100 }}
        >
          <div
            style={{
              textAlign: "center",
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
            }}
          >
            {title && (
              <div
                style={{
                  fontFamily: theme.resolvedFonts.heading,
                  fontSize: 48,
                  fontWeight: 700,
                  color: theme.colors.text,
                }}
              >
                {title}
              </div>
            )}
            {subtitle && (
              <div
                style={{
                  fontFamily: theme.resolvedFonts.body,
                  fontSize: 20,
                  color: theme.colors.mutedText,
                  marginTop: 8,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

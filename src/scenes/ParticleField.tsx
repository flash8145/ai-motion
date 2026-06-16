import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { PerspectiveCamera } from "@react-three/drei";
import { useTheme } from "../theme/ThemeProvider";

const VERTEX_SHADER = `
  uniform float uTime;
  uniform float uSpeed;
  attribute float aSeed;
  void main() {
    vec3 pos = position;
    pos.y += sin(uTime * uSpeed + aSeed * 6.2831) * 0.4;
    pos.x += cos(uTime * uSpeed * 0.7 + aSeed * 6.2831) * 0.3;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 6.0 * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 uColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, alpha);
  }
`;

interface ParticleFieldProps {
  count?: number;
  color?: string;
  spread?: number;
  speed?: number;
  background?: "theme" | "transparent" | string;
}

/**
 * ParticleField — ambient VFX particle background driven by a custom
 * GLSL shader. The shader's uTime uniform is mutated directly from
 * useCurrentFrame()/fps every render (never via useFrame), keeping
 * the animation fully deterministic for Remotion's frame-by-frame render.
 */
export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 400,
  color,
  spread = 8,
  speed = 0.6,
  background = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const theme = useTheme();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (random(`particle-x-${i}`) - 0.5) * spread * 2;
      positions[i * 3 + 1] = (random(`particle-y-${i}`) - 0.5) * spread * 2;
      positions[i * 3 + 2] = (random(`particle-z-${i}`) - 0.5) * spread * 2;
      seeds[i] = random(`particle-seed-${i}`) * 10;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, [count, spread]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uColor: { value: new THREE.Color(color ?? theme.colors.primary) },
    }),
    [speed, color, theme.colors.primary]
  );

  if (materialRef.current) {
    materialRef.current.uniforms.uTime.value = frame / fps;
  }

  const backgroundColor =
    background === "theme"
      ? theme.colors.background
      : background === "transparent"
        ? "transparent"
        : background;

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <ThreeCanvas width={width} height={height} gl={{ alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <points geometry={geometry}>
          <shaderMaterial
            ref={materialRef}
            uniforms={uniforms}
            vertexShader={VERTEX_SHADER}
            fragmentShader={FRAGMENT_SHADER}
            transparent
            depthWrite={false}
          />
        </points>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { OrthographicCamera } from "@react-three/drei";
import { useTheme } from "../theme/ThemeProvider";
import { AnimatedText } from "../components/primitives/AnimatedText";

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADERS: Record<string, string> = {
  "gradient-flow": `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    void main() {
      float wave = sin((vUv.x + vUv.y) * 3.0 + uTime) * 0.5 + 0.5;
      gl_FragColor = vec4(mix(uColorA, uColorB, wave), 1.0);
    }
  `,
  "light-rays": `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    void main() {
      vec2 toPixel = vUv - vec2(0.5);
      float angle = atan(toPixel.y, toPixel.x);
      float dist = length(toPixel);
      float rays = sin(angle * 12.0 + uTime * 0.5) * 0.5 + 0.5;
      float falloff = smoothstep(0.9, 0.0, dist);
      gl_FragColor = vec4(mix(uColorA, uColorB, rays * falloff), 1.0);
    }
  `,
  "grain-noise": `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    float hash(vec2 p, float seed) {
      return fract(sin(dot(p, vec2(127.1, 311.7)) + seed) * 43758.5453);
    }
    void main() {
      float n = hash(floor(vUv * 400.0), uTime);
      gl_FragColor = vec4(mix(uColorA, uColorB, n), 1.0);
    }
  `,
};

interface ShaderBackground3DProps {
  variant?: "gradient-flow" | "light-rays" | "grain-noise";
  colorA?: string;
  colorB?: string;
  speed?: number;
  heading?: string;
  headingStart?: number;
}

/**
 * ShaderBackground3D — full-bleed animated GLSL background plane.
 * The uTime uniform is mutated directly from useCurrentFrame()/fps
 * every render (never via useFrame), keeping the shader deterministic.
 */
export const ShaderBackground3D: React.FC<ShaderBackground3DProps> = ({
  variant = "gradient-flow",
  colorA,
  colorB,
  speed = 1,
  heading,
  headingStart = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const theme = useTheme();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(colorA ?? theme.colors.background) },
      uColorB: { value: new THREE.Color(colorB ?? theme.colors.primary) },
    }),
    [colorA, colorB, theme.colors.background, theme.colors.primary]
  );

  if (materialRef.current) {
    materialRef.current.uniforms.uTime.value = (frame / fps) * speed;
  }

  return (
    <AbsoluteFill>
      <ThreeCanvas width={width} height={height}>
        <OrthographicCamera
          makeDefault
          left={-width / 2}
          right={width / 2}
          top={height / 2}
          bottom={-height / 2}
          near={0.1}
          far={10}
          position={[0, 0, 1]}
        />
        <mesh>
          <planeGeometry args={[width, height]} />
          <shaderMaterial
            ref={materialRef}
            uniforms={uniforms}
            vertexShader={VERTEX_SHADER}
            fragmentShader={FRAGMENT_SHADERS[variant]}
          />
        </mesh>
      </ThreeCanvas>

      {heading && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <AnimatedText text={heading} startFrame={headingStart} fontSize={56} fontWeight={700} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

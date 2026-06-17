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
  "aurora": `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    void main() {
      float wave1 = sin(vUv.x * 6.0 + uTime * 0.6) * 0.15;
      float wave2 = sin(vUv.x * 3.0 - uTime * 0.4) * 0.1;
      float band = smoothstep(0.0, 0.4, 1.0 - abs(vUv.y - 0.5 - wave1 - wave2) * 2.5);
      vec3 color = mix(uColorA, uColorB, vUv.y + wave1);
      gl_FragColor = vec4(color * band + uColorA * (1.0 - band) * 0.3, 1.0);
    }
  `,
  "metaballs": `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    float metaball(vec2 uv, vec2 center, float radius) {
      float d = distance(uv, center);
      return radius / (d * d + 0.0001);
    }
    void main() {
      vec2 uv = vUv;
      float field = 0.0;
      field += metaball(uv, vec2(0.5 + sin(uTime * 0.5) * 0.25, 0.5 + cos(uTime * 0.4) * 0.2), 0.02);
      field += metaball(uv, vec2(0.5 + cos(uTime * 0.3) * 0.3, 0.5 + sin(uTime * 0.6) * 0.25), 0.015);
      field += metaball(uv, vec2(0.5 + sin(uTime * 0.7 + 2.0) * 0.2, 0.5 + cos(uTime * 0.5 + 1.0) * 0.3), 0.018);
      float intensity = smoothstep(0.8, 1.4, field);
      vec3 color = mix(uColorA, uColorB, intensity);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  "liquid-chrome": `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      float time = uTime * 0.5;
      for (float i = 1.0; i < 6.0; i++) {
        uv.x += 0.3 / i * cos(i * 3.0 * uv.y + time);
        uv.y += 0.3 / i * cos(i * 3.0 * uv.x + time);
      }
      vec3 color = mix(uColorA, uColorB, abs(sin(time - uv.y - uv.x)));
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  "balatro": `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      float time = uTime * 0.2;
      float uv_len = length(uv);
      float angle = atan(uv.y, uv.x) + time - 2.0 * uv_len;
      uv = vec2(uv_len * cos(angle), uv_len * sin(angle)) * 15.0;
      
      vec2 uv2 = vec2(uv.x + uv.y);
      for(int i = 0; i < 4; i++) {
        uv2 += sin(max(uv.x, uv.y)) + uv;
        uv += 0.5 * vec2(
          cos(5.112 + 0.35 * uv2.y + time * 0.5),
          sin(uv2.x - 0.11 * time)
        );
        uv -= cos(uv.x + uv.y) - sin(uv.x * 0.7 - uv.y);
      }
      
      float paint_res = min(2.0, max(0.0, length(uv) * 0.035 * 1.5));
      float c1p = max(0.0, 1.0 - 1.5 * abs(1.0 - paint_res));
      float c2p = max(0.0, 1.0 - 1.5 * abs(paint_res));
      
      vec3 col = mix(uColorA, uColorB, c1p) + vec3(c2p * 0.1);
      gl_FragColor = vec4(col, 1.0);
    }
  `,
  "threads": `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    float lineFn(vec2 st, float p, float time) {
      float y = 0.5 + (p - 0.5) * 0.3 + (noise(vec2(time * 0.5, st.x * 3.0 + p * 2.0)) - 0.5) * 0.2;
      float thickness = 0.005 * (1.0 - p);
      return smoothstep(y - thickness - 0.005, y, st.y) * smoothstep(y + thickness + 0.005, y, st.y);
    }
    void main() {
      vec2 uv = vUv;
      float intensity = 0.0;
      for (int i = 0; i < 15; i++) {
        float p = float(i) / 15.0;
        intensity += lineFn(uv, p, uTime) * (1.0 - p);
      }
      vec3 col = mix(uColorA, uColorB, intensity);
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

interface ShaderBackground3DProps {
  variant?:
    | "gradient-flow"
    | "light-rays"
    | "grain-noise"
    | "aurora"
    | "metaballs"
    | "liquid-chrome"
    | "balatro"
    | "threads";
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

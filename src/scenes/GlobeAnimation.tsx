import React, { useMemo } from "react";
import * as THREE from "three";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { PerspectiveCamera } from "@react-three/drei";
import { StandardLighting } from "../components/three/StandardLighting";
import { useTheme } from "../theme/ThemeProvider";
import { AnimatedText } from "../components/primitives/AnimatedText";
import { SPRING_PRESETS } from "../animation/springs";

export interface GlobePin {
  lat: number;
  lng: number;
  showAtFrame?: number;
}

export interface GlobeArc {
  from: number;
  to: number;
}

interface GlobeAnimationProps {
  /** Pins are plotted by latitude/longitude on the globe's surface. */
  pins?: GlobePin[];
  /** Great-circle arcs connecting two pins, referenced by index into `pins`. */
  arcs?: GlobeArc[];
  rotationSpeed?: number;
  startFrame?: number;
  radius?: number;
  color?: string;
  heading?: string;
  headingStart?: number;
}

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

const Pin: React.FC<{
  position: THREE.Vector3;
  frame: number;
  fps: number;
  showAtFrame: number;
  color: string;
}> = ({ position, frame, fps, showAtFrame, color }) => {
  const pop = spring({
    frame: frame - showAtFrame,
    fps,
    config: SPRING_PRESETS.bouncy,
    durationInFrames: 20,
  });
  const scale = interpolate(pop, [0, 1], [0, 1]);

  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
    </mesh>
  );
};

const Arc: React.FC<{
  start: THREE.Vector3;
  end: THREE.Vector3;
  radius: number;
  color: string;
  opacity: number;
}> = ({ start, end, radius, color, opacity }) => {
  const positions = useMemo(() => {
    const mid = start
      .clone()
      .add(end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(radius * 1.35);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(32);
    const arr = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    return arr;
  }, [start, end, radius]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  );
};

/**
 * GlobeAnimation — a rotating wireframe globe with pop-in location
 * pins and fading great-circle connection arcs. Good for "global
 * reach" / "worldwide" explainer sections.
 */
export const GlobeAnimation: React.FC<GlobeAnimationProps> = ({
  pins = [],
  arcs = [],
  rotationSpeed = 0.1,
  startFrame = 0,
  radius = 2,
  color,
  heading,
  headingStart = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const theme = useTheme();

  const accent = color ?? theme.colors.primary;
  const rotationY = Math.max(0, frame - startFrame) * rotationSpeed * (Math.PI / 180);

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 40,
  });
  const scale = interpolate(entrance, [0, 1], [0.5, 1]);
  const opacity = interpolate(frame - startFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pinPositions = useMemo(
    () => pins.map((pin) => latLngToVector3(pin.lat, pin.lng, radius)),
    [pins, radius]
  );

  return (
    <AbsoluteFill>
      {heading && (
        <div style={{ position: "absolute", top: 80, width: "100%", textAlign: "center" }}>
          <AnimatedText text={heading} startFrame={headingStart} fontSize={56} fontWeight={700} />
        </div>
      )}

      <ThreeCanvas width={width} height={height} gl={{ alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, radius * 3.2]} fov={45} />
        <StandardLighting />
        <group scale={scale} rotation={[0.3, rotationY, 0]}>
          <mesh>
            <sphereGeometry args={[radius, 48, 48]} />
            <meshBasicMaterial color={accent} wireframe transparent opacity={opacity * 0.5} />
          </mesh>
          <mesh>
            <sphereGeometry args={[radius * 0.995, 48, 48]} />
            <meshStandardMaterial color={theme.colors.surface} transparent opacity={opacity * 0.4} />
          </mesh>

          {pins.map((pin, i) => (
            <Pin
              key={i}
              position={pinPositions[i]}
              frame={frame}
              fps={fps}
              showAtFrame={pin.showAtFrame ?? startFrame + 40 + i * 6}
              color={accent}
            />
          ))}

          {arcs.map((arc, i) => {
            const arcShowFrame =
              Math.max(
                pins[arc.from]?.showAtFrame ?? startFrame,
                pins[arc.to]?.showAtFrame ?? startFrame
              ) + 10;
            const arcOpacity = interpolate(frame - arcShowFrame, [0, 20], [0, 0.8], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <Arc
                key={i}
                start={pinPositions[arc.from]}
                end={pinPositions[arc.to]}
                radius={radius}
                color={accent}
                opacity={arcOpacity}
              />
            );
          })}
        </group>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

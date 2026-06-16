import React, { useMemo } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
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
import { SPRING_PRESETS } from "../animation/springs";

interface LogoExtrude3DProps {
  /** SVG path "d" string for the logo/icon silhouette. */
  path: string;
  color?: string;
  depth?: number;
  startFrame?: number;
  title?: string;
  titleStartFrame?: number;
}

function buildExtrudedGeometry(pathData: string, depth: number): THREE.BufferGeometry {
  const loader = new SVGLoader();
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${pathData}" /></svg>`;
  const { paths } = loader.parse(svgString);

  const shapes = paths.flatMap((p) => p.toShapes(true));
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: true,
    bevelThickness: depth * 0.4,
    bevelSize: depth * 0.3,
    bevelSegments: 3,
    curveSegments: 12,
  });

  geometry.computeBoundingBox();
  const box = geometry.boundingBox as THREE.Box3;
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, 1);
  const scaleFactor = 4 / maxDimension;

  geometry.translate(-center.x, -center.y, -center.z);
  // SVG's y-axis points down; flip it so the logo reads right-side-up in 3D.
  geometry.scale(scaleFactor, -scaleFactor, scaleFactor);

  return geometry;
}

/**
 * LogoExtrude3D — extrudes a flat SVG icon/logo path into a 3D
 * embossed object (THREE.ExtrudeGeometry via SVGLoader), with a
 * spring entrance spin and metallic material. The premium "3D logo
 * reveal" scene type.
 */
export const LogoExtrude3D: React.FC<LogoExtrude3DProps> = ({
  path,
  color,
  depth = 6,
  startFrame = 0,
  title,
  titleStartFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const theme = useTheme();

  const geometry = useMemo(() => buildExtrudedGeometry(path, depth), [path, depth]);

  const reveal = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 50,
  });
  const scale = interpolate(reveal, [0, 1], [0.1, 1]);
  const rotationY = interpolate(reveal, [0, 1], [Math.PI, 0]);
  const meshOpacity = interpolate(frame - startFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const accent = color ?? theme.colors.primary;
  const resolvedTitleStart = titleStartFrame ?? startFrame + 40;
  const titleOpacity = interpolate(frame - resolvedTitleStart, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <ThreeCanvas width={width} height={height} gl={{ alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={40} />
        <StandardLighting keyLightIntensity={1.4} />
        <mesh geometry={geometry} scale={scale} rotation={[0.15, rotationY, 0]}>
          <meshStandardMaterial
            color={accent}
            metalness={0.7}
            roughness={0.2}
            opacity={meshOpacity}
            transparent
          />
        </mesh>
      </ThreeCanvas>

      {title && (
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 110 }}
        >
          <div
            style={{
              fontFamily: theme.resolvedFonts.heading,
              fontSize: 44,
              fontWeight: 700,
              color: theme.colors.text,
              opacity: titleOpacity,
            }}
          >
            {title}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

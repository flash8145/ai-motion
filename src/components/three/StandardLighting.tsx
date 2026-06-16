import React from "react";

interface StandardLightingProps {
  ambientIntensity?: number;
  keyLightIntensity?: number;
  keyLightPosition?: [number, number, number];
  fillLightIntensity?: number;
}

/**
 * StandardLighting — a static three-point-style lighting rig shared
 * across 3D scenes. Purely declarative (no internal animation loop),
 * safe to use inside any <ThreeCanvas>.
 */
export const StandardLighting: React.FC<StandardLightingProps> = ({
  ambientIntensity = 0.4,
  keyLightIntensity = 1.1,
  keyLightPosition = [5, 6, 8],
  fillLightIntensity = 0.3,
}) => {
  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={keyLightPosition} intensity={keyLightIntensity} />
      <directionalLight
        position={[-keyLightPosition[0], 2, -keyLightPosition[2]]}
        intensity={fillLightIntensity}
      />
    </>
  );
};

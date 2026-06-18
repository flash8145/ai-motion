/**
 * applyModifiers — wraps a scene's rendered content (scene + overlays) in its
 * declared modifier stack.
 *
 * Modifiers nest in array order: modifiers[0] is the innermost wrapper and the
 * last entry is the outermost. Because CSS transforms compose, this lets you
 * stack e.g. a CameraPushIn inside a CameraParallax for layered motion.
 */
import React from "react";
import type { SceneModifier } from "../types/schema";
import { ModifierRegistry } from "./ModifierRegistry";

export function applyModifiers(
  modifiers: SceneModifier[] | undefined,
  sceneDurationFrames: number,
  content: React.ReactNode,
): React.ReactNode {
  if (!modifiers || modifiers.length === 0) return content;

  return modifiers.reduce<React.ReactNode>((acc, modifier, index) => {
    const Component = ModifierRegistry[modifier.type];
    if (!Component) return acc;
    return (
      <Component
        key={`mod-${index}-${modifier.type}`}
        modifier={modifier}
        sceneDurationFrames={sceneDurationFrames}
      >
        {acc}
      </Component>
    );
  }, content);
}

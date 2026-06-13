import type { VideoProject } from "../types/schema";

export interface SceneGraphValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Performs semantic validation on a VideoProject beyond what JSON Schema can enforce.
 * Checks duration consistency, scene integrity, and asset references.
 */
export function validateSceneGraph(
  project: VideoProject
): SceneGraphValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const { metadata, scenes } = project;

  // ── Check total duration matches sum of scene frames ──────────
  const expectedTotalFrames = Math.round(metadata.fps * metadata.totalDurationSec);
  const actualTotalFrames = scenes.reduce((sum, s) => sum + s.durationFrames, 0);

  if (actualTotalFrames !== expectedTotalFrames) {
    errors.push(
      `Duration mismatch: scenes total ${actualTotalFrames} frames but ` +
        `metadata expects ${expectedTotalFrames} frames ` +
        `(${metadata.fps} fps × ${metadata.totalDurationSec}s).`
    );
  }

  // ── Check each scene ──────────────────────────────────────────
  const seenIds = new Set<string>();

  for (const scene of scenes) {
    // Duplicate ID check
    if (seenIds.has(scene.id)) {
      errors.push(`Duplicate scene ID: "${scene.id}".`);
    }
    seenIds.add(scene.id);

    // Positive duration
    if (scene.durationFrames <= 0) {
      errors.push(`Scene "${scene.id}" has non-positive duration (${scene.durationFrames}).`);
    }

    // Transition duration should not exceed scene duration
    if (
      scene.transitionIn &&
      scene.transitionIn.durationFrames > scene.durationFrames
    ) {
      errors.push(
        `Scene "${scene.id}": transition duration (${scene.transitionIn.durationFrames}) ` +
          `exceeds scene duration (${scene.durationFrames}).`
      );
    }

    // DashboardShowcase should have a screenshotUrl
    if (scene.type === "DashboardShowcase") {
      const props = scene.props as Record<string, unknown>;
      if (!props.screenshotUrl && !props.mockupContent) {
        warnings.push(
          `Scene "${scene.id}" (DashboardShowcase): no "screenshotUrl" or "mockupContent" ` +
            `in props. The browser frame will be empty.`
        );
      }
    }

    // ── Validate overlays ─────────────────────────────────────
    if (scene.overlays) {
      const overlayIds = new Set<string>();
      for (const overlay of scene.overlays) {
        if (overlayIds.has(overlay.id)) {
          errors.push(
            `Duplicate overlay ID "${overlay.id}" in scene "${scene.id}".`
          );
        }
        overlayIds.add(overlay.id);

        // Overlay must fit within scene
        const overlayEnd = overlay.startTimeFrame + overlay.durationFrames;
        if (overlayEnd > scene.durationFrames) {
          warnings.push(
            `Overlay "${overlay.id}" in scene "${scene.id}": ` +
              `ends at frame ${overlayEnd} but scene only has ${scene.durationFrames} frames.`
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

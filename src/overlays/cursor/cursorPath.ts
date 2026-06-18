/**
 * cursorPath — samples a cursor's position along a list of waypoints.
 *
 * Cursors animate by travelling between waypoints with human-like easing
 * (smootherstep accel/decel). Waypoint frames are RELATIVE to the overlay's
 * own start. If a waypoint omits `atFrame`, frames are distributed evenly
 * across the overlay duration. Click pulses fire as the cursor arrives.
 */

export interface CursorWaypoint {
  x: number;
  y: number;
  /** Frame (relative to overlay start) to arrive here. Auto-spaced if omitted. */
  atFrame?: number;
  /** Fire a click pulse on arrival. */
  click?: boolean;
  /** Label shown beside the cursor from this waypoint onward. */
  label?: string;
}

export interface CursorSample {
  x: number;
  y: number;
  /** 0–1 click pulse (press → release) currently active. */
  clicking: number;
  /** Active label (last passed waypoint that defined one). */
  label?: string;
}

/** Smootherstep — eased 0→1 with zero velocity at both ends (human glide). */
function smoother(t: number): number {
  const c = Math.min(Math.max(t, 0), 1);
  return c * c * c * (c * (c * 6 - 15) + 10);
}

/** Triangular click pulse peaking ~3 frames after arrival. */
function clickPulse(delta: number): number {
  if (delta < -2 || delta > 9) return 0;
  return Math.max(0, 1 - Math.abs(delta - 3) / 5);
}

/** Resolves each waypoint's arrival frame (relative to overlay start). */
export function resolveFrames(
  path: CursorWaypoint[],
  durationFrames: number,
): number[] {
  const n = path.length;
  if (n <= 1) return path.map((wp) => wp.atFrame ?? 0);
  return path.map((wp, i) =>
    typeof wp.atFrame === "number"
      ? wp.atFrame
      : (i * durationFrames) / (n - 1),
  );
}

export function sampleCursor(
  path: CursorWaypoint[],
  localFrame: number,
  durationFrames: number,
): CursorSample {
  const n = path.length;
  if (n === 0) return { x: 0, y: 0, clicking: 0 };

  const frames = resolveFrames(path, durationFrames);

  if (n === 1) {
    return {
      x: path[0].x,
      y: path[0].y,
      clicking: path[0].click ? clickPulse(localFrame - frames[0]) : 0,
      label: path[0].label,
    };
  }

  // Find the current segment.
  let seg = 0;
  for (let i = 0; i < n - 1; i++) {
    if (localFrame >= frames[i]) seg = i;
  }
  const f0 = frames[seg];
  const f1 = frames[seg + 1] ?? f0 + 1;
  const e = smoother((localFrame - f0) / (f1 - f0 || 1));
  const x = path[seg].x + (path[seg + 1].x - path[seg].x) * e;
  const y = path[seg].y + (path[seg + 1].y - path[seg].y) * e;

  // Strongest active click pulse across all waypoints.
  let clicking = 0;
  for (let i = 0; i < n; i++) {
    if (path[i].click) clicking = Math.max(clicking, clickPulse(localFrame - frames[i]));
  }

  // Latest passed label.
  let label: string | undefined;
  for (let i = 0; i < n; i++) {
    if (path[i].label && localFrame >= frames[i]) label = path[i].label;
  }

  return { x, y, clicking, label };
}

/**
 * Chart utility functions for computing layout, scales, and formatting.
 */

export interface DataPoint {
  label: string;
  value: number;
}

/**
 * Normalizes an array of data points to 0..1 range based on max value.
 */
export function normalizeData(data: DataPoint[]): number[] {
  const max = Math.max(...data.map((d) => d.value), 1);
  return data.map((d) => d.value / max);
}

/**
 * Creates evenly spaced X positions for a given count within a width.
 */
export function distributeX(
  count: number,
  totalWidth: number,
  padding: number = 0
): number[] {
  if (count <= 1) return [totalWidth / 2];
  const usableWidth = totalWidth - padding * 2;
  const step = usableWidth / (count - 1);
  return Array.from({ length: count }, (_, i) => padding + i * step);
}

/**
 * Formats a numeric value for chart display.
 */
export function formatValue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(0);
}

/**
 * Generates an SVG path string for a smooth line chart.
 */
export function generateSmoothPath(
  points: Array<{ x: number; y: number }>
): string {
  if (points.length < 2) return "";

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    path += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  return path;
}

export interface Point {
  x: number;
  y: number;
}

/**
 * Calculates ticks at regular intervals between min and max.
 */
export function getScaleTicks(maxVal: number, count: number = 4): number[] {
  const max = maxVal <= 0 ? 1 : maxVal;
  const step = max / (count - 1);
  return Array.from({ length: count }, (_, i) => i * step);
}

/**
 * Parametric evaluation of a cubic Bezier curve at t (0..1).
 */
export function getBezierPoint(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number
): Point {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
  };
}

/**
 * Calculates the exact (x, y) coordinates on a smooth line at a given draw progress (0..1).
 */
export function getLinePositionAtProgress(
  points: Point[],
  progress: number
): Point {
  if (points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1) return points[0];
  if (progress <= 0) return points[0];
  if (progress >= 1) return points[points.length - 1];

  const segmentsCount = points.length - 1;
  const rawIndex = progress * segmentsCount;
  const segmentIndex = Math.min(segmentsCount - 1, Math.floor(rawIndex));
  const t = rawIndex - segmentIndex;

  const p0 = points[segmentIndex];
  const p3 = points[segmentIndex + 1];
  const cpx = (p0.x + p3.x) / 2;
  const p1 = { x: cpx, y: p0.y };
  const p2 = { x: cpx, y: p3.y };

  return getBezierPoint(p0, p1, p2, p3, t);
}


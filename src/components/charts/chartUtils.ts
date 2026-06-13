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

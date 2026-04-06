// ═══════════════════════════════════════════
// Geometry Utilities
// ═══════════════════════════════════════════

/**
 * Euclidean distance between two points
 */
export function distance(
  x1: number, y1: number,
  x2: number, y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Angle from point A to point B (radians, 0 = right, CCW positive)
 */
export function angleBetween(
  x1: number, y1: number,
  x2: number, y2: number
): number {
  return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * Snap a point to the nearest segment in a list of edges
 * Returns the snapped position and distance
 */
export function snapToNearestEdge(
  px: number, py: number,
  edges: { x1: number; y1: number; x2: number; y2: number }[]
): { x: number; y: number; distance: number } {
  let bestDist = Infinity;
  let bestPoint = { x: px, y: py };

  for (const edge of edges) {
    const snapped = projectPointOnSegment(px, py, edge.x1, edge.y1, edge.x2, edge.y2);
    const d = distance(px, py, snapped.x, snapped.y);
    if (d < bestDist) {
      bestDist = d;
      bestPoint = snapped;
    }
  }

  return { ...bestPoint, distance: bestDist };
}

/**
 * Project a point onto a line segment
 */
export function projectPointOnSegment(
  px: number, py: number,
  x1: number, y1: number,
  x2: number, y2: number
): { x: number; y: number } {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) return { x: x1, y: y1 };

  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));

  return {
    x: x1 + t * dx,
    y: y1 + t * dy,
  };
}

/**
 * Linear interpolation between two points
 */
export function lerp(
  x1: number, y1: number,
  x2: number, y2: number,
  t: number
): { x: number; y: number } {
  return {
    x: x1 + (x2 - x1) * t,
    y: y1 + (y2 - y1) * t,
  };
}

/**
 * Simple 1D Kalman filter for smoothing sensor readings
 */
export class KalmanFilter {
  private estimate: number;
  private errorEstimate: number;
  private errorMeasure: number;
  private q: number; // process noise

  constructor(initialEstimate: number = 0, errorEstimate: number = 1, errorMeasure: number = 1, q: number = 0.1) {
    this.estimate = initialEstimate;
    this.errorEstimate = errorEstimate;
    this.errorMeasure = errorMeasure;
    this.q = q;
  }

  update(measurement: number): number {
    // Prediction
    this.errorEstimate += this.q;

    // Update
    const kalmanGain = this.errorEstimate / (this.errorEstimate + this.errorMeasure);
    this.estimate += kalmanGain * (measurement - this.estimate);
    this.errorEstimate *= (1 - kalmanGain);

    return this.estimate;
  }

  reset(value: number): void {
    this.estimate = value;
    this.errorEstimate = 1;
  }
}

/**
 * Complementary filter for heading estimation
 * Fuses gyroscope (fast, drifts) with magnetometer (slow, absolute)
 */
export function complementaryFilter(
  gyroHeading: number,
  magHeading: number,
  alpha: number = 0.98
): number {
  // Normalize angles to [-PI, PI]
  let diff = magHeading - gyroHeading;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;

  return gyroHeading + (1 - alpha) * diff;
}

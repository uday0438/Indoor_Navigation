// ═══════════════════════════════════════════════════════════
// SENSOR FUSION ENGINE
// Real indoor positioning using phone sensors
//
// Pipeline:
//   Accelerometer → Step Detection → Step Length
//   Gyroscope + Magnetometer → Heading (complementary filter)
//   Dead Reckoning → Raw Position
//   Map Matching → Snapped Position
//   Kalman Filter → Smooth Output
// ═══════════════════════════════════════════════════════════

import * as Haptics from 'expo-haptics';
import { SENSOR_CONFIG, MAP_CONFIG } from '../utils/constants';
import { KalmanFilter, complementaryFilter, snapToNearestEdge, distance } from '../utils/geometry';
import { UserPosition, GraphData } from '../types';

// ─── Step Detector ────────────────────────────────
class StepDetector {
  private lastMagnitude = 0;
  private lastStepTime = 0;
  private isRising = false;
  private stepCount = 0;

  // Walking validation: require consistent pattern before confirming movement
  private candidateSteps: number[] = [];  // timestamps of recent candidate peaks
  private isWalking = false;
  private walkingTimeout = 0;

  // Low-pass filter to smooth out shaking noise
  private filteredAccel = 9.81;
  private readonly LPF_ALPHA = 0.25;  // low-pass filter coefficient

  // Walking validation constants
  private readonly MIN_CANDIDATES = 3;       // need 3 consistent steps to confirm walking
  private readonly CANDIDATE_WINDOW = 3000;  // within 3 seconds
  private readonly WALKING_TIMEOUT = 2000;   // stop walking state after 2s of no steps
  private readonly MIN_STEP_INTERVAL = 300;  // steps faster than this = shaking, not walking
  private readonly MAX_STEP_INTERVAL = 1200; // steps slower than this = not walking

  /**
   * Feed accelerometer data, returns true if a step was detected
   */
  detect(ax: number, ay: number, az: number, timestamp: number): boolean {
    const magnitude = Math.sqrt(ax * ax + ay * ay + az * az);

    // Low-pass filter the acceleration magnitude to smooth out sudden shakes
    this.filteredAccel = this.LPF_ALPHA * magnitude + (1 - this.LPF_ALPHA) * this.filteredAccel;
    const dynamicAccel = this.filteredAccel - 9.81;
    const now = timestamp;

    // Check if walking has timed out (no steps for a while)
    if (this.isWalking && now - this.lastStepTime > this.WALKING_TIMEOUT) {
      this.isWalking = false;
      this.candidateSteps = [];
    }

    // Peak detection with hysteresis
    if (dynamicAccel > SENSOR_CONFIG.STEP_THRESHOLD && !this.isRising) {
      this.isRising = true;
    }

    // Step registers when acceleration drops back down near baseline
    if (this.isRising && dynamicAccel < SENSOR_CONFIG.STEP_THRESHOLD * 0.15) {
      this.isRising = false;

      // Enforce cooldown between steps
      if (now - this.lastStepTime > SENSOR_CONFIG.STEP_COOLDOWN) {
        const interval = now - this.lastStepTime;

        if (this.isWalking) {
          // Already confirmed walking — count the step
          this.lastStepTime = now;
          this.stepCount++;
          this.lastMagnitude = magnitude;
          return true;
        } else {
          // Not yet confirmed — collect candidate steps
          // Remove old candidates outside the window
          this.candidateSteps = this.candidateSteps.filter(
            (t) => now - t < this.CANDIDATE_WINDOW
          );
          this.candidateSteps.push(now);

          this.lastStepTime = now;

          // Check if we have enough consistent candidates
          if (this.candidateSteps.length >= this.MIN_CANDIDATES) {
            // Verify candidates have walking-like intervals (not random shaking)
            let consistent = true;
            for (let i = 1; i < this.candidateSteps.length; i++) {
              const gap = this.candidateSteps[i] - this.candidateSteps[i - 1];
              if (gap < this.MIN_STEP_INTERVAL || gap > this.MAX_STEP_INTERVAL) {
                consistent = false;
                break;
              }
            }

            if (consistent) {
              // Confirmed walking!
              this.isWalking = true;
              this.stepCount++;
              this.lastMagnitude = magnitude;
              return true;
            }
          }
        }
      }
    }

    this.lastMagnitude = magnitude;
    return false;
  }

  /**
   * Estimate step length based on acceleration magnitude
   * Weinberg model: stepLength = K * (aMax - aMin)^0.25
   */
  estimateStepLength(peakAccel: number): number {
    const K = 0.55; // calibration constant (increased for map coordinate scale)
    const raw = K * Math.pow(Math.max(0.1, peakAccel), 0.25);
    return Math.max(
      SENSOR_CONFIG.STEP_LENGTH_MIN,
      Math.min(SENSOR_CONFIG.STEP_LENGTH_MAX, raw)
    );
  }

  getStepCount(): number {
    return this.stepCount;
  }

  reset(): void {
    this.stepCount = 0;
    this.lastStepTime = 0;
    this.isRising = false;
    this.isWalking = false;
    this.candidateSteps = [];
    this.filteredAccel = 9.81;
  }
}

// ─── Heading Estimator ────────────────────────────
class HeadingEstimator {
  private gyroHeading = 0;    // integrated gyroscope heading
  private magHeading = 0;     // magnetometer heading (smoothed)
  private fusedHeading = 0;
  private lastGyroTime = 0;

  // Low-pass filter state for magnetometer
  private smoothedMx = 0;
  private smoothedMy = 0;
  private magInitialized = false;

  /**
   * Update with gyroscope data (angular velocity in rad/s)
   */
  updateGyro(gz: number, timestamp: number): void {
    if (this.lastGyroTime > 0) {
      const dt = (timestamp - this.lastGyroTime) / 1000;
      // Clamp dt to avoid huge jumps from pauses
      const clampedDt = Math.min(dt, 0.2);
      this.gyroHeading += gz * clampedDt;
      // Normalize to [-PI, PI]
      this.gyroHeading = this.normalizeAngle(this.gyroHeading);
    }
    this.lastGyroTime = timestamp;
  }

  /**
   * Update with magnetometer data
   * Low-pass filter applied to smooth noisy indoor readings
   */
  updateMag(mx: number, my: number): void {
    const alpha = SENSOR_CONFIG.MAG_SMOOTHING_ALPHA;

    if (!this.magInitialized) {
      this.smoothedMx = mx;
      this.smoothedMy = my;
      this.magInitialized = true;
    } else {
      // Exponential low-pass filter: smoothed = alpha * new + (1-alpha) * old
      this.smoothedMx = alpha * mx + (1 - alpha) * this.smoothedMx;
      this.smoothedMy = alpha * my + (1 - alpha) * this.smoothedMy;
    }

    // Calculate heading from smoothed magnetometer
    // atan2(-y, x) gives heading where 0 = magnetic north in standard orientation
    const rawMagHeading = Math.atan2(-this.smoothedMy, this.smoothedMx);

    // Apply building offset to align with floor plan coordinate system
    this.magHeading = this.normalizeAngle(rawMagHeading + SENSOR_CONFIG.BUILDING_HEADING_OFFSET);
  }

  /**
   * Get fused heading using complementary filter
   * Returns heading in radians aligned with the floor plan
   */
  getHeading(): number {
    this.fusedHeading = complementaryFilter(
      this.gyroHeading,
      this.magHeading,
      SENSOR_CONFIG.COMPLEMENTARY_ALPHA
    );
    return this.fusedHeading;
  }

  /**
   * Normalize angle to [-PI, PI]
   */
  private normalizeAngle(angle: number): number {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
  }

  reset(heading: number = 0): void {
    this.gyroHeading = heading;
    this.magHeading = heading;
    this.fusedHeading = heading;
    this.lastGyroTime = 0;
    this.magInitialized = false;
    this.smoothedMx = 0;
    this.smoothedMy = 0;
  }
}

// ─── Map Matcher ──────────────────────────────────
class MapMatcher {
  private corridorEdges: { x1: number; y1: number; x2: number; y2: number }[] = [];

  /**
   * Build corridor edge list from graph data
   */
  loadGraph(graph: GraphData, floor: number): void {
    this.corridorEdges = [];

    const floorNodes: Record<string, { x: number; y: number }> = {};
    for (const [id, node] of Object.entries(graph.nodes)) {
      if (node.floor === floor) {
        floorNodes[id] = { x: node.x, y: node.y };
      }
    }

    for (const edge of graph.edges) {
      const from = floorNodes[edge.from];
      const to = floorNodes[edge.to];
      if (from && to) {
        this.corridorEdges.push({
          x1: from.x, y1: from.y,
          x2: to.x, y2: to.y,
        });
      }
    }
  }

  /**
   * Snap position to nearest corridor
   */
  snap(x: number, y: number): { x: number; y: number; snapped: boolean } {
    if (this.corridorEdges.length === 0) {
      return { x, y, snapped: false };
    }

    const result = snapToNearestEdge(x, y, this.corridorEdges);

    if (result.distance <= MAP_CONFIG.SNAP_DISTANCE) {
      return { x: result.x, y: result.y, snapped: true };
    }

    return { x, y, snapped: false };
  }
}

// ─── Main Sensor Fusion Engine ────────────────────
export class SensorFusionEngine {
  private stepDetector = new StepDetector();
  private headingEstimator = new HeadingEstimator();
  private mapMatcher = new MapMatcher();

  private kalmanX = new KalmanFilter(0, 1, 0.8, 0.8);
  private kalmanY = new KalmanFilter(0, 1, 0.8, 0.8);

  private position: UserPosition = {
    x: 0, y: 0, floor: 1,
    heading: 0, accuracy: 5, timestamp: Date.now(),
  };

  private graph: GraphData | null = null;
  private isActive = false;
  private onPositionUpdate: ((pos: UserPosition) => void) | null = null;

  // Route-constrained navigation
  private routePath: { x: number; y: number; floor: number }[] = [];
  private routeProgress = 0; // distance traveled along route polyline

  /**
   * Initialize engine with graph data and starting position
   */
  initialize(
    graph: GraphData,
    startPosition: { x: number; y: number; floor: number },
    onUpdate: (pos: UserPosition) => void
  ): void {
    this.graph = graph;
    this.position = {
      ...startPosition,
      heading: 0,
      accuracy: 3,
      timestamp: Date.now(),
    };
    this.onPositionUpdate = onUpdate;
    this.isActive = true;

    this.kalmanX.reset(startPosition.x);
    this.kalmanY.reset(startPosition.y);
    this.stepDetector.reset();
    this.headingEstimator.reset();
    this.mapMatcher.loadGraph(graph, startPosition.floor);
    this.routePath = [];
    this.routeProgress = 0;

    this.emitPosition();
  }

  /**
   * Set the active route path — enables route-constrained movement
   * The blue dot will only move along this path
   */
  setRoutePath(path: { x: number; y: number; floor: number }[]): void {
    this.routePath = path;
    this.routeProgress = 0;
  }

  /**
   * Feed accelerometer data
   */
  onAccelerometer(x: number, y: number, z: number): void {
    if (!this.isActive) return;

    const now = Date.now();
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    const stepDetected = this.stepDetector.detect(x, y, z, now);

    // Logging ~once per second instead of every 50ms to prevent spam
    if (now % 1000 < 60) {
       console.log(`[SENSOR] Mag: ${magnitude.toFixed(2)}, Dynamic: ${(magnitude - 9.81).toFixed(2)}, Steps: ${this.stepDetector.getStepCount()}`);
    }

    if (stepDetected) {
      console.log(`🦶 STEP TAKEN! Count: ${this.stepDetector.getStepCount()}`);
      
      // Haptic Feedback: subtle 'tick' on every step detected
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const stepLength = this.stepDetector.estimateStepLength(magnitude);
      this.advancePosition(stepLength);
    }
  }

  /**
   * Feed gyroscope data
   */
  onGyroscope(x: number, y: number, z: number): void {
    if (!this.isActive) return;
    this.headingEstimator.updateGyro(z, Date.now());
  }

  /**
   * Feed magnetometer data
   */
  onMagnetometer(x: number, y: number, z: number): void {
    if (!this.isActive) return;
    this.headingEstimator.updateMag(x, y);
  }

  /**
   * Advance position by one step
   * If a route is active: move along the route polyline (stays on blue path)
   * If no route: use dead reckoning with corridor snap (free mode)
   */
  private advancePosition(stepLength: number): void {
    if (this.routePath.length >= 2) {
      // ── ROUTE-CONSTRAINED MODE ──
      // Move forward along the route polyline by stepLength
      this.routeProgress += stepLength;

      // Walk along the polyline segments until we've covered routeProgress distance
      let remaining = this.routeProgress;
      let posX = this.routePath[0].x;
      let posY = this.routePath[0].y;
      let posFloor = this.routePath[0].floor;
      let heading = 0;

      for (let i = 0; i < this.routePath.length - 1; i++) {
        const ax = this.routePath[i].x;
        const ay = this.routePath[i].y;
        const bx = this.routePath[i + 1].x;
        const by = this.routePath[i + 1].y;
        const segLen = Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2);

        if (segLen < 0.01) continue; // skip zero-length segments

        if (remaining <= segLen) {
          // Position is within this segment
          const t = remaining / segLen;
          posX = ax + t * (bx - ax);
          posY = ay + t * (by - ay);

          // Fixed 'missing blue dot' bug: only change floor when we have 
          // actually reached the end of the segment or are significantly into it.
          // This prevents premature disappearance when on stairs or floor-switch points.
          posFloor = (t > 0.85) ? this.routePath[i + 1].floor : this.routePath[i].floor;

          heading = Math.atan2(by - ay, bx - ax);
          break;
        } else {
          remaining -= segLen;
          // If we've passed the last segment, clamp to the end
          if (i === this.routePath.length - 2) {
            posX = bx;
            posY = by;
            posFloor = this.routePath[i + 1].floor;
            heading = Math.atan2(by - ay, bx - ax);
          }
        }
      }

      this.position = {
        x: posX,
        y: posY,
        floor: posFloor,
        heading,
        accuracy: 1,
        timestamp: Date.now(),
      };
    } else {
      // ── FREE MODE (no route) ──
      const heading = this.headingEstimator.getHeading();
      const rawX = this.position.x + stepLength * Math.cos(heading);
      const rawY = this.position.y + stepLength * Math.sin(heading);

      const snapped = this.mapMatcher.snap(rawX, rawY);
      const smoothX = this.kalmanX.update(snapped.x);
      const smoothY = this.kalmanY.update(snapped.y);

      this.position = {
        x: smoothX,
        y: smoothY,
        floor: this.position.floor,
        heading,
        accuracy: snapped.snapped ? 2 : 4,
        timestamp: Date.now(),
      };
    }

    this.emitPosition();
  }

  /**
   * Manually set position (e.g., from BLE beacon correction or user tap)
   */
  setPosition(x: number, y: number, floor: number): void {
    this.position = {
      x, y, floor,
      heading: this.position.heading,
      accuracy: 1,
      timestamp: Date.now(),
    };
    this.kalmanX.reset(x);
    this.kalmanY.reset(y);

    if (floor !== this.position.floor && this.graph) {
      this.mapMatcher.loadGraph(this.graph, floor);
    }

    this.emitPosition();
  }

  /**
   * Change floor (e.g., when navigating via stairs)
   */
  changeFloor(floor: number): void {
    this.position.floor = floor;
    if (this.graph) {
      this.mapMatcher.loadGraph(this.graph, floor);
    }
  }

  /**
   * Drift correction — snap to nearest graph node
   */
  correctDrift(): void {
    if (!this.graph) return;

    let nearestId = '';
    let nearestDist = Infinity;

    for (const [id, node] of Object.entries(this.graph.nodes)) {
      if (node.floor !== this.position.floor) continue;
      const d = distance(this.position.x, this.position.y, node.x, node.y);
      if (d < nearestDist) {
        nearestDist = d;
        nearestId = id;
      }
    }

    if (nearestId && nearestDist < MAP_CONFIG.SNAP_DISTANCE) {
      const node = this.graph.nodes[nearestId];
      this.kalmanX.reset(node.x);
      this.kalmanY.reset(node.y);
      this.position.x = node.x;
      this.position.y = node.y;
      this.position.accuracy = 1;
      this.emitPosition();
    }
  }

  /**
   * Get current position
   */
  getPosition(): UserPosition {
    return { ...this.position };
  }

  /**
   * Stop engine
   */
  stop(): void {
    this.isActive = false;
    this.onPositionUpdate = null;
  }

  private emitPosition(): void {
    if (this.onPositionUpdate) {
      this.onPositionUpdate({ ...this.position });
    }
  }
}

// Singleton export
export const sensorEngine = new SensorFusionEngine();

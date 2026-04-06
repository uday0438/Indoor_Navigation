// ═══════════════════════════════════════════
// KEC Indoor Navigation — Type Definitions
// ═══════════════════════════════════════════

export type LocationType =
  | 'room' | 'lab' | 'office' | 'classroom' | 'corridor'
  | 'stairs' | 'lift' | 'auditorium' | 'library'
  | 'washroom' | 'store' | 'entrance';

export interface MapLocation {
  locationId: string;
  name: string;
  floor: number;
  x: number;
  y: number;
  type: LocationType;
  label?: string;
  description?: string;
  adjacency: AdjacencyEdge[];
  isNavigable: boolean;
  metadata?: {
    roomNumber?: string;
    department?: string;
    capacity?: number;
  };
}

export interface AdjacencyEdge {
  targetId: string;
  weight: number;
}

export interface FloorData {
  floorNumber: number;
  name: string;
  shortName: string;
  width: number;
  height: number;
  areaSqft?: number;
  areaSqm?: number;
  mapImageUrl?: string;
  locations?: MapLocation[];
}

export interface PathNode {
  locationId: string;
  name: string;
  label: string;
  floor: number;
  x: number;
  y: number;
  type: LocationType;
}

export interface NavigationStep {
  type: 'start' | 'walk' | 'turn' | 'floor_change' | 'arrive';
  icon: string;
  text: string;
  floor: number;
  locationId: string;
  x: number;
  y: number;
  distance?: number; // Distance for this step in meters
}

export interface RouteResult {
  path: PathNode[];
  distance: number;
  estimatedTime: number;
  steps: NavigationStep[];
  fromFloor: number;
  toFloor: number;
  isMultiFloor: boolean;
}

export interface UserPosition {
  x: number;
  y: number;
  floor: number;
  heading: number;      // radians, 0 = north
  accuracy: number;     // meters
  timestamp: number;
}

export interface SensorData {
  accelerometer: { x: number; y: number; z: number };
  gyroscope: { x: number; y: number; z: number };
  magnetometer: { x: number; y: number; z: number };
}

export interface GraphData {
  nodes: Record<string, PathNode>;
  edges: { from: string; to: string; weight: number }[];
}

// Navigation state
export type NavigationState = 'idle' | 'planning' | 'navigating' | 'arrived' | 'recalculating';

export interface NavigationSession {
  state: NavigationState;
  route: RouteResult | null;
  currentStepIndex: number;
  destination: MapLocation | null;
  startTime: number | null;
  completedPercent: number;
}

// ═══════════════════════════════════════════
// App Constants
// ═══════════════════════════════════════════

// CHANGE THIS to your backend server IP
export const API_URL = 'http://10.22.178.170:3001';

// Sensor configuration
export const SENSOR_CONFIG = {
  ACCELEROMETER_INTERVAL: 50,       // ms between readings
  GYROSCOPE_INTERVAL: 50,
  MAGNETOMETER_INTERVAL: 100,
  STEP_THRESHOLD: 1.2,              // Only real walking triggers steps (was 0.6 - too sensitive)
  STEP_COOLDOWN: 350,               // minimum ms between steps (prevents false triggers)
  STEP_LENGTH: 0.75,                // average step length in meters
  STEP_LENGTH_MIN: 0.5,
  STEP_LENGTH_MAX: 1.1,
  COMPLEMENTARY_ALPHA: 0.85,
  MAG_SMOOTHING_ALPHA: 0.3,
  BUILDING_HEADING_OFFSET: -Math.PI / 2,
};

// Map rendering
export const MAP_CONFIG = {
  MIN_ZOOM: 0.3,
  MAX_ZOOM: 4.0,
  DEFAULT_ZOOM: 1.0,
  SNAP_DISTANCE: 8,                 // max meters to snap to corridor
  ARRIVAL_THRESHOLD: 3,             // meters from destination to trigger arrival
  OFF_ROUTE_THRESHOLD: 10,          // meters off path before recalculation
  POSITION_SMOOTHING: 0.3,          // Kalman filter smoothing factor (0-1)
};

// Colors
export const COLORS = {
  primary: '#0d1b4a',
  primaryLight: '#1a2f6e',
  accent: '#1976D2',
  accentLight: '#42A5F5',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#E53935',
  background: '#FAFBFC',
  surface: '#FFFFFF',
  textPrimary: '#1a1a1a',
  textSecondary: '#666666',
  textMuted: '#9E9E9E',
  border: '#E8E8E8',
  corridor: '#F5F5F5',
  // Room type colors
  room: { bg: '#FFFDE7', border: '#FDD835', text: '#F9A825' },
  classroom: { bg: '#E8F5E9', border: '#43A047', text: '#2E7D32' },
  lab: { bg: '#E3F2FD', border: '#1E88E5', text: '#1565C0' },
  office: { bg: '#FFF3E0', border: '#FB8C00', text: '#E65100' },
  auditorium: { bg: '#F3E5F5', border: '#8E24AA', text: '#6A1B9A' },
  library: { bg: '#FCE4EC', border: '#D81B60', text: '#AD1457' },
  stairs: { bg: '#ECEFF1', border: '#78909C', text: '#37474F' },
};

// Floor metadata
export const FLOOR_NAMES: Record<number, string> = {
  0: 'Ground Floor',
  1: 'First Floor',
  2: 'Second Floor',
  3: 'Third Floor',
};

export const FLOOR_SHORT: Record<number, string> = {
  0: 'G',
  1: '1',
  2: '2',
  3: '3',
};

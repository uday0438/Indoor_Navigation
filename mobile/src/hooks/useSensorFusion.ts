// ═══════════════════════════════════════════
// useSensorFusion — Hook for real-time tracking
// ═══════════════════════════════════════════
import { useEffect, useRef, useCallback } from 'react';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import { sensorEngine } from '../services/SensorFusionEngine';
import { useNavStore } from '../store/navigationStore';
import { SENSOR_CONFIG } from '../utils/constants';
import { UserPosition, GraphData } from '../types';

export function useSensorFusion() {
  const subscriptionsRef = useRef<any[]>([]);
  const driftTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { graph, setUserPosition } = useNavStore();

  const handlePositionUpdate = useCallback((pos: UserPosition) => {
    setUserPosition(pos);
  }, [setUserPosition]);

  const startTracking = useCallback((
    graphData: GraphData,
    startPos: { x: number; y: number; floor: number }
  ) => {
    // Initialize sensor engine
    sensorEngine.initialize(graphData, startPos, handlePositionUpdate);

    // Subscribe to sensors
    Accelerometer.setUpdateInterval(SENSOR_CONFIG.ACCELEROMETER_INTERVAL);
    Gyroscope.setUpdateInterval(SENSOR_CONFIG.GYROSCOPE_INTERVAL);
    Magnetometer.setUpdateInterval(SENSOR_CONFIG.MAGNETOMETER_INTERVAL);

    const accelSub = Accelerometer.addListener(({ x, y, z }) => {
      if (Math.random() < 0.02) console.log(`[useSensorFusion] RAW: x=${x.toFixed(2)}, y=${y.toFixed(2)}, z=${z.toFixed(2)}`);
      sensorEngine.onAccelerometer(x * 9.81, y * 9.81, z * 9.81);
    });

    const gyroSub = Gyroscope.addListener(({ x, y, z }) => {
      sensorEngine.onGyroscope(x, y, z);
    });

    const magSub = Magnetometer.addListener(({ x, y, z }) => {
      sensorEngine.onMagnetometer(x, y, z);
    });

    subscriptionsRef.current = [accelSub, gyroSub, magSub];

    // Removed the aggressive 10-second drift correction timer.
    // The engine's mapMatcher.snap() already properly constrains movement to edges during physical steps.

  }, [handlePositionUpdate]);

  const stopTracking = useCallback(() => {
    subscriptionsRef.current.forEach((sub) => sub?.remove());
    subscriptionsRef.current = [];
    sensorEngine.stop();

    if (driftTimerRef.current) {
      clearInterval(driftTimerRef.current);
      driftTimerRef.current = null;
    }
  }, []);

  const setManualPosition = useCallback((x: number, y: number, floor: number) => {
    sensorEngine.setPosition(x, y, floor);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    startTracking,
    stopTracking,
    setManualPosition,
    getPosition: () => sensorEngine.getPosition(),
  };
}

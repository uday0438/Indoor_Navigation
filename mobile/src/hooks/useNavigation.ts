// ═══════════════════════════════════════════
// useNavigation — With offline route fallback
// ═══════════════════════════════════════════
import { useCallback, useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { useNavStore } from '../store/navigationStore';
import { useSensorFusion } from './useSensorFusion';
import { apiService } from '../services/ApiService';
import { sensorEngine } from '../services/SensorFusionEngine';
import { socketService } from '../services/SocketService';
import { calculateOfflineRoute } from '../services/OfflineRouteService';
import { MapLocation } from '../types';
import { distance } from '../utils/geometry';
import { MAP_CONFIG } from '../utils/constants';
import { TRANSLATE } from '../utils/translation';
import { FALLBACK_FLOORS, FALLBACK_LOCATIONS } from '../data/fallbackData';

export function useNavigation() {
  const {
    graph, route, navState, userPosition, destination, currentFloor,
    currentStepIndex, locations, isMuted, voiceLanguage, setNavState, setRoute, setCurrentStepIndex,
    setCompletedPercent, setDestination, setStartLocation,
    setCurrentFloor, resetNavigation, setGraph, setLocations, setFloors,
  } = useNavStore();

  const { startTracking, stopTracking, setManualPosition } = useSensorFusion();
  const lastAnnouncedStep = useRef<number>(-1);
  const lastOffRouteTime = useRef<number>(0);

  // ─── Load initial data (with fallback) ─────
  const loadData = useCallback(async () => {
    try {
      const [floors, locs, graphData] = await Promise.all([
        apiService.getFloors(),
        apiService.getLocations(),
        apiService.getGraph(),
      ]);
      setFloors(floors);
      setLocations(locs);
      setGraph(graphData);
      socketService.connect();
      console.log('✅ Data loaded from API');
    } catch (err) {
      console.warn('⚠️ API unreachable, using fallback data');
      setFloors(FALLBACK_FLOORS);
      setLocations(FALLBACK_LOCATIONS);
    }
  }, [setFloors, setLocations, setGraph]);

  // Voice announcement helper with Multi-language support
  const announce = useCallback((text: string) => {
    if (!isMuted) {
      const langCode = voiceLanguage === 'hi' ? 'hi-IN' : (voiceLanguage === 'te' ? 'te-IN' : 'en-US');
      const translated = TRANSLATE(text, voiceLanguage);
      Speech.speak(translated, { language: langCode, pitch: 1, rate: 0.95 });
    }
  }, [isMuted, voiceLanguage]);

  // Immediate mute effect
  useEffect(() => {
    if (isMuted) {
      Speech.stop();
    }
  }, [isMuted]);

  // ─── Start navigation ─────────────────
  const startNavigation = useCallback(async (
    from: MapLocation,
    to: MapLocation
  ): Promise<boolean> => {
    try {
      setNavState('planning');
      setStartLocation(from);
      setDestination(to);

      let routeResult;

      try {
        routeResult = await apiService.calculateRoute(
          from.locationId,
          to.locationId
        );
        console.log('✅ Route from API');
      } catch (apiErr) {
        console.warn('⚠️ API route failed, using offline pathfinding');
        const allLocs = locations.length > 0 ? locations : FALLBACK_LOCATIONS;
        const offlineRoute = calculateOfflineRoute(from, to, allLocs);
        if (!offlineRoute) throw new Error('No path found');
        routeResult = offlineRoute;
      }

      setRoute(routeResult);
      setCurrentStepIndex(0);
      setCurrentFloor(from.floor);
      lastAnnouncedStep.current = -1;

      const safeGraph = graph || { nodes: {}, edges: [] };
      const corridorStart = routeResult.path.find(
        (node) => node.type === 'corridor' || node.type === 'entrance' || node.type === 'stairs'
      );
      const startPos = corridorStart
        ? { x: corridorStart.x, y: corridorStart.y, floor: corridorStart.floor }
        : { x: from.x, y: from.y, floor: from.floor };
      
      startTracking(safeGraph as any, startPos);
      sensorEngine.setRoutePath(routeResult.path.map((n) => ({ x: n.x, y: n.y, floor: n.floor })));

      setNavState('navigating');
      announce(`Starting navigation to ${to.label || to.name}. Follow the path.`);
      return true;
    } catch (err) {
      console.error('Navigation start failed:', err);
      setNavState('idle');
      return false;
    }
  }, [graph, locations, startTracking, announce, setNavState, setRoute, setCurrentStepIndex, setDestination, setStartLocation, setCurrentFloor]);

  const stopNavigation = useCallback(() => {
    stopTracking();
    socketService.stopNavigation();
    resetNavigation();
    Speech.stop();
  }, [stopTracking, resetNavigation]);

  // Tracking effect
  useEffect(() => {
    if (!userPosition || !route || navState !== 'navigating') return;

    socketService.sendPosition(userPosition);
    const { steps } = route;

    // Identify current step
    for (let i = steps.length - 1; i >= 0; i--) {
      const step = steps[i];
      if (step.floor === userPosition.floor) {
        const d = distance(userPosition.x, userPosition.y, step.x, step.y);
        if (d < 5) {
          if (i !== currentStepIndex) {
            setCurrentStepIndex(i);
          }
          break;
        }
      }
    }

    // Voice announcement for new steps
    if (currentStepIndex !== lastAnnouncedStep.current) {
      const step = steps[currentStepIndex];
      if (step) {
        announce(step.text);
        lastAnnouncedStep.current = currentStepIndex;
      }
    }

    // Check arrival
    const lastNode = route.path[route.path.length - 1];
    if (lastNode && lastNode.floor === userPosition.floor) {
      const d = distance(userPosition.x, userPosition.y, lastNode.x, lastNode.y);
      if (d < MAP_CONFIG.ARRIVAL_THRESHOLD) {
        setNavState('arrived');
        announce("You have arrived at your destination.");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        stopTracking();
      }
    }

    // Off-route detection
    const onFloorPath = route.path.filter(n => n.floor === userPosition.floor);
    if (onFloorPath.length > 0) {
      // Find distance to nearest point on path
      let minPathDistance = 999;
      onFloorPath.forEach(p => {
        const d = distance(userPosition.x, userPosition.y, p.x, p.y);
        if (d < minPathDistance) minPathDistance = d;
      });

      if (minPathDistance > MAP_CONFIG.OFF_ROUTE_THRESHOLD) {
        // Only announce every 10 seconds to avoid annoyance
        const now = Date.now();
        if (!lastOffRouteTime.current || now - lastOffRouteTime.current > 10000) {
          announce("Attention! You are straying from the path. Please follow the blue line.");
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          lastOffRouteTime.current = now;
        }
      }
    }

    // Auto floor switch
    if (route.isMultiFloor && userPosition.floor !== currentFloor) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setCurrentFloor(userPosition.floor);
      announce(`Changing to floor ${userPosition.floor}`);
    }
  }, [userPosition, route, navState, currentStepIndex, currentFloor, announce, setCurrentStepIndex, setNavState, stopTracking, setCurrentFloor]);

  return { loadData, startNavigation, stopNavigation, setManualPosition };
}
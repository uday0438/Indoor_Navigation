// ═══════════════════════════════════════════
// Navigation State Store (Zustand)
// ═══════════════════════════════════════════
import { create } from 'zustand';
import {
  UserPosition, MapLocation, RouteResult,
  NavigationState, NavigationStep, GraphData, FloorData,
} from '../types';

interface NavStore {
  // ─── Map state ──────────────────────────
  currentFloor: number;
  floors: FloorData[];
  locations: MapLocation[];
  graph: GraphData | null;
  setCurrentFloor: (floor: number) => void;
  setFloors: (floors: FloorData[]) => void;
  setLocations: (locs: MapLocation[]) => void;
  setGraph: (graph: GraphData) => void;

  // ─── Navigation state ───────────────────
  navState: NavigationState;
  route: RouteResult | null;
  currentStepIndex: number;
  destination: MapLocation | null;
  startLocation: MapLocation | null;
  completedPercent: number;
  setNavState: (state: NavigationState) => void;
  setRoute: (route: RouteResult | null) => void;
  setCurrentStepIndex: (idx: number) => void;
  setDestination: (dest: MapLocation | null) => void;
  setStartLocation: (loc: MapLocation | null) => void;
  setCompletedPercent: (pct: number) => void;

  // ─── User position ─────────────────────
  userPosition: UserPosition | null;
  setUserPosition: (pos: UserPosition) => void;

  // ─── Search ─────────────────────────────
  searchQuery: string;
  searchResults: MapLocation[];
  setSearchQuery: (q: string) => void;
  setSearchResults: (results: MapLocation[]) => void;

  // ─── Voice ─────────────────────────────
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  voiceLanguage: 'en' | 'hi' | 'te';
  setVoiceLanguage: (lang: 'en' | 'hi' | 'te') => void;

  // ─── Actions ────────────────────────────
  resetNavigation: () => void;
}

export const useNavStore = create<NavStore>((set) => ({
  // Map
  currentFloor: 1,
  floors: [],
  locations: [],
  graph: null,
  setCurrentFloor: (floor) => set({ currentFloor: floor }),
  setFloors: (floors) => set({ floors }),
  setLocations: (locations) => set({ locations }),
  setGraph: (graph) => set({ graph }),

  // Navigation
  navState: 'idle',
  route: null,
  currentStepIndex: 0,
  destination: null,
  startLocation: null,
  completedPercent: 0,
  setNavState: (navState) => set({ navState }),
  setRoute: (route) => set({ route }),
  setCurrentStepIndex: (currentStepIndex) => set({ currentStepIndex }),
  setDestination: (destination) => set({ destination }),
  setStartLocation: (startLocation) => set({ startLocation }),
  setCompletedPercent: (completedPercent) => set({ completedPercent }),

  // User position
  userPosition: null,
  setUserPosition: (userPosition) => set({ userPosition }),

  // Search
  searchQuery: '',
  searchResults: [],
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSearchResults: (searchResults) => set({ searchResults }),

  // Voice
  isMuted: false,
  setIsMuted: (isMuted) => set({ isMuted }),
  voiceLanguage: 'en',
  setVoiceLanguage: (lang) => set({ voiceLanguage: lang }),

  // Reset
  resetNavigation: () => set({
    navState: 'idle',
    route: null,
    currentStepIndex: 0,
    destination: null,
    startLocation: null,
    completedPercent: 0,
  }),
}));

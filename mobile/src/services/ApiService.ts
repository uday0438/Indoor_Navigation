// ═══════════════════════════════════════════
// API Service — REST communication with backend
// ═══════════════════════════════════════════
import { API_URL } from '../utils/constants';
import { MapLocation, FloorData, RouteResult, GraphData } from '../types';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        headers: { 
          'Content-Type': 'application/json',
          'bypass-tunnel-reminder': 'true'
        },
        signal: controller.signal,
        ...options,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Network error' }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      return data.data;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // ─── Locations ──────────────────────────────
  async getLocations(floor?: number): Promise<MapLocation[]> {
    const query = floor !== undefined ? `?floor=${floor}` : '';
    return this.fetch<MapLocation[]>(`/api/locations${query}`);
  }

  async searchLocations(query: string): Promise<MapLocation[]> {
    return this.fetch<MapLocation[]>(`/api/locations/search?q=${encodeURIComponent(query)}`);
  }

  async getLocation(id: string): Promise<MapLocation> {
    return this.fetch<MapLocation>(`/api/locations/${id}`);
  }

  // ─── Floors ─────────────────────────────────
  async getFloors(): Promise<FloorData[]> {
    return this.fetch<FloorData[]>('/api/floors');
  }

  async getFloor(number: number): Promise<FloorData> {
    return this.fetch<FloorData>(`/api/floors/${number}`);
  }

  // ─── Navigation ─────────────────────────────
  async calculateRoute(fromId: string, toId: string, avoidStairs = false): Promise<RouteResult> {
    return this.fetch<RouteResult>('/api/route', {
      method: 'POST',
      body: JSON.stringify({ fromId, toId, avoidStairs }),
    });
  }

  async getGraph(): Promise<GraphData> {
    return this.fetch<GraphData>('/api/route/graph');
  }

  // ─── Health ─────────────────────────────────
  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/health`);
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();

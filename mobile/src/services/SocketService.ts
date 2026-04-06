// ═══════════════════════════════════════════
// Socket.IO Service — Real-time position sync
// ═══════════════════════════════════════════
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../utils/constants';
import { UserPosition, RouteResult } from '../types';

type RouteUpdateCallback = (data: { remainingPath: any[]; completedPercent: number }) => void;
type OffRouteCallback = (data: { recalculatedRoute: RouteResult }) => void;
type ArrivedCallback = (data: { destinationId: string; message: string }) => void;

class SocketService {
  private socket: Socket | null = null;
  private onRouteUpdate: RouteUpdateCallback | null = null;
  private onOffRoute: OffRouteCallback | null = null;
  private onArrived: ArrivedCallback | null = null;

  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(API_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('🔌 Socket connected');
    });

    this.socket.on('user:route_update', (data) => {
      this.onRouteUpdate?.(data);
    });

    this.socket.on('user:off_route', (data) => {
      this.onOffRoute?.(data);
    });

    this.socket.on('user:arrived', (data) => {
      this.onArrived?.(data);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });
  }

  // Send position update to server
  sendPosition(pos: UserPosition): void {
    this.socket?.emit('user:position', {
      x: pos.x,
      y: pos.y,
      floor: pos.floor,
      heading: pos.heading,
      timestamp: pos.timestamp,
    });
  }

  // Start navigation session
  startNavigation(path: any[], destinationId: string): void {
    this.socket?.emit('navigation:start', { path, destinationId });
  }

  // Stop navigation
  stopNavigation(): void {
    this.socket?.emit('navigation:stop');
  }

  // Register callbacks
  setCallbacks(callbacks: {
    onRouteUpdate?: RouteUpdateCallback;
    onOffRoute?: OffRouteCallback;
    onArrived?: ArrivedCallback;
  }): void {
    this.onRouteUpdate = callbacks.onRouteUpdate || null;
    this.onOffRoute = callbacks.onOffRoute || null;
    this.onArrived = callbacks.onArrived || null;
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();

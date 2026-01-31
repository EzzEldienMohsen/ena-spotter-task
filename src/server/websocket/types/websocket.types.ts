// Server-side WebSocket types
import { Server as SocketServer, Socket } from 'socket.io';
import { MonitorSearchPayload, FlightUpdate, MonitoringStatus } from '@/types/websocket';

// Re-export shared types
export type { MonitorSearchPayload, FlightUpdate, MonitoringStatus };

export interface ServerToClientEvents {
  monitoring_started: (status: MonitoringStatus) => void;
  monitoring_stopped: (searchId: string) => void;
  flight_updates: (updates: FlightUpdate[]) => void;
  monitoring_error: (error: { message: string; searchId: string }) => void;
}

export interface ClientToServerEvents {
  start_monitoring: (payload: MonitorSearchPayload) => void;
  stop_monitoring: (searchId: string) => void;
}

export interface InterServerEvents {
  // For future multi-server support
}

export interface SocketData {
  userId?: string;
  searchIds: string[];
}

export type TypedServer = SocketServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export interface SearchMonitor {
  searchId: string;
  searchParams: MonitorSearchPayload['searchParams'];
  intervalId: NodeJS.Timeout;
  clientCount: number;
  lastPoll: number;
  nextPoll: number;
  updateCount: number;
  pollInterval: number;
  lastFlights: any[];
}

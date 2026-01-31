// Custom hook for WebSocket connection to flight monitoring service
import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import type { MonitorSearchPayload, FlightUpdate, MonitoringStatus } from '@/types/websocket';
import { updateFlightPrice, addNewFlight, removeFlight } from '@/lib/redux/slices/flightsSlice';

interface UseFlightWebSocketProps {
  searchId: string;
  searchParams: MonitorSearchPayload['searchParams'];
  enabled?: boolean;
}

interface WebSocketState {
  connected: boolean;
  monitoring: boolean;
  error: string | null;
  updateCount: number;
}

export function useFlightWebSocket({
  searchId,
  searchParams,
  enabled = true,
}: UseFlightWebSocketProps) {
  const dispatch = useDispatch();
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    monitoring: false,
    error: null,
    updateCount: 0,
  });

  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startMonitoring = useCallback(() => {
    if (socketRef.current && searchId && searchParams) {
      console.log('[WebSocket] Starting monitoring for search:', searchId);
      socketRef.current.emit('start_monitoring', {
        searchId,
        searchParams,
      } as MonitorSearchPayload);
    }
  }, [searchId, searchParams]);

  const stopMonitoring = useCallback(() => {
    if (socketRef.current && searchId) {
      console.log('[WebSocket] Stopping monitoring for search:', searchId);
      socketRef.current.emit('stop_monitoring', searchId);
    }
  }, [searchId]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Initialize Socket.io client
    const socket = io({
      path: '/api/socket',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('[WebSocket] Connected');
      setState((prev) => ({ ...prev, connected: true, error: null }));
      startMonitoring();
    });

    socket.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason);
      setState((prev) => ({ ...prev, connected: false, monitoring: false }));
    });

    socket.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error);
      setState((prev) => ({
        ...prev,
        connected: false,
        error: 'Connection error. Retrying...',
      }));
    });

    // Monitoring event handlers
    socket.on('monitoring_started', (status: MonitoringStatus) => {
      console.log('[WebSocket] Monitoring started:', status);
      setState((prev) => ({
        ...prev,
        monitoring: true,
        error: null,
      }));
    });

    socket.on('monitoring_stopped', (stoppedSearchId: string) => {
      console.log('[WebSocket] Monitoring stopped:', stoppedSearchId);
      if (stoppedSearchId === searchId) {
        setState((prev) => ({ ...prev, monitoring: false }));
      }
    });

    socket.on('flight_updates', (updates: FlightUpdate[]) => {
      console.log('[WebSocket] Received flight updates:', updates.length);

      setState((prev) => ({
        ...prev,
        updateCount: prev.updateCount + updates.length,
      }));

      // Process each update
      updates.forEach((update) => {
        switch (update.type) {
          case 'price_change':
            if (update.prices && update.priceChange) {
              dispatch(
                updateFlightPrice({
                  flightId: update.flightId,
                  price: parseFloat(update.prices.total),
                  priceChange: update.priceChange,
                })
              );
            }
            break;

          case 'new_flight':
            // Note: We don't have full flight data in the update
            // In a real implementation, you'd fetch the full flight details
            console.log('[WebSocket] New flight added:', update.flightId);
            break;

          case 'removed_flight':
            dispatch(removeFlight(update.flightId));
            break;
        }
      });
    });

    socket.on('monitoring_error', (error: { message: string; searchId: string }) => {
      console.error('[WebSocket] Monitoring error:', error);
      if (error.searchId === searchId) {
        setState((prev) => ({
          ...prev,
          error: error.message,
        }));
      }
    });

    // Cleanup on unmount
    return () => {
      console.log('[WebSocket] Cleaning up connection');
      stopMonitoring();

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('monitoring_started');
      socket.off('monitoring_stopped');
      socket.off('flight_updates');
      socket.off('monitoring_error');

      socket.close();
      socketRef.current = null;
    };
  }, [enabled, searchId, startMonitoring, stopMonitoring, dispatch]);

  return {
    ...state,
    startMonitoring,
    stopMonitoring,
  };
}

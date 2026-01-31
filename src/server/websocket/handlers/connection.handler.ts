// WebSocket connection handler
import type { TypedSocket } from '../types/websocket.types';
import { FlightMonitoringService } from '../services/flight-monitoring.service';
import type { MonitorSearchPayload } from '@/types/websocket';

export function handleConnection(socket: TypedSocket): void {
  console.log(`[WebSocket] Client connected: ${socket.id}`);

  // Initialize socket data
  if (!socket.data.searchIds) {
    socket.data.searchIds = [];
  }

  // Handle start_monitoring event
  socket.on('start_monitoring', (payload: MonitorSearchPayload) => {
    try {
      console.log(`[WebSocket] Client ${socket.id} starting monitoring for search: ${payload.searchId}`);

      // Join the room for this search
      socket.join(payload.searchId);

      // Track this search ID for cleanup
      if (!socket.data.searchIds.includes(payload.searchId)) {
        socket.data.searchIds.push(payload.searchId);
      }

      // Start monitoring service
      const monitoringService = FlightMonitoringService.getInstance();
      monitoringService.startMonitoring(payload.searchId, payload);

      // Get status and send to client
      const status = monitoringService.getMonitorStatus(payload.searchId);
      if (status) {
        socket.emit('monitoring_started', {
          searchId: payload.searchId,
          active: true,
          lastPoll: status.lastPoll,
          nextPoll: status.nextPoll,
          updateCount: status.updateCount,
        });
      }
    } catch (error) {
      console.error(`[WebSocket] Error starting monitoring:`, error);
      socket.emit('monitoring_error', {
        message: error instanceof Error ? error.message : 'Failed to start monitoring',
        searchId: payload.searchId,
      });
    }
  });

  // Handle stop_monitoring event
  socket.on('stop_monitoring', (searchId: string) => {
    try {
      console.log(`[WebSocket] Client ${socket.id} stopping monitoring for search: ${searchId}`);

      // Leave the room
      socket.leave(searchId);

      // Remove from tracked search IDs
      socket.data.searchIds = socket.data.searchIds.filter((id) => id !== searchId);

      // Stop monitoring service
      const monitoringService = FlightMonitoringService.getInstance();
      monitoringService.stopMonitoring(searchId);

      socket.emit('monitoring_stopped', searchId);
    } catch (error) {
      console.error(`[WebSocket] Error stopping monitoring:`, error);
    }
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log(`[WebSocket] Client disconnected: ${socket.id}`);

    // Clean up all monitored searches for this client
    const monitoringService = FlightMonitoringService.getInstance();

    for (const searchId of socket.data.searchIds) {
      socket.leave(searchId);
      monitoringService.stopMonitoring(searchId);
    }

    socket.data.searchIds = [];
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error(`[WebSocket] Socket error for ${socket.id}:`, error);
  });
}

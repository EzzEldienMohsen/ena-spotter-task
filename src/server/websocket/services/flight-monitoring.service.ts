// Flight monitoring service with adaptive polling
import { TypedServer } from '../types/websocket.types';
import type { MonitorSearchPayload, FlightUpdate } from '@/types/websocket';
import type { SearchMonitor } from '../types/websocket.types';
import { RateLimiterService } from './rate-limiter.service';

export class FlightMonitoringService {
  private static instance: FlightMonitoringService;
  private monitors: Map<string, SearchMonitor> = new Map();
  private rateLimiter: RateLimiterService;
  private io: TypedServer | null = null;

  // Poll intervals in milliseconds
  private readonly INITIAL_INTERVAL = 30000; // 30 seconds
  private readonly ACTIVE_INTERVAL = 15000; // 15 seconds (when changes detected)
  private readonly STABLE_INTERVAL = 60000; // 60 seconds (no changes)

  private constructor() {
    this.rateLimiter = RateLimiterService.getInstance();
  }

  public static getInstance(): FlightMonitoringService {
    if (!FlightMonitoringService.instance) {
      FlightMonitoringService.instance = new FlightMonitoringService();
    }
    return FlightMonitoringService.instance;
  }

  public setSocketServer(io: TypedServer): void {
    this.io = io;
  }

  public startMonitoring(searchId: string, payload: MonitorSearchPayload): void {
    const existingMonitor = this.monitors.get(searchId);

    if (existingMonitor) {
      // Increment client count
      existingMonitor.clientCount++;
      console.log(`[Monitor] Client joined search ${searchId}. Total clients: ${existingMonitor.clientCount}`);
      return;
    }

    // Create new monitor
    const monitor: SearchMonitor = {
      searchId,
      searchParams: payload.searchParams,
      intervalId: null as any,
      clientCount: 1,
      lastPoll: 0,
      nextPoll: Date.now() + this.INITIAL_INTERVAL,
      updateCount: 0,
      pollInterval: this.INITIAL_INTERVAL,
      lastFlights: [],
    };

    // Start polling
    monitor.intervalId = setInterval(
      () => this.pollFlights(searchId),
      this.INITIAL_INTERVAL
    );

    this.monitors.set(searchId, monitor);
    console.log(`[Monitor] Started monitoring search ${searchId}`);

    // Do initial poll immediately
    setTimeout(() => this.pollFlights(searchId), 1000);
  }

  public stopMonitoring(searchId: string): void {
    const monitor = this.monitors.get(searchId);

    if (!monitor) {
      return;
    }

    monitor.clientCount--;
    console.log(`[Monitor] Client left search ${searchId}. Remaining clients: ${monitor.clientCount}`);

    if (monitor.clientCount <= 0) {
      // No more clients, stop monitoring
      clearInterval(monitor.intervalId);
      this.monitors.delete(searchId);
      console.log(`[Monitor] Stopped monitoring search ${searchId}`);
    }
  }

  private async pollFlights(searchId: string): Promise<void> {
    const monitor = this.monitors.get(searchId);

    if (!monitor || !this.io) {
      return;
    }

    try {
      console.log(`[Monitor] Polling flights for search ${searchId}...`);

      // Wait for rate limiter slot
      await this.rateLimiter.waitForSlot();

      // Call Amadeus API
      const newFlights = await this.fetchFlightsFromAmadeus(monitor.searchParams);

      monitor.lastPoll = Date.now();

      // Detect changes
      const updates = this.detectChanges(monitor.lastFlights, newFlights);

      if (updates.length > 0) {
        console.log(`[Monitor] Detected ${updates.length} changes for search ${searchId}`);
        monitor.updateCount += updates.length;

        // Emit updates to all clients in this search room
        this.io.to(searchId).emit('flight_updates', updates);

        // Switch to active polling (more frequent)
        this.adjustPollingInterval(searchId, this.ACTIVE_INTERVAL);
      } else {
        // No changes, switch to stable polling (less frequent)
        this.adjustPollingInterval(searchId, this.STABLE_INTERVAL);
      }

      // Update stored flights
      monitor.lastFlights = newFlights;

    } catch (error) {
      console.error(`[Monitor] Error polling flights for search ${searchId}:`, error);
      this.io.to(searchId).emit('monitoring_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        searchId,
      });
    }
  }

  private adjustPollingInterval(searchId: string, newInterval: number): void {
    const monitor = this.monitors.get(searchId);

    if (!monitor || monitor.pollInterval === newInterval) {
      return;
    }

    console.log(`[Monitor] Adjusting poll interval for ${searchId}: ${monitor.pollInterval}ms -> ${newInterval}ms`);

    // Clear old interval and start new one
    clearInterval(monitor.intervalId);
    monitor.pollInterval = newInterval;
    monitor.intervalId = setInterval(
      () => this.pollFlights(searchId),
      newInterval
    );

    monitor.nextPoll = Date.now() + newInterval;
  }

  private async fetchFlightsFromAmadeus(searchParams: MonitorSearchPayload['searchParams']): Promise<any[]> {
    // Build API URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const url = new URL('/api/flights/search', baseUrl);

    // Add query parameters
    url.searchParams.append('origin', searchParams.origin);
    url.searchParams.append('destination', searchParams.destination);
    url.searchParams.append('departureDate', searchParams.departureDate);
    if (searchParams.returnDate) {
      url.searchParams.append('returnDate', searchParams.returnDate);
    }
    url.searchParams.append('adults', searchParams.adults.toString());
    if (searchParams.children) {
      url.searchParams.append('children', searchParams.children.toString());
    }
    if (searchParams.infants) {
      url.searchParams.append('infants', searchParams.infants.toString());
    }
    if (searchParams.travelClass) {
      url.searchParams.append('travelClass', searchParams.travelClass);
    }
    if (searchParams.nonStop !== undefined) {
      url.searchParams.append('nonStop', searchParams.nonStop.toString());
    }
    if (searchParams.maxResults) {
      url.searchParams.append('maxResults', searchParams.maxResults.toString());
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { flights?: any[] };
    return data.flights || [];
  }

  private detectChanges(oldFlights: any[], newFlights: any[]): FlightUpdate[] {
    const updates: FlightUpdate[] = [];

    // Create maps for quick lookup
    const oldFlightsMap = new Map(oldFlights.map((f) => [f.id, f]));
    const newFlightsMap = new Map(newFlights.map((f) => [f.id, f]));

    // Check for price changes and removed flights
    for (const oldFlight of oldFlights) {
      const newFlight = newFlightsMap.get(oldFlight.id);

      if (!newFlight) {
        // Flight removed
        updates.push({
          type: 'removed_flight',
          flightId: oldFlight.id,
          timestamp: Date.now(),
        });
      } else if (oldFlight.price !== newFlight.price) {
        // Price changed
        updates.push({
          type: 'price_change',
          flightId: newFlight.id,
          prices: {
            total: newFlight.price.toString(),
            base: newFlight.price.toString(),
            currency: newFlight.currency,
          },
          priceChange: newFlight.price < oldFlight.price ? 'down' : 'up',
          timestamp: Date.now(),
        });
      }
    }

    // Check for new flights
    for (const newFlight of newFlights) {
      if (!oldFlightsMap.has(newFlight.id)) {
        updates.push({
          type: 'new_flight',
          flightId: newFlight.id,
          prices: {
            total: newFlight.price.toString(),
            base: newFlight.price.toString(),
            currency: newFlight.currency,
          },
          timestamp: Date.now(),
        });
      }
    }

    return updates;
  }

  public getMonitorStatus(searchId: string) {
    const monitor = this.monitors.get(searchId);

    if (!monitor) {
      return null;
    }

    return {
      searchId: monitor.searchId,
      active: true,
      lastPoll: monitor.lastPoll,
      nextPoll: monitor.nextPoll,
      updateCount: monitor.updateCount,
      clientCount: monitor.clientCount,
      pollInterval: monitor.pollInterval,
    };
  }

  public getAllMonitors() {
    return Array.from(this.monitors.values()).map((monitor) => ({
      searchId: monitor.searchId,
      clientCount: monitor.clientCount,
      updateCount: monitor.updateCount,
      lastPoll: monitor.lastPoll,
      pollInterval: monitor.pollInterval,
    }));
  }

  public cleanup(): void {
    for (const monitor of this.monitors.values()) {
      clearInterval(monitor.intervalId);
    }
    this.monitors.clear();
    console.log('[Monitor] Cleaned up all monitors');
  }
}

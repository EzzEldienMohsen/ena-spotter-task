// Shared WebSocket types for client and server

export interface MonitorSearchPayload {
  searchId: string;
  searchParams: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    children?: number;
    infants?: number;
    travelClass?: string;
    nonStop?: boolean;
    maxResults?: number;
  };
}

export interface FlightUpdate {
  type: 'price_change' | 'new_flight' | 'removed_flight';
  flightId: string;
  prices?: {
    total: string;
    base: string;
    currency: string;
  };
  timestamp: number;
  priceChange?: 'up' | 'down';
}

export interface MonitoringStatus {
  searchId: string;
  active: boolean;
  lastPoll?: number;
  nextPoll?: number;
  updateCount: number;
  error?: string;
}

export interface WebSocketError {
  message: string;
  code?: string;
  timestamp: number;
}

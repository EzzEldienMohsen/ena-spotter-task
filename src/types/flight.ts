export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  price: number;
  currency: string;
  stops: number;
  duration: number; // in minutes
  outbound: FlightSegment;
  inbound?: FlightSegment;
  cabinClass: string;
  lastPriceUpdate?: number;
  priceHistory?: Array<{ price: number; timestamp: number }>;
}

export interface FlightSegment {
  departure: {
    airport: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    time: string;
    date: string;
  };
  duration: number;
  carrierCode: string;
  flightNumber: string;
}

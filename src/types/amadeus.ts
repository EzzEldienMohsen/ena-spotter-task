export interface AmadeusSegment {
  departure: {
    iataCode: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    at: string;
  };
  duration: string;
  carrierCode: string;
  number: string;
}

export interface AmadeusItinerary {
  segments: AmadeusSegment[];
}

export interface AmadeusFlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: AmadeusItinerary[];
  travelerPricings: Array<{
    fareDetailsBySegment: Array<{
      cabin: string;
    }>;
  }>;
}

export interface AmadeusFlightSearchResponse {
  data: AmadeusFlightOffer[];
}

export interface AmadeusSearchRequest {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass: string;
  nonStop: boolean;
  max: number;
}

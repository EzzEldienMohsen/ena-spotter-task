import { Flight, FlightSegment } from '@/types/flight';
import { AmadeusFlightOffer, AmadeusSegment } from '@/types/amadeus';

export function parseDuration(isoDuration: string): number {
  // Convert PT2H30M to minutes (150)
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
  const match = isoDuration.match(regex);

  if (!match) return 0;

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);

  return hours * 60 + minutes;
}

function parseSegment(segment: AmadeusSegment): FlightSegment {
  const departureDateTime = new Date(segment.departure.at);
  const arrivalDateTime = new Date(segment.arrival.at);

  return {
    departure: {
      airport: segment.departure.iataCode,
      time: departureDateTime.toTimeString().slice(0, 5),
      date: departureDateTime.toISOString().split('T')[0],
    },
    arrival: {
      airport: segment.arrival.iataCode,
      time: arrivalDateTime.toTimeString().slice(0, 5),
      date: arrivalDateTime.toISOString().split('T')[0],
    },
    duration: parseDuration(segment.duration),
    carrierCode: segment.carrierCode,
    flightNumber: segment.number,
  };
}

export function parseAmadeusResponse(offers: AmadeusFlightOffer[]): Flight[] {
  return offers.map((offer) => {
    const outboundItinerary = offer.itineraries[0];
    const inboundItinerary = offer.itineraries[1];

    const outboundSegments = outboundItinerary.segments.map(parseSegment);
    const inboundSegments = inboundItinerary ? inboundItinerary.segments.map(parseSegment) : null;

    // Calculate total duration and stops
    const outboundDuration = outboundSegments.reduce((sum, seg) => sum + seg.duration, 0);
    const inboundDuration = inboundSegments ? inboundSegments.reduce((sum, seg) => sum + seg.duration, 0) : 0;
    const totalDuration = outboundDuration + inboundDuration;

    const outboundStops = outboundSegments.length - 1;

    // Get cabin class
    const cabinClass = offer.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || 'ECONOMY';

    // Get primary carrier
    const primaryCarrier = outboundSegments[0].carrierCode;

    return {
      id: offer.id,
      airline: primaryCarrier,
      airlineCode: primaryCarrier,
      price: parseFloat(offer.price.total),
      currency: offer.price.currency,
      stops: outboundStops,
      duration: totalDuration,
      outbound: {
        departure: outboundSegments[0].departure,
        arrival: outboundSegments[outboundSegments.length - 1].arrival,
        duration: outboundDuration,
        carrierCode: primaryCarrier,
        flightNumber: outboundSegments[0].flightNumber,
      },
      inbound: inboundSegments ? {
        departure: inboundSegments[0].departure,
        arrival: inboundSegments[inboundSegments.length - 1].arrival,
        duration: inboundDuration,
        carrierCode: inboundSegments[0].carrierCode,
        flightNumber: inboundSegments[0].flightNumber,
      } : undefined,
      cabinClass,
    };
  });
}

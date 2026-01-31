// Search helper functions
import { SearchParams } from '@/types/search';

export function generateSearchId(searchParams: SearchParams): string {
  // Create a stable hash from search parameters
  const key = JSON.stringify({
    origin: searchParams.origin,
    destination: searchParams.destination,
    departureDate: searchParams.departureDate,
    returnDate: searchParams.returnDate,
    adults: searchParams.passengers.adults,
    children: searchParams.passengers.children,
    infants: searchParams.passengers.infants,
    cabinClass: searchParams.cabinClass,
  });

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return `search_${Math.abs(hash)}`;
}

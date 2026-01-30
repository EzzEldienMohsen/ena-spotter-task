import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectRawFlights = (state: RootState) => state.flights.rawResults;
export const selectFilters = (state: RootState) => state.flights.filters;
export const selectSort = (state: RootState) => state.flights.sort;

export const selectFilteredFlights = createSelector(
  [selectRawFlights, selectFilters, selectSort],
  (rawFlights, filters, sort) => {
    let filtered = [...rawFlights];

    // Filter by stops
    if (filters.stops.length > 0) {
      filtered = filtered.filter(flight => filters.stops.includes(flight.stops));
    }

    // Filter by price range
    filtered = filtered.filter(
      flight => flight.price >= filters.priceRange.min && flight.price <= filters.priceRange.max
    );

    // Filter by airlines
    if (filters.airlines.length > 0) {
      filtered = filtered.filter(flight => filters.airlines.includes(flight.airlineCode));
    }

    // Filter by max duration
    if (filters.maxDuration !== null) {
      filtered = filtered.filter(flight => flight.duration <= filters.maxDuration!);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sort.by) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
        case 'departure':
          comparison = new Date(a.outbound.departure.date + 'T' + a.outbound.departure.time).getTime() -
                      new Date(b.outbound.departure.date + 'T' + b.outbound.departure.time).getTime();
          break;
      }

      return sort.order === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }
);

export const selectPriceGraphData = createSelector(
  [selectFilteredFlights],
  (filteredFlights) => {
    if (filteredFlights.length === 0) return [];

    const prices = filteredFlights.map(f => f.price);
    const minPrice = Math.floor(Math.min(...prices) / 100) * 100;
    const maxPrice = Math.ceil(Math.max(...prices) / 100) * 100;

    const bucketSize = 100;
    const buckets: { [key: number]: number } = {};

    // Initialize buckets
    for (let i = minPrice; i <= maxPrice; i += bucketSize) {
      buckets[i] = 0;
    }

    // Count flights in each bucket
    filteredFlights.forEach(flight => {
      const bucket = Math.floor(flight.price / bucketSize) * bucketSize;
      if (buckets[bucket] !== undefined) {
        buckets[bucket]++;
      }
    });

    // Convert to array format for Recharts
    return Object.entries(buckets)
      .map(([price, count]) => ({
        priceRange: `$${price}-$${Number(price) + bucketSize}`,
        count,
        minPrice: Number(price),
      }))
      .filter(bucket => bucket.count > 0);
  }
);

export const selectFilterOptions = createSelector(
  [selectRawFlights],
  (rawFlights) => {
    if (rawFlights.length === 0) {
      return {
        airlines: [],
        minPrice: 0,
        maxPrice: 10000,
        maxDuration: 1440,
      };
    }

    const airlines = Array.from(new Set(rawFlights.map(f => f.airlineCode)));
    const prices = rawFlights.map(f => f.price);
    const durations = rawFlights.map(f => f.duration);

    return {
      airlines: airlines.sort(),
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
      maxDuration: Math.ceil(Math.max(...durations)),
    };
  }
);

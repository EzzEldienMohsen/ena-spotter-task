'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/lib/redux/hooks';
import ResultsHeader from '@/components/organisms/ResultsHeader';
import FilterSidebar from '@/components/organisms/FilterSidebar';
import FlightList from '@/components/organisms/FlightList';
import PriceGraph from '@/components/organisms/PriceGraph';
import LoadingOverlay from '@/components/organisms/LoadingOverlay';
import ErrorAlert from '@/components/molecules/ErrorAlert';
import LiveUpdateBadge from '@/components/molecules/LiveUpdateBadge';
import { useFlightWebSocket } from '@/lib/hooks/useFlightWebSocket';
import { generateSearchId } from '@/lib/utils/search-helpers';

export default function ResultsPage() {
  const t = useTranslations('results');
  const error = useAppSelector((state) => state.ui.error);
  const searchState = useAppSelector((state) => state.search);
  const [showFilters, setShowFilters] = useState(false);

  // Generate stable search ID from search parameters
  const searchId = useMemo(() => {
    if (!searchState.origin || !searchState.destination || !searchState.departureDate) {
      return '';
    }
    return generateSearchId({
      origin: searchState.origin,
      destination: searchState.destination,
      departureDate: searchState.departureDate,
      returnDate: searchState.returnDate || undefined,
      passengers: searchState.passengers,
      cabinClass: searchState.cabinClass,
    });
  }, [searchState]);

  // Initialize WebSocket connection for live updates
  const wsState = useFlightWebSocket({
    searchId,
    searchParams: {
      origin: searchState.origin || '',
      destination: searchState.destination || '',
      departureDate: searchState.departureDate || '',
      returnDate: searchState.returnDate || undefined,
      adults: searchState.passengers.adults,
      children: searchState.passengers.children,
      infants: searchState.passengers.infants,
      travelClass: searchState.cabinClass,
    },
    enabled: !!searchId,
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-base-200">
      <LoadingOverlay />
      <LiveUpdateBadge
        connected={wsState.connected}
        monitoring={wsState.monitoring}
        updateCount={wsState.updateCount}
        error={wsState.error}
      />

      <div className="container mx-auto px-4 py-6">
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} />
          </div>
        )}

        <ResultsHeader />

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <button
            className="btn btn-primary w-full"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? t('hideFilters') : t('showFilters')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar - Hidden on mobile unless toggled */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <FilterSidebar />
          </aside>

          {/* Main Content */}
          <div className="space-y-6">
            <PriceGraph />
            <FlightList />
          </div>
        </div>
      </div>
    </div>
  );
}

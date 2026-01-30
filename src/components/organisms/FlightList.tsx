'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { selectFilteredFlights } from '@/lib/redux/selectors/flightSelectors';
import { resetFilters } from '@/lib/redux/slices/flightsSlice';
import FlightCard from '@/components/molecules/FlightCard';
import Skeleton from '@/components/atoms/Skeleton';
import Button from '@/components/atoms/Button';

export default function FlightList() {
  const t = useTranslations('errors');
  const tCommon = useTranslations('common');
  const dispatch = useAppDispatch();
  const flights = useAppSelector(selectFilteredFlights);
  const isLoading = useAppSelector((state) => state.ui.isSearching);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card bg-base-100 shadow-md p-6">
            <div className="flex gap-4">
              <Skeleton height="h-12" width="w-12" className="rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton height="h-4" width="w-1/3" />
                <Skeleton height="h-4" width="w-2/3" />
                <Skeleton height="h-4" width="w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="card bg-base-100 shadow-md">
        <div className="card-body items-center text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-base-content/20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-bold mt-4">{t('noFlightsFound')}</h3>
          <p className="text-base-content/70">{t('tryAdjusting')}</p>
          <Button variant="primary" onClick={() => dispatch(resetFilters())} className="mt-4">
            {tCommon('clear')} {tCommon('filter')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  );
}

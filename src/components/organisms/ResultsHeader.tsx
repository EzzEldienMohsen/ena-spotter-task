'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setSort } from '@/lib/redux/slices/flightsSlice';
import { selectFilteredFlights } from '@/lib/redux/selectors/flightSelectors';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';

export default function ResultsHeader() {
  const t = useTranslations('results');
  const tSort = useTranslations('sort');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useAppSelector((state) => state.search);
  const sort = useAppSelector((state) => state.flights.sort);
  const filteredFlights = useAppSelector(selectFilteredFlights);

  const handleSortChange = (value: string) => {
    const [by, order] = value.split('-');
    dispatch(setSort({ by: by as 'price' | 'duration' | 'departure', order: order as 'asc' | 'desc' }));
  };

  const sortValue = `${sort.by}-${sort.order}`;

  return (
    <div className="bg-base-100 rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {searchParams.origin} → {searchParams.destination}
          </h2>
          <p className="text-base-content/70">
            {searchParams.departureDate}
            {searchParams.returnDate && ` - ${searchParams.returnDate}`} • {' '}
            {searchParams.passengers.adults + searchParams.passengers.children + searchParams.passengers.infants}{' '}
            {t('flight')}
          </p>
          <p className="text-sm font-semibold mt-2">
            {filteredFlights.length} {t('flightsFound')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="w-full sm:w-48">
            <Select
              value={sortValue}
              onChange={(e) => handleSortChange(e.target.value)}
              options={[
                { value: 'price-asc', label: tSort('priceLowHigh') },
                { value: 'price-desc', label: tSort('priceHighLow') },
                { value: 'duration-asc', label: tSort('durationShortest') },
                { value: 'duration-desc', label: tSort('durationLongest') },
                { value: 'departure-asc', label: tSort('departureEarliest') },
                { value: 'departure-desc', label: tSort('departureLatest') },
              ]}
            />
          </div>
          <Button variant="secondary" onClick={() => router.push('/')}>
            {t('modifySearch')}
          </Button>
        </div>
      </div>
    </div>
  );
}

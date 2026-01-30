'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { searchFlights } from '@/lib/redux/slices/flightsSlice';
import { setSearchParams, addRecentSearch } from '@/lib/redux/slices/searchSlice';
import { setLoading, setError } from '@/lib/redux/slices/uiSlice';
import AirportAutocomplete from '@/components/molecules/AirportAutocomplete';
import PassengerSelector from '@/components/molecules/PassengerSelector';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import { CABIN_CLASSES } from '@/lib/constants/cabin-classes';
import { SearchParams } from '@/types/search';

export default function SearchForm() {
  const t = useTranslations('search');
  const tErrors = useTranslations('errors');
  const tCabin = useTranslations('cabinClass');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchState = useAppSelector((state) => state.search);
  const isLoading = useAppSelector((state) => state.ui.isSearching);

  const [origin, setOrigin] = useState<string>(searchState.origin || '');
  const [destination, setDestination] = useState<string>(searchState.destination || '');
  const [departureDate, setDepartureDate] = useState<string>(searchState.departureDate || '');
  const [returnDate, setReturnDate] = useState<string>(searchState.returnDate || '');
  const [passengers, setPassengers] = useState(searchState.passengers);
  const [cabinClass, setCabinClass] = useState(searchState.cabinClass);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!origin) newErrors.origin = tErrors('originRequired');
    if (!destination) newErrors.destination = tErrors('destinationRequired');
    if (!departureDate) newErrors.departureDate = tErrors('departureDateRequired');

    if (returnDate && new Date(returnDate) <= new Date(departureDate)) {
      newErrors.returnDate = tErrors('returnDateInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const searchParams: SearchParams = {
      origin,
      destination,
      departureDate,
      returnDate: returnDate || undefined,
      passengers,
      cabinClass,
    };

    dispatch(setSearchParams(searchParams));
    dispatch(addRecentSearch(searchParams));
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      await dispatch(searchFlights(searchParams)).unwrap();
      router.push('/results');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="label">
            <span className="label-text">{t('from')}</span>
          </label>
          <AirportAutocomplete
            value={origin}
            onChange={setOrigin}
            placeholder={t('selectOrigin')}
            error={errors.origin}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('to')}</span>
          </label>
          <AirportAutocomplete
            value={destination}
            onChange={setDestination}
            placeholder={t('selectDestination')}
            error={errors.destination}
          />
        </div>

        <div>
          <label className="label" htmlFor="departureDate">
            <span className="label-text">{t('departureDate')}</span>
          </label>
          <input
            id="departureDate"
            type="date"
            className={`input input-bordered w-full ${errors.departureDate ? 'input-error' : ''}`}
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            min={today}
            aria-label={t('departureDate')}
          />
          {errors.departureDate && <p className="text-error text-sm mt-1">{errors.departureDate}</p>}
        </div>

        <div>
          <label className="label" htmlFor="returnDate">
            <span className="label-text">{t('returnDate')}</span>
          </label>
          <input
            id="returnDate"
            type="date"
            className={`input input-bordered w-full ${errors.returnDate ? 'input-error' : ''}`}
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={departureDate || today}
            aria-label={t('returnDate')}
          />
          {errors.returnDate && <p className="text-error text-sm mt-1">{errors.returnDate}</p>}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('passengers')}</span>
          </label>
          <PassengerSelector value={passengers} onChange={setPassengers} />
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('cabinClass')}</span>
          </label>
          <Select
            value={cabinClass}
            onChange={(e) => setCabinClass(e.target.value as 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST')}
            options={CABIN_CLASSES.map(c => ({
              value: c.value,
              label: tCabin(c.value === 'ECONOMY' ? 'economy' : c.value === 'PREMIUM_ECONOMY' ? 'premiumEconomy' : c.value === 'BUSINESS' ? 'business' : 'first')
            }))}
          />
        </div>
      </div>

      <div className="mt-6">
        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
          {t('searchFlights')}
        </Button>
      </div>
    </form>
  );
}

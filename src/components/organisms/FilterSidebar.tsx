'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { updateFilter, resetFilters } from '@/lib/redux/slices/flightsSlice';
import { selectFilterOptions } from '@/lib/redux/selectors/flightSelectors';
import Checkbox from '@/components/atoms/Checkbox';
import Button from '@/components/atoms/Button';
import { formatDuration, formatPrice } from '@/lib/utils/formatters';
import { getAirlineName } from '@/lib/constants/airlines';

export default function FilterSidebar() {
  const t = useTranslations('filters');
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.flights.filters);
  const filterOptions = useAppSelector(selectFilterOptions);
  const currency = useAppSelector((state) => state.flights.metadata.currency);

  const [airlineSearch, setAirlineSearch] = useState('');
  const [priceMin, setPriceMin] = useState(filters.priceRange.min);
  const [priceMax, setPriceMax] = useState(filters.priceRange.max);
  const [maxDuration, setMaxDuration] = useState(filters.maxDuration || filterOptions.maxDuration);

  // Debounce price filter
  const handlePriceChange = (min: number, max: number) => {
    setPriceMin(min);
    setPriceMax(max);
    const timeoutId = setTimeout(() => {
      dispatch(updateFilter({ priceRange: { min, max } }));
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  // Debounce duration filter
  const handleDurationChange = (duration: number) => {
    setMaxDuration(duration);
    const timeoutId = setTimeout(() => {
      dispatch(updateFilter({ maxDuration: duration }));
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const handleStopChange = (stops: number, checked: boolean) => {
    const newStops = checked
      ? [...filters.stops, stops]
      : filters.stops.filter((s) => s !== stops);
    dispatch(updateFilter({ stops: newStops }));
  };

  const handleAirlineChange = (airlineCode: string, checked: boolean) => {
    const newAirlines = checked
      ? [...filters.airlines, airlineCode]
      : filters.airlines.filter((a) => a !== airlineCode);
    dispatch(updateFilter({ airlines: newAirlines }));
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setPriceMin(filterOptions.minPrice);
    setPriceMax(filterOptions.maxPrice);
    setMaxDuration(filterOptions.maxDuration);
  };

  const filteredAirlines = useMemo(() => {
    if (!airlineSearch) return filterOptions.airlines;
    const searchLower = airlineSearch.toLowerCase();
    return filterOptions.airlines.filter(
      (code) =>
        code.toLowerCase().includes(searchLower) ||
        getAirlineName(code).toLowerCase().includes(searchLower)
    );
  }, [airlineSearch, filterOptions.airlines]);

  const activeFilterCount =
    filters.stops.length +
    filters.airlines.length +
    (filters.maxDuration !== null && filters.maxDuration < filterOptions.maxDuration ? 1 : 0);

  return (
    <div className="bg-base-100 rounded-lg shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{t('title')}</h3>
        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={handleReset} className="btn-sm">
            {t('clearAll')} ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Stops Filter */}
      <div className="space-y-3">
        <h4 className="font-semibold">{t('stops')}</h4>
        <Checkbox
          label={t('direct')}
          checked={filters.stops.includes(0)}
          onChange={(e) => handleStopChange(0, e.target.checked)}
        />
        <Checkbox
          label={t('oneStop')}
          checked={filters.stops.includes(1)}
          onChange={(e) => handleStopChange(1, e.target.checked)}
        />
        <Checkbox
          label={t('twoStops')}
          checked={filters.stops.includes(2)}
          onChange={(e) => handleStopChange(2, e.target.checked)}
        />
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2">
        <h4 className="font-semibold">{t('priceRange')}</h4>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{formatPrice(priceMin, currency)}</span>
            <span>{formatPrice(priceMax, currency)}</span>
          </div>
          <input
            type="range"
            min={filterOptions.minPrice}
            max={priceMax}
            value={priceMin}
            onChange={(e) => handlePriceChange(Number(e.target.value), priceMax)}
            className="range range-primary range-xs"
            aria-label={t('minPrice')}
            title={t('minPrice')}
          />
          <input
            type="range"
            min={priceMin}
            max={filterOptions.maxPrice}
            value={priceMax}
            onChange={(e) => handlePriceChange(priceMin, Number(e.target.value))}
            className="range range-primary range-xs"
            aria-label={t('maxPrice')}
            title={t('maxPrice')}
          />
        </div>
      </div>

      {/* Max Duration Filter */}
      <div className="space-y-2">
        <h4 className="font-semibold">{t('maxDuration')}</h4>
        <div className="text-sm mb-2">{formatDuration(maxDuration)}</div>
        <input
          type="range"
          min={0}
          max={filterOptions.maxDuration}
          value={maxDuration}
          onChange={(e) => handleDurationChange(Number(e.target.value))}
          className="range range-primary"
          aria-label={t('maxFlightDuration')}
          title={t('maxFlightDuration')}
        />
      </div>

      {/* Airlines Filter */}
      <div className="space-y-2">
        <h4 className="font-semibold">{t('airlines')}</h4>
        <input
          type="text"
          placeholder={t('searchAirlines')}
          className="input input-bordered input-sm w-full"
          value={airlineSearch}
          onChange={(e) => setAirlineSearch(e.target.value)}
        />
        <div className="max-h-48 overflow-y-auto space-y-1">
          {filteredAirlines.map((airlineCode) => (
            <Checkbox
              key={airlineCode}
              label={`${getAirlineName(airlineCode)} (${airlineCode})`}
              checked={filters.airlines.includes(airlineCode)}
              onChange={(e) => handleAirlineChange(airlineCode, e.target.checked)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

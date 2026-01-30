'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/lib/redux/hooks';
import ResultsHeader from '@/components/organisms/ResultsHeader';
import FilterSidebar from '@/components/organisms/FilterSidebar';
import FlightList from '@/components/organisms/FlightList';
import PriceGraph from '@/components/organisms/PriceGraph';
import LoadingOverlay from '@/components/organisms/LoadingOverlay';
import ErrorAlert from '@/components/molecules/ErrorAlert';

export default function ResultsPage() {
  const t = useTranslations('results');
  const error = useAppSelector((state) => state.ui.error);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <LoadingOverlay />

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

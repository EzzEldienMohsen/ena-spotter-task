'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { selectPriceGraphData } from '@/lib/redux/selectors/flightSelectors';
import { updateFilter } from '@/lib/redux/slices/flightsSlice';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function PriceGraph() {
  const t = useTranslations('results');
  const tCommon = useTranslations('common');
  const dispatch = useAppDispatch();
  const graphData = useAppSelector(selectPriceGraphData);

  const handleBarClick = (data: unknown) => {
    const clickData = data as { minPrice?: number };
    if (clickData && clickData.minPrice !== undefined) {
      const min = clickData.minPrice;
      const max = clickData.minPrice + 100;
      dispatch(updateFilter({ priceRange: { min, max } }));
    }
  };

  if (graphData.length === 0) {
    return (
      <div className="card bg-base-100 shadow-md">
        <div className="card-body items-center text-center">
          <p className="text-base-content/70">{tCommon('noResults')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h3 className="card-title">{t('priceDistribution')}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="priceRange" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} ${t('flight')}`, tCommon('filter')]}
              labelFormatter={(label) => `${label}`}
            />
            <Bar
              dataKey="count"
              fill="#3b82f6"
              onClick={handleBarClick}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-base-content/70 text-center mt-2">
          {t('clickBar')}
        </p>
      </div>
    </div>
  );
}

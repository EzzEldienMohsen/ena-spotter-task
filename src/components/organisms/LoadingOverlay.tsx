'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/lib/redux/hooks';
import Spinner from '@/components/atoms/Spinner';

export default function LoadingOverlay() {
  const t = useTranslations('loading');
  const isLoading = useAppSelector((state) => state.ui.isSearching);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-base-100 rounded-lg p-8 flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-lg font-semibold">{t('searchingFlights')}</p>
        <p className="text-sm text-base-content/70">{t('pleaseWait')}</p>
      </div>
    </div>
  );
}

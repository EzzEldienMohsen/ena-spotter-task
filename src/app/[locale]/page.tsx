'use client';

import { useTranslations } from 'next-intl';
import SearchForm from '@/components/organisms/SearchForm';
import LoadingOverlay from '@/components/organisms/LoadingOverlay';

export default function Home() {
  const t = useTranslations('search');

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-base-200">
      <LoadingOverlay />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-base-content/70">
            {t('subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <SearchForm />
        </div>

        <div className="mt-12 text-center text-sm text-base-content/60">
          <p>{t('poweredBy')}</p>
        </div>
      </div>
    </div>
  );
}

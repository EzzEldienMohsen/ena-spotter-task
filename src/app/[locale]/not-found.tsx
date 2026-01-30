'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body items-center text-center">
            {/* 404 Illustration */}
            <div className="mb-6">
              <div className="relative">
                <h1 className="text-9xl font-bold text-primary/20">404</h1>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-32 h-32 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-4xl font-bold mb-4">
              {t('title')}
            </h2>

            {/* Description */}
            <p className="text-lg text-base-content/70 mb-6 max-w-md">
              {t('description')}
            </p>

            {/* Action Buttons */}
            <div className="card-actions flex-col sm:flex-row gap-3">
              <Link href="/" className="btn btn-primary btn-lg gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {t('goHome')}
              </Link>

              <button
                onClick={() => window.history.back()}
                className="btn btn-outline btn-lg gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                {t('goBack')}
              </button>
            </div>

            {/* Error Code */}
            <div className="mt-8 text-sm text-base-content/50">
              <p>{t('errorCode')}</p>
            </div>
          </div>
        </div>

        {/* Fun Stats */}
        <div className="mt-6">
          <div className="stats stats-vertical sm:stats-horizontal shadow w-full bg-base-100">
            <div className="stat place-items-center">
              <div className="stat-figure text-primary">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div className="stat-title">{t('flights')}</div>
              <div className="stat-value text-primary">50+</div>
              <div className="stat-desc">{t('destinations')}</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-figure text-secondary">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="stat-title">{t('speed')}</div>
              <div className="stat-value text-secondary">{t('realtime')}</div>
              <div className="stat-desc">{t('searchResults')}</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-figure text-accent">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="stat-title">{t('quality')}</div>
              <div className="stat-value text-accent">99.9%</div>
              <div className="stat-desc">{t('accuracy')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

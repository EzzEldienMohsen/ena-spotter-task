'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');

  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body items-center text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <svg
                className="w-24 h-24 text-error mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Error Title */}
            <h1 className="text-4xl font-bold text-error mb-4">
              {t('title')}
            </h1>

            {/* Error Message */}
            <p className="text-lg text-base-content/70 mb-2">
              {t('description')}
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="alert alert-error mt-4 text-left">
                <div className="flex flex-col gap-2 w-full">
                  <span className="font-semibold">{t('errorDetails')}</span>
                  <code className="text-sm break-all">
                    {error.message || 'Unknown error'}
                  </code>
                  {error.digest && (
                    <span className="text-xs opacity-70">
                      {t('errorId')} {error.digest}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Error Description */}
            <div className="divider my-6"></div>

            <div className="space-y-2 text-base-content/60 mb-6">
              <p>{t('couldBeDue')}</p>
              <ul className="list-disc list-inside text-left max-w-md mx-auto space-y-1">
                <li>{t('reason1')}</li>
                <li>{t('reason2')}</li>
                <li>{t('reason3')}</li>
                <li>{t('reason4')}</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="card-actions flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={reset}
                className="btn btn-primary btn-lg gap-2"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {t('tryAgain')}
              </button>

              <Link href="/" className="btn btn-outline btn-lg gap-2">
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
                {t('common:home')}
              </Link>
            </div>

            {/* Support Info */}
            <div className="mt-8 text-sm text-base-content/50">
              <p>{t('support')}</p>
            </div>
          </div>
        </div>

        {/* Additional Help Card */}
        <div className="mt-6 text-center">
          <div className="stats stats-vertical sm:stats-horizontal shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="stat-title">{t('needHelp')}</div>
              <div className="stat-value text-primary text-2xl">24/7</div>
              <div className="stat-desc">{t('supportAvailable')}</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="stat-title">{t('uptime')}</div>
              <div className="stat-value text-secondary text-2xl">99.9%</div>
              <div className="stat-desc">{t('reliableService')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

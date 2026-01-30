'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('globalError');

  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center">
              {/* Critical Error Icon */}
              <div className="mb-6">
                <svg
                  className="w-28 h-28 text-red-500 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h1 className="text-5xl font-bold text-gray-800 mb-4">
                {t('title')}
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 mb-6">
                {t('description')}
              </p>

              {/* Error Details Box */}
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-sm font-semibold text-red-800 mb-3">
                  {t('technicalDetails')}
                </h3>
                <div className="bg-white rounded p-4 font-mono text-sm text-red-600 break-all max-h-48 overflow-y-auto">
                  {error.message || 'Unknown critical error occurred'}
                </div>
                {error.digest && (
                  <p className="text-xs text-red-500 mt-3">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>

              {/* What Happened */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('whatHappened')}
                </h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>{t('reason1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>{t('reason2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>{t('reason3')}</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <button
                  onClick={reset}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {t('restartApp')}
                </button>

                <button
                  onClick={() => window.location.href = '/'}
                  className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Go to Homepage
                </button>
              </div>

              {/* Help Section */}
              <div className="border-t-2 border-gray-200 pt-6">
                <p className="text-sm text-gray-500 mb-4">
                  {t('ifPersists')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-blue-600 font-semibold mb-1">{t('clearCache')}</div>
                    <div className="text-gray-600 text-xs">{t('clearCacheDesc')}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-blue-600 font-semibold mb-1">{t('updateBrowser')}</div>
                    <div className="text-gray-600 text-xs">{t('updateBrowserDesc')}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-blue-600 font-semibold mb-1">{t('contactSupport')}</div>
                    <div className="text-gray-600 text-xs">{t('contactSupportDesc')}</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 text-xs text-gray-400">
                <p>{t('footer')}</p>
                <p className="mt-1">{t('apology')}</p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

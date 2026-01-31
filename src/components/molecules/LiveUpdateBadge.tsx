'use client';

import { useTranslations } from 'next-intl';

interface LiveUpdateBadgeProps {
  connected: boolean;
  monitoring: boolean;
  updateCount: number;
  error?: string | null;
}

export default function LiveUpdateBadge({
  connected,
  monitoring,
  updateCount,
  error,
}: LiveUpdateBadgeProps) {
  const t = useTranslations('results');

  if (!connected && !monitoring) {
    return null;
  }

  const getBadgeContent = () => {
    if (error) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span>{error}</span>
        </div>
      );
    }

    if (!connected) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
          <span>{t('reconnecting')}</span>
        </div>
      );
    }

    if (monitoring) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>{t('live')}</span>
          {updateCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-green-600 dark:bg-green-700 text-white rounded-full text-xs">
              {updateCount}
            </span>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
      {getBadgeContent()}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import ThemeToggle from '@/components/theme/ThemeToggle';
import LanguageSwitcher from '@/components/theme/LanguageSwitcher';

export default function Header() {
  const t = useTranslations('common');

  return (
    <header className="bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="navbar min-h-16">
          {/* Logo/Title */}
          <div className="flex-1">
            <Link href="/" className="btn btn-ghost text-xl font-bold">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              {t('appName')}
            </Link>
          </div>

          {/* Actions */}
          <div className="flex-none gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

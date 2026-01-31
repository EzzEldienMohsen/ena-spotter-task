'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('notFound');
  const locale = useLocale();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-base-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Clouds */}
        <div className="absolute top-20 left-10 w-32 h-16 bg-base-content/5 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-40 h-20 bg-base-content/5 rounded-full blur-xl animate-float-delay"></div>
        <div className="absolute bottom-32 left-1/3 w-36 h-18 bg-base-content/5 rounded-full blur-xl animate-float"></div>

        {/* Decorative Circles */}
        <div className="absolute top-10 right-10 w-2 h-2 bg-primary/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-secondary/30 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-accent/30 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Main Card */}
        <div className="card bg-base-100/95 backdrop-blur-sm shadow-2xl border border-base-300">
          <div className="card-body items-center text-center p-8 md:p-12">
            {/* Animated Airplane Icon */}
            <div className="mb-8 relative">
              {/* Flight Path */}
              <svg className="w-full h-32 absolute inset-0" viewBox="0 0 400 100">
                <path
                  d="M 0,50 Q 100,20 200,50 T 400,50"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="10,5"
                  className="text-primary/30"
                />
              </svg>

              {/* Airplane */}
              <div className="relative animate-plane-fly">
                <svg
                  className="w-24 h-24 mx-auto text-primary drop-shadow-lg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </div>
            </div>

            {/* 404 Text with Gradient */}
            <div className="mb-4">
              <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                404
              </h1>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-base-content">
              {t('title')}
            </h2>

            {/* Description */}
            <p className="text-lg text-base-content/70 mb-8 max-w-lg leading-relaxed">
              {t('description')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href={`/${locale}`}
                className="btn btn-primary btn-lg gap-2 group"
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
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
                className="btn btn-outline btn-lg gap-2 group"
              >
                <svg
                  className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
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

            {/* Quick Links */}
            <div className="text-sm text-base-content/60">
              <p className="mb-2 font-semibold">{t('quickLinks')}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link href={`/${locale}`} className="link link-primary">
                  {t('flights')}
                </Link>
                <span>•</span>
                <Link href={`/${locale}`} className="link link-primary">
                  {t('destinations')}
                </Link>
                <span>•</span>
                <Link href={`/${locale}`} className="link link-primary">
                  {t('searchResults')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="card bg-base-100/95 backdrop-blur-sm shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
            <div className="card-body items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-base-content/70">{t('destinations')}</div>
            </div>
          </div>

          <div className="card bg-base-100/95 backdrop-blur-sm shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
            <div className="card-body items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-secondary">{t('realtime')}</div>
              <div className="text-sm text-base-content/70">{t('searchResults')}</div>
            </div>
          </div>

          <div className="card bg-base-100/95 backdrop-blur-sm shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
            <div className="card-body items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-accent">99.9%</div>
              <div className="text-sm text-base-content/70">{t('accuracy')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

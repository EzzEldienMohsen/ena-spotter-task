'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Flight } from '@/types/flight';
import { formatDuration, formatPrice, formatTime } from '@/lib/utils/formatters';
import { getAirlineName } from '@/lib/constants/airlines';
import Badge from '@/components/atoms/Badge';

interface FlightCardProps {
  flight: Flight;
  priceChange?: 'up' | 'down' | 'new';
}

export default function FlightCard({ flight, priceChange }: FlightCardProps) {
  const t = useTranslations('flight');

  const getPriceChangeBadge = () => {
    if (!priceChange) return null;

    const badges = {
      up: (
        <div className="absolute top-2 right-2 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-medium animate-bounce">
          ↑ {t('priceUp')}
        </div>
      ),
      down: (
        <div className="absolute top-2 right-2 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-xs font-medium animate-bounce">
          ↓ {t('priceDown')}
        </div>
      ),
      new: (
        <div className="absolute top-2 right-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium animate-pulse">
          {t('new')}
        </div>
      ),
    };

    return badges[priceChange];
  };

  return (
    <div className={`card bg-base-100 shadow-md hover:shadow-lg transition-shadow relative ${priceChange ? 'ring-2 ring-primary' : ''}`}>
      {getPriceChangeBadge()}
      <div className="card-body">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Airline Info */}
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-12 flex items-center justify-center">
                <span className="text-xs">{flight.airlineCode}</span>
              </div>
            </div>
            <div>
              <div className="font-semibold">{getAirlineName(flight.airlineCode)}</div>
              <div className="text-sm text-base-content/70">{flight.airlineCode}</div>
            </div>
          </div>

          {/* Outbound Flight Details */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-2xl font-bold">{formatTime(flight.outbound.departure.time)}</div>
                <div className="text-sm">{flight.outbound.departure.airport}</div>
              </div>

              <div className="text-center px-4">
                <div className="text-sm text-base-content/70">{formatDuration(flight.outbound.duration)}</div>
                <div className="border-t-2 border-base-content/20 my-1"></div>
                <div className="text-xs">
                  {flight.stops === 0 ? t('direct') : `${flight.stops} ${flight.stops === 1 ? t('stop') : t('stops')}`}
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold">{formatTime(flight.outbound.arrival.time)}</div>
                <div className="text-sm">{flight.outbound.arrival.airport}</div>
              </div>
            </div>

            {/* Return Flight if exists */}
            {flight.inbound && (
              <div className="flex items-center justify-between mt-2 pt-2 border-t">
                <div>
                  <div className="text-xl font-bold">{formatTime(flight.inbound.departure.time)}</div>
                  <div className="text-sm">{flight.inbound.departure.airport}</div>
                </div>

                <div className="text-center px-4">
                  <div className="text-sm text-base-content/70">{formatDuration(flight.inbound.duration)}</div>
                  <div className="border-t-2 border-base-content/20 my-1"></div>
                </div>

                <div>
                  <div className="text-xl font-bold">{formatTime(flight.inbound.arrival.time)}</div>
                  <div className="text-sm">{flight.inbound.arrival.airport}</div>
                </div>
              </div>
            )}
          </div>

          {/* Price and Action */}
          <div className="flex flex-col items-end gap-2">
            <div className="text-3xl font-bold text-primary">{formatPrice(flight.price, flight.currency)}</div>
            <Badge variant="secondary">{flight.cabinClass}</Badge>
            <button className="btn btn-primary btn-sm">{t('select')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

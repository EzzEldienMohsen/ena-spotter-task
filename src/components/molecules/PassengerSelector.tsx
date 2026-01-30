'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

interface PassengerSelectorProps {
  value: PassengerCount;
  onChange: (passengers: PassengerCount) => void;
}

export default function PassengerSelector({ value, onChange }: PassengerSelectorProps) {
  const t = useTranslations('search');
  const [isOpen, setIsOpen] = useState(false);

  const increment = (type: keyof PassengerCount) => {
    onChange({ ...value, [type]: value[type] + 1 });
  };

  const decrement = (type: keyof PassengerCount) => {
    const min = type === 'adults' ? 1 : 0;
    if (value[type] > min) {
      onChange({ ...value, [type]: value[type] - 1 });
    }
  };

  const total = value.adults + value.children + value.infants;

  return (
    <div className="relative w-full">
      <div
        className="input input-bordered w-full cursor-pointer flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {total} {t('passenger')}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full bg-base-100 shadow-lg rounded-box mt-1 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span>{t('adults')}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-circle btn-sm"
                onClick={() => decrement('adults')}
                disabled={value.adults <= 1}
              >
                -
              </button>
              <span className="w-8 text-center">{value.adults}</span>
              <button
                type="button"
                className="btn btn-circle btn-sm"
                onClick={() => increment('adults')}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>{t('children')}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-circle btn-sm"
                onClick={() => decrement('children')}
                disabled={value.children <= 0}
              >
                -
              </button>
              <span className="w-8 text-center">{value.children}</span>
              <button
                type="button"
                className="btn btn-circle btn-sm"
                onClick={() => increment('children')}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>{t('infants')}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-circle btn-sm"
                onClick={() => decrement('infants')}
                disabled={value.infants <= 0}
              >
                -
              </button>
              <span className="w-8 text-center">{value.infants}</span>
              <button
                type="button"
                className="btn btn-circle btn-sm"
                onClick={() => increment('infants')}
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm w-full"
            onClick={() => setIsOpen(false)}
          >
            {t('done')}
          </button>
        </div>
      )}
    </div>
  );
}

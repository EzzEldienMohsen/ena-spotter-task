'use client';

import React, { useState, useMemo } from 'react';
import { AIRPORTS } from '@/lib/constants/airports';
import Input from '@/components/atoms/Input';

interface AirportAutocompleteProps {
  value: string;
  onChange: (airportCode: string) => void;
  placeholder?: string;
  error?: string;
}

export default function AirportAutocomplete({
  value,
  onChange,
  placeholder = 'Select airport',
  error,
}: AirportAutocompleteProps) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredAirports = useMemo(() => {
    if (!search) return AIRPORTS.slice(0, 10);

    const searchLower = search.toLowerCase();
    return AIRPORTS.filter(
      (airport) =>
        airport.code.toLowerCase().includes(searchLower) ||
        airport.name.toLowerCase().includes(searchLower) ||
        airport.city.toLowerCase().includes(searchLower)
    ).slice(0, 10);
  }, [search]);

  const selectedAirport = AIRPORTS.find(a => a.code === value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    // Clear the selected value when user starts typing
    if (value) {
      onChange('');
    }
  };

  return (
    <div className="relative w-full">
      <Input
        value={selectedAirport ? `${selectedAirport.code} - ${selectedAirport.city}` : search}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        placeholder={placeholder}
        error={error}
      />

      {showDropdown && (
        <ul className="absolute z-10 w-full bg-base-100 shadow-lg rounded-box mt-1 max-h-60 overflow-auto">
          {filteredAirports.map((airport) => (
            <li
              key={airport.code}
              className="px-4 py-2 hover:bg-base-200 cursor-pointer"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(airport.code);
                setSearch('');
                setShowDropdown(false);
              }}
            >
              <div className="font-semibold">{airport.code} - {airport.city}</div>
              <div className="text-sm text-base-content/70">{airport.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

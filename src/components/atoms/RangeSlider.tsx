import React from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export default function RangeSlider({ min, max, value, onChange, label }: RangeSliderProps) {
  const inputId = label ? label.toLowerCase().replace(/\s+/g, '-') : undefined;

  return (
    <div className="w-full">
      {label && <label className="label" htmlFor={inputId}><span className="label-text">{label}</span></label>}
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range range-primary"
        aria-label={label || 'Range slider'}
        title={label || 'Range slider'}
      />
      <div className="w-full flex justify-between text-xs px-2 mt-1">
        <span>{min}</span>
        <span>{value}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

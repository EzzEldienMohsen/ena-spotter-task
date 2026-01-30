import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className="label cursor-pointer justify-start gap-2">
      <input type="checkbox" className={`checkbox ${className}`} {...props} />
      <span className="label-text">{label}</span>
    </label>
  );
}

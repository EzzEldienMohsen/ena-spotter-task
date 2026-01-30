import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  const variantClasses = {
    default: '',
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
  };

  return <span className={`badge ${variantClasses[variant]}`}>{children}</span>;
}

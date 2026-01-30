import React from 'react';

interface SkeletonProps {
  height?: string;
  width?: string;
  className?: string;
}

export default function Skeleton({ height = 'h-4', width = 'w-full', className = '' }: SkeletonProps) {
  return <div className={`skeleton ${height} ${width} ${className}`}></div>;
}

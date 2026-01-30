export interface FilterState {
  stops: number[]; // [0, 1, 2]
  priceRange: { min: number; max: number };
  airlines: string[];
  maxDuration: number | null;
}

export interface SortConfig {
  by: 'price' | 'duration' | 'departure';
  order: 'asc' | 'desc';
}

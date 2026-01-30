import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchParams } from '@/types/search';

interface SearchState {
  origin: string | null;
  destination: string | null;
  departureDate: string | null;
  returnDate: string | null;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  recentSearches: SearchParams[];
}

const initialState: SearchState = {
  origin: null,
  destination: null,
  departureDate: null,
  returnDate: null,
  passengers: {
    adults: 1,
    children: 0,
    infants: 0,
  },
  cabinClass: 'ECONOMY',
  recentSearches: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<Partial<SearchParams>>) => {
      if (action.payload.origin !== undefined) state.origin = action.payload.origin;
      if (action.payload.destination !== undefined) state.destination = action.payload.destination;
      if (action.payload.departureDate !== undefined) state.departureDate = action.payload.departureDate;
      if (action.payload.returnDate !== undefined) state.returnDate = action.payload.returnDate;
      if (action.payload.passengers !== undefined) state.passengers = action.payload.passengers;
      if (action.payload.cabinClass !== undefined) state.cabinClass = action.payload.cabinClass;
    },
    clearSearch: (state) => {
      state.origin = null;
      state.destination = null;
      state.departureDate = null;
      state.returnDate = null;
      state.passengers = { adults: 1, children: 0, infants: 0 };
      state.cabinClass = 'ECONOMY';
    },
    addRecentSearch: (state, action: PayloadAction<SearchParams>) => {
      const exists = state.recentSearches.some(
        s => s.origin === action.payload.origin &&
             s.destination === action.payload.destination &&
             s.departureDate === action.payload.departureDate
      );
      if (!exists) {
        state.recentSearches = [action.payload, ...state.recentSearches.slice(0, 4)];
      }
    },
  },
});

export const { setSearchParams, clearSearch, addRecentSearch } = searchSlice.actions;
export default searchSlice.reducer;

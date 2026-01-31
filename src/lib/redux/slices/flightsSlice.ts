import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Flight } from '@/types/flight';
import { FilterState, SortConfig } from '@/types/filters';
import { SearchParams } from '@/types/search';
import { searchFlightsAPI } from '@/lib/api/amadeus/flights';

interface FlightsState {
  rawResults: Flight[];
  filters: FilterState;
  sort: SortConfig;
  metadata: {
    totalResults: number;
    currency: string;
  };
}

const initialState: FlightsState = {
  rawResults: [],
  filters: {
    stops: [],
    priceRange: { min: 0, max: 10000 },
    airlines: [],
    maxDuration: null,
  },
  sort: {
    by: 'price',
    order: 'asc',
  },
  metadata: {
    totalResults: 0,
    currency: 'USD',
  },
};

export const searchFlights = createAsyncThunk(
  'flights/searchFlights',
  async (searchParams: SearchParams, { rejectWithValue }) => {
    try {
      const results = await searchFlightsAPI(searchParams);
      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search flights';
      return rejectWithValue(errorMessage);
    }
  }
);

const flightsSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    setFlightResults: (state, action: PayloadAction<Flight[]>) => {
      state.rawResults = action.payload;
      state.metadata.totalResults = action.payload.length;

      // Auto-set price range based on results
      if (action.payload.length > 0) {
        const prices = action.payload.map(f => f.price);
        state.filters.priceRange = {
          min: Math.floor(Math.min(...prices)),
          max: Math.ceil(Math.max(...prices)),
        };
      }
    },
    updateFilter: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      const prices = state.rawResults.map(f => f.price);
      state.filters = {
        stops: [],
        priceRange: prices.length > 0 ? {
          min: Math.floor(Math.min(...prices)),
          max: Math.ceil(Math.max(...prices)),
        } : { min: 0, max: 10000 },
        airlines: [],
        maxDuration: null,
      };
    },
    setSort: (state, action: PayloadAction<SortConfig>) => {
      state.sort = action.payload;
    },
    clearResults: (state) => {
      state.rawResults = [];
      state.metadata.totalResults = 0;
      state.filters = initialState.filters;
    },
    updateFlightPrice: (state, action: PayloadAction<{ flightId: string; price: number; priceChange: 'up' | 'down' }>) => {
      const flight = state.rawResults.find(f => f.id === action.payload.flightId);
      if (flight) {
        // Add to price history
        if (!flight.priceHistory) {
          flight.priceHistory = [];
        }
        flight.priceHistory.push({
          price: flight.price,
          timestamp: Date.now(),
        });

        // Update price and timestamp
        flight.price = action.payload.price;
        flight.lastPriceUpdate = Date.now();
      }
    },
    addNewFlight: (state, action: PayloadAction<Flight>) => {
      // Add new flight at the beginning
      state.rawResults.unshift(action.payload);
      state.metadata.totalResults = state.rawResults.length;

      // Update price range if needed
      const prices = state.rawResults.map(f => f.price);
      state.filters.priceRange = {
        min: Math.floor(Math.min(...prices)),
        max: Math.ceil(Math.max(...prices)),
      };
    },
    removeFlight: (state, action: PayloadAction<string>) => {
      state.rawResults = state.rawResults.filter(f => f.id !== action.payload);
      state.metadata.totalResults = state.rawResults.length;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchFlights.fulfilled, (state, action) => {
      state.rawResults = action.payload;
      state.metadata.totalResults = action.payload.length;

      if (action.payload.length > 0) {
        const prices = action.payload.map(f => f.price);
        state.filters.priceRange = {
          min: Math.floor(Math.min(...prices)),
          max: Math.ceil(Math.max(...prices)),
        };
        state.metadata.currency = action.payload[0].currency;
      }
    });
  },
});

export const {
  setFlightResults,
  updateFilter,
  resetFilters,
  setSort,
  clearResults,
  updateFlightPrice,
  addNewFlight,
  removeFlight,
} = flightsSlice.actions;

export default flightsSlice.reducer;

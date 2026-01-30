import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface UiState {
  isSearching: boolean;
  error: string | null;
  toast: Toast | null;
}

const initialState: UiState = {
  isSearching: false,
  error: null,
  toast: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    showToast: (state, action: PayloadAction<Toast>) => {
      state.toast = action.payload;
    },
    hideToast: (state) => {
      state.toast = null;
    },
  },
});

export const { setLoading, setError, showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;

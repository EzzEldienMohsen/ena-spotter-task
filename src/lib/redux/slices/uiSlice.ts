import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/nextjs';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface Breadcrumb {
  message: string;
  category: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  timestamp: number;
  data?: Record<string, unknown>;
}

interface ErrorPayload {
  message: string;
  context?: Record<string, unknown>;
  severity?: 'error' | 'warning' | 'info';
}

interface UiState {
  isSearching: boolean;
  error: string | null;
  toast: Toast | null;
  breadcrumbs: Breadcrumb[];
}

const initialState: UiState = {
  isSearching: false,
  error: null,
  toast: null,
  breadcrumbs: [],
};

const MAX_BREADCRUMBS = 50;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;

      // Add breadcrumb for loading state changes
      const breadcrumb: Breadcrumb = {
        message: action.payload ? 'Search started' : 'Search completed',
        category: 'ui.loading',
        level: 'info',
        timestamp: Date.now(),
        data: { isSearching: action.payload },
      };

      state.breadcrumbs.push(breadcrumb);
      if (state.breadcrumbs.length > MAX_BREADCRUMBS) {
        state.breadcrumbs.shift();
      }

      Sentry.addBreadcrumb({
        message: breadcrumb.message,
        category: breadcrumb.category,
        level: breadcrumb.level,
        data: breadcrumb.data,
      });
    },

    setError: (state, action: PayloadAction<string | ErrorPayload | null>) => {
      if (action.payload === null) {
        state.error = null;
        return;
      }

      const errorData = typeof action.payload === 'string'
        ? { message: action.payload, severity: 'error' as const }
        : action.payload;

      state.error = errorData.message;

      // Add breadcrumb for error
      const breadcrumb: Breadcrumb = {
        message: errorData.message,
        category: 'ui.error',
        level: errorData.severity || 'error',
        timestamp: Date.now(),
        data: errorData.context,
      };

      state.breadcrumbs.push(breadcrumb);
      if (state.breadcrumbs.length > MAX_BREADCRUMBS) {
        state.breadcrumbs.shift();
      }

      // Capture error in Sentry
      Sentry.captureException(new Error(errorData.message), {
        level: errorData.severity || 'error',
        contexts: {
          error: {
            ...errorData.context,
          },
        },
        tags: {
          component: 'uiSlice',
        },
      });
    },

    showToast: (state, action: PayloadAction<Toast>) => {
      state.toast = action.payload;

      // Add breadcrumb for toast
      const breadcrumb: Breadcrumb = {
        message: action.payload.message,
        category: 'ui.toast',
        level: action.payload.type === 'error' ? 'error' : 'info',
        timestamp: Date.now(),
        data: { type: action.payload.type },
      };

      state.breadcrumbs.push(breadcrumb);
      if (state.breadcrumbs.length > MAX_BREADCRUMBS) {
        state.breadcrumbs.shift();
      }

      Sentry.addBreadcrumb({
        message: breadcrumb.message,
        category: breadcrumb.category,
        level: breadcrumb.level,
        data: breadcrumb.data,
      });
    },

    hideToast: (state) => {
      state.toast = null;
    },

    addBreadcrumb: (state, action: PayloadAction<Omit<Breadcrumb, 'timestamp'>>) => {
      const breadcrumb: Breadcrumb = {
        ...action.payload,
        timestamp: Date.now(),
      };

      state.breadcrumbs.push(breadcrumb);
      if (state.breadcrumbs.length > MAX_BREADCRUMBS) {
        state.breadcrumbs.shift();
      }

      Sentry.addBreadcrumb({
        message: breadcrumb.message,
        category: breadcrumb.category,
        level: breadcrumb.level,
        data: breadcrumb.data,
      });
    },

    clearBreadcrumbs: (state) => {
      state.breadcrumbs = [];
    },
  },
});

export const {
  setLoading,
  setError,
  showToast,
  hideToast,
  addBreadcrumb,
  clearBreadcrumbs
} = uiSlice.actions;

export default uiSlice.reducer;

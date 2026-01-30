import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import searchReducer from './slices/searchSlice';
import flightsReducer from './slices/flightsSlice';
import uiReducer from './slices/uiSlice';

const searchPersistConfig = {
  key: 'search',
  storage,
  whitelist: ['recentSearches'],
};

const persistedSearchReducer = persistReducer(searchPersistConfig, searchReducer);

export const store = configureStore({
  reducer: {
    search: persistedSearchReducer,
    flights: flightsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

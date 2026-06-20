import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth';
import { communityReducer } from './community';
import { sessionsReducer } from './sessions';
import { navigationReducer } from './navigation';
import { teacherReducer } from './teacher';
import { alertReducer } from './alert';
import { privateReducer } from './private';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teacher: teacherReducer,
    navigation: navigationReducer,
    sessions: sessionsReducer,
    alert: alertReducer,
    community: communityReducer,
    private: privateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { warnAfter: 128 },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

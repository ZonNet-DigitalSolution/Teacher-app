import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth';
import { sessionsReducer } from './sessions';
import { navigationReducer } from './navigation';
import { teacherReducer } from './teacher';
import { alertReducer } from './alert';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teacher: teacherReducer,
    navigation: navigationReducer,
    sessions: sessionsReducer,
    alert: alertReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

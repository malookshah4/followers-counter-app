import { configureStore } from '@reduxjs/toolkit';
// We'll create and import our slices here later
import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
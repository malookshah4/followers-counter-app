import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  profile: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to set user state upon successful login
    setLogin: (state, action) => {
      state.isAuthenticated = true;
      state.profile = action.payload;
    },
    // Action to reset user state on logout
    setLogout: (state) => {
      state.isAuthenticated = false;
      state.profile = null;
    },
  },
});

// THIS IS THE LINE THAT WAS MISSING/INCORRECT BEFORE
// It exports the `setLogin` and `setLogout` action creators
export const { setLogin, setLogout } = userSlice.actions;

// This exports the reducer function itself for the store
export default userSlice.reducer;
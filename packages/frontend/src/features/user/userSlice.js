
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  profile: null,
  stars: 0, 
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isAuthenticated = true;
      state.profile = action.payload.profile; // Assumes profile is nested
      state.stars = action.payload.stars; // Save stars on login
    },
    setLogout: (state) => {
      state.isAuthenticated = false;
      state.profile = null;
      state.stars = 0; // Reset stars on logout
    },
    // Action to update stars after creating a campaign or earning
    updateStars: (state, action) => {
        state.stars = action.payload;
    }
  },
});

export const { setLogin, setLogout, updateStars } = userSlice.actions;

export default userSlice.reducer;
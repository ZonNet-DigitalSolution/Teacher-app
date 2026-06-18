import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  communityBadgeCount: number;
  scheduleBadgeCount: number;
  groupsBadgeCount: number;
  privateBadgeCount: number;
}

const initialState: NavigationState = {
  communityBadgeCount: 0,
  scheduleBadgeCount: 0,
  groupsBadgeCount: 0,
  privateBadgeCount: 0,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCommunityBadge(state, action: PayloadAction<number>) {
      state.communityBadgeCount = action.payload;
    },
    clearCommunityBadge(state) {
      state.communityBadgeCount = 0;
    },
    setPrivateBadge(state, action: PayloadAction<number>) {
      state.privateBadgeCount = action.payload;
    },
    incrementPrivateBadge(state) {
      state.privateBadgeCount += 1;
    },
    clearPrivateBadge(state) {
      state.privateBadgeCount = 0;
    },
  },
});

export const {
  setCommunityBadge,
  clearCommunityBadge,
  setPrivateBadge,
  incrementPrivateBadge,
  clearPrivateBadge,
} = navigationSlice.actions;

export default navigationSlice.reducer;

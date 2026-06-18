import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  communityBadgeCount: number;
  scheduleBadgeCount: number;
  groupsBadgeCount: number;
}

const initialState: NavigationState = {
  communityBadgeCount: 0,
  scheduleBadgeCount: 0,
  groupsBadgeCount: 0,
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
  },
});

export const { setCommunityBadge, clearCommunityBadge } = navigationSlice.actions;

export default navigationSlice.reducer;

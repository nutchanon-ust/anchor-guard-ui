import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.analytics || initialState;

export const selectAnalytics = createSelector([selectSlice], state => state);

export const selectBidPools = createSelector(
  [selectSlice],
  state => state.bidPools,
);

export const selectLiquidationProfile = createSelector(
  [selectSlice],
  state => state.liquidationProfile,
);

export const selectLunaPrice = createSelector(
  [selectSlice],
  state => state.lunaPrice,
);

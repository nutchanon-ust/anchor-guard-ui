import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.myBids || initialState;

export const selectLoading = createSelector(
  [selectDomain],
  myBidsState => myBidsState.loading,
);

export const selectMyBids = createSelector(
  [selectDomain],
  myBidsState => myBidsState.myBids,
);
